//! Example showing how to integrate Galileo map into your egui application.

use galileo::control::{EventPropagation, UserEvent, UserEventHandler};
use galileo::layer::raster_tile_layer::RasterTileLayerBuilder;
use galileo::layer::{FeatureLayer, Layer, feature_layer};
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
    let handler: Box<dyn UserEventHandler> =
        Box::new(move |ev: &UserEvent, map: &mut Map| match ev {
            UserEvent::DragStarted(mouse_button, event) => {
                println!("DragStarted: {:?} {:?}", mouse_button, event);

                let Some(position) = map.view().screen_to_map(event.screen_pointer_position) else {
                    return EventPropagation::Stop;
                };

                let resolution = map.view().resolution();

                for layer in map.layers().iter() {
                    if let Some(feature_layer) = layer_as_point_feature_layer(layer) {
                        if feature_layer
                            .get_features_at(&position, resolution * 7.0)
                            .next()
                            .is_some()
                        {
                            return EventPropagation::Consume;
                        }
                    }
                }
                EventPropagation::Propagate
            }
            UserEvent::Drag(mouse_button, second, third) => {
                println!("Drag: {:?} {:?} {:?}", mouse_button, second, third);
                EventPropagation::Stop
            }
            _ => EventPropagation::Propagate,
        });
    let mut builder = galileo_egui::InitBuilder::new(create_map())
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

    let vector_layer: FeatureLayer<_, _, _, CartesianSpace2d> = FeatureLayer::new(
        vec![
            geo::point!(x: 127.9784, y: 37.566).to_geo2d(),
            geo::point!(x: 128.9784, y: 37.566).to_geo2d(),
        ]
        .into_iter()
        .map(|p| projection.project(&p).unwrap())
        .collect::<Vec<Point2>>(),
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
