//! Example showing how to integrate Galileo map into your egui application.

use std::sync::{Arc, RwLock};

use galileo::control::{EventPropagation, UserEvent, UserEventHandler};
use galileo::layer::raster_tile_layer::RasterTileLayerBuilder;
use galileo::layer::{FeatureId, FeatureLayer, Layer, feature_layer};
use galileo::symbol::{CirclePointSymbol, SimpleContourSymbol};
use galileo::{Color, Map, MapBuilder};
use galileo_egui::{EguiMap, EguiMapState};
use galileo_types::cartesian::Point2;
use galileo_types::geo::impls::GeoPoint2d;
use galileo_types::geo::{Crs, GeoPoint};
use galileo_types::geometry_type::{CartesianSpace2d, GeoSpace2d};
use galileo_types::{Disambig, Disambiguate};
#[cfg(target_family = "wasm")]
use wasm_bindgen::prelude::*;

struct EguiMapApp {
    map: EguiMapState,
    position: GeoPoint2d,
    resolution: f64,
}

impl EguiMapApp {
    fn new(map_state: EguiMapState) -> Self {
        let position = map_state
            .map()
            .view()
            .position()
            .expect("invalid map position");
        let resolution = map_state.map().view().resolution();

        Self {
            map: map_state,
            position,
            resolution,
        }
    }
}

impl eframe::App for EguiMapApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(ctx, |ui| {
            EguiMap::new(&mut self.map)
                .with_position(&mut self.position)
                .with_resolution(&mut self.resolution)
                .show_ui(ui);

            egui::Window::new("Galileo map").show(ctx, |ui| {
                ui.label("Map center position:");
                ui.label(format!(
                    "Lat: {:.4} Lon: {:.4}",
                    self.position.lat(),
                    self.position.lon()
                ));

                ui.separator();
                ui.label("Map resolution:");
                ui.label(format!("{:6}", self.resolution));
            });
        });
    }
}

#[cfg(target_family = "wasm")]
#[cfg_attr(target_family = "wasm", wasm_bindgen)]
pub fn main() {
    console_error_panic_hook::set_once();
    run();
}

pub fn run() {
    // TODO can't featureid be sync?
    let feature_id = Arc::new(RwLock::new(None::<FeatureId>));

    let handler: Box<dyn UserEventHandler> =
        Box::new(move |ev: &UserEvent, map: &mut Map| match ev {
            UserEvent::DragStarted(mouse_button, event) => {
                handle_drag_started(mouse_button, event, map, &feature_id)
            }
            UserEvent::Drag(mouse_button, delta, event) => {
                handle_drag(mouse_button, delta, event, &feature_id, map)
            }
            _ => EventPropagation::Propagate,
        });

    let map = create_map();

    let mut builder = galileo_egui::InitBuilder::new(map)
        .with_app_builder(|egui_map_state| Box::new(EguiMapApp::new(egui_map_state)))
        .with_handlers(vec![handler]);

    #[cfg(target_family = "wasm")]
    {
        builder = builder.with_web_options(eframe::WebOptions {
            should_stop_propagation: Box::new(|_| false),
            should_prevent_default: Box::new(|_| false),
            ..Default::default()
        });
    }

    builder.init().expect("failed to initialize");
}

fn handle_drag(
    _mouse_button: &galileo::control::MouseButton,
    _delta: &galileo_types::cartesian::Vector2<f64>,
    event: &galileo::control::MouseEvent,
    feature_id_arc: &Arc<RwLock<Option<FeatureId>>>,
    map: &mut Map,
) -> EventPropagation {
    let opt_feature_id_to_drag = *feature_id_arc.read().unwrap();
    if let Some(feature_id_to_drag) = opt_feature_id_to_drag {
        let Some(new_feature_position) = map.view().screen_to_map(event.screen_pointer_position)
        else {
            eprintln!("Failed to convert screen position to map coordinates");
            return EventPropagation::Stop;
        };

        let mut needs_redraw = false;
        for layer_trait_object in map.layers_mut().iter_mut() {
            if let Some(feature_layer) = layer_trait_object
                .as_any_mut()
                .downcast_mut::<FeatureLayer<Point2, Point2, CirclePointSymbol, CartesianSpace2d>>()
            {
                if let Some(point_to_update) =
                    feature_layer.features_mut().get_mut(feature_id_to_drag)
                {
                    *point_to_update = new_feature_position;
                    feature_layer.update_feature(feature_id_to_drag);
                    needs_redraw = true;
                    break;
                }
            }
        }

        if needs_redraw {
            map.redraw();
            return EventPropagation::Consume;
        }

        return EventPropagation::Stop;
    } else {
        EventPropagation::Propagate
    }
}

fn handle_drag_started(
    mouse_button: &galileo::control::MouseButton,
    event: &galileo::control::MouseEvent,
    map: &mut galileo::Map,
    feature_id_arc: &Arc<RwLock<Option<FeatureId>>>,
) -> EventPropagation {
    println!("DragStarted: {:?} {:?}", mouse_button, event);

    let Some(position) = map.view().screen_to_map(event.screen_pointer_position) else {
        eprintln!(
            "Failed to convert screen position to map Cartesian coordinates for drag_started"
        );
        return EventPropagation::Stop;
    };

    let resolution = map.view().resolution();

    for layer_trait_object in map.layers().iter() {
        if let Some(feature_layer) = layer_as_point_feature_layer(layer_trait_object) {
            if let Some((found_feature_id, _point_properties)) = feature_layer
                .get_features_at(&position, resolution * 7.0)
                .next()
            {
                let mut feature_id_writer = (*feature_id_arc).write().unwrap();
                *feature_id_writer = Some(found_feature_id);
                return EventPropagation::Consume;
            }
        }
    }
    EventPropagation::Propagate
}

fn layer_as_point_feature_layer(
    layer: &dyn Layer,
) -> Option<&FeatureLayer<Point2, Point2, CirclePointSymbol, CartesianSpace2d>> {
    layer
        .as_any()
        .downcast_ref::<FeatureLayer<Point2, Point2, CirclePointSymbol, CartesianSpace2d>>()
}

fn create_map() -> Map {
    let layer = RasterTileLayerBuilder::new_osm()
        .with_file_cache_checked(".tile_cache")
        .build()
        .expect("failed to create layer");

    let projection = Crs::EPSG3857
        .get_projection()
        .expect("must find projection");

    let points_geometries: Vec<Point2> = vec![
        geo::point!(x: 127.9784, y: 37.566).to_geo2d(),
        geo::point!(x: 128.9784, y: 37.566).to_geo2d(),
    ]
    .into_iter()
    .map(|p_geo| projection.project(&p_geo).expect("Point projection failed"))
    .collect();

    let vector_layer: FeatureLayer<Point2, Point2, _, CartesianSpace2d> = FeatureLayer::new(
        points_geometries,
        CirclePointSymbol {
            color: Color::GREEN,
            size: 10.0,
        },
        Crs::EPSG3857,
    );

    let vector_layer2: FeatureLayer<_, _, _, GeoSpace2d> = FeatureLayer::new(
        vec![
            geo::line_string![
                geo::coord!(x: 127.9784, y: 37.566),
                geo::coord!(x: 128.9784, y: 37.566),
            ]
            .to_geo2d(),
        ],
        SimpleContourSymbol {
            color: Color::BLUE,
            width: 3.0,
        },
        Crs::WGS84,
    );

    MapBuilder::default()
        .with_latlon(37.566, 128.9784)
        .with_z_level(8)
        .with_layer(layer)
        .with_layer(vector_layer2)
        .with_layer(vector_layer)
        .build()
}
