//! Example showing how to integrate Galileo map into your egui application.

use std::collections::HashMap;
use std::sync::{Arc, RwLock};

use galileo::control::{EventPropagation, UserEvent, UserEventHandler};
use galileo::layer::raster_tile_layer::RasterTileLayerBuilder;
use galileo::layer::{FeatureId, FeatureLayer, Layer, feature_layer::Feature};
use galileo::symbol::{CirclePointSymbol, SimpleContourSymbol};
use galileo::{Color, Map, MapBuilder};
use galileo_egui::InitBuilder; // EguiMapState and EguiMap are used in app_ui.rs
use galileo_types::Disambiguate;
use galileo_types::cartesian::Point2;
use galileo_types::contour::Contour as ContourTrait;
use galileo_types::geo::impls::GeoPoint2d;
use galileo_types::geo::{Crs, GeoPoint, NewGeoPoint};
use galileo_types::geometry_type::{CartesianSpace2d, GeoSpace2d};
use galileo_types::impls::Contour;
use geo::Distance;
use geo::{Haversine, LineString}; // Assuming Haversine struct is used for distance

#[cfg(target_family = "wasm")]
use wasm_bindgen::prelude::*;

pub mod app_ui; // Declare the new module
use app_ui::EguiMapApp; // Import the struct

// Configuration Structs
#[derive(Debug, Clone, Copy)]
pub struct PointConfig {
    pub lon: f64,
    pub lat: f64,
}

#[derive(Debug, Clone, Copy)]
pub struct LineConfig {
    pub start: PointConfig,
    pub end: PointConfig,
}

#[derive(Debug, Clone)]
pub struct MapViewConfig {
    pub center_lon: f64,
    pub center_lat: f64,
    pub zoom: u32,
}

#[derive(Debug, Clone)]
pub struct MapGeometryConfig {
    pub draggable_points: Vec<PointConfig>,
    pub line: LineConfig,
}

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub map_view: MapViewConfig,
    pub geometries: MapGeometryConfig,
}

impl Default for AppConfig {
    fn default() -> Self {
        AppConfig {
            map_view: MapViewConfig {
                center_lon: 128.9784,
                center_lat: 37.566,
                zoom: 8,
            },
            geometries: MapGeometryConfig {
                draggable_points: vec![
                    PointConfig {
                        lon: 127.9784,
                        lat: 37.566,
                    },
                    PointConfig {
                        lon: 128.9784,
                        lat: 37.566,
                    },
                ],
                line: LineConfig {
                    start: PointConfig {
                        lon: 127.9784,
                        lat: 37.566,
                    },
                    end: PointConfig {
                        lon: 128.9784,
                        lat: 37.566,
                    },
                },
            },
        }
    }
}

#[cfg(target_family = "wasm")]
#[cfg_attr(target_family = "wasm", wasm_bindgen)]
pub fn main() {
    console_error_panic_hook::set_once();
    run(AppConfig::default()); // Pass default config to run
}

pub fn run(config: AppConfig) {
    let projection_for_initial_points = Crs::EPSG3857
        .get_projection::<GeoPoint2d, Point2>()
        .expect("must find projection for initial points");

    // Create initial_points_data from AppConfig
    let initial_points_data: Vec<Point2> = config
        .geometries
        .draggable_points
        .iter()
        .map(|p_config| {
            // Convert PointConfig to geo::Point for Disambiguate trait
            let geo_type_point = geo::Point::new(p_config.lon, p_config.lat);
            // Disambiguate and then convert to galileo_types::geo::Point for projection
            let p_geo_disambig = geo_type_point.to_geo2d(); // p_geo is Disambig<geo::Point<f64>, GeoSpace2d>
            let galileo_geo_point = GeoPoint2d::lonlat(p_geo_disambig.lon(), p_geo_disambig.lat());
            projection_for_initial_points
                .project(&galileo_geo_point)
                .expect("Initial point projection failed")
        })
        .collect();

    // Holds the Cartesian coordinates (Point2) of the two draggable points.
    // This data is kept in sync with the map layer's points and is also used as the source
    // to update the endpoints of the line feature connecting these points.
    let shared_points_data = Arc::new(RwLock::new(initial_points_data.clone()));

    // Maps the FeatureId of a draggable point to its original index (0 or 1) in the initial_points_data
    // and subsequently in shared_points_data. This is used to update the correct point in shared_points_data.
    let feature_id_to_index_map = Arc::new(RwLock::new(HashMap::<FeatureId, usize>::new()));

    // Stores the FeatureId of the line feature (from vector_layer2).
    // This ID is used in `handle_drag` to specifically target the line feature for geometry updates
    // when one of the draggable points (its endpoints) moves.
    let line_feature_id_arc = Arc::new(RwLock::new(None::<FeatureId>));

    let shared_haversine_distance = Arc::new(RwLock::new(None::<f64>));

    // Pass geometry and view configs to create_map
    let map_instance = create_map(
        initial_points_data, // This is already projected Vec<Point2>
        &config.geometries,  // Pass reference to geometry config
        &config.map_view,    // Pass reference to view config
        line_feature_id_arc.clone(),
    );

    // Populate the feature_id_to_index_map
    {
        let mut map_writer = feature_id_to_index_map.write().unwrap();
        let mut layer_found_and_mapped = false;
        // Iterate over layers to find the one we want to map IDs from.
        // This assumes it's the first FeatureLayer of its specific type, or you might need a more robust way to identify it (e.g., layer ID).
        for layer_trait_object in map_instance.layers().iter() {
            if let Some(feature_layer) = layer_trait_object.as_any().downcast_ref::<FeatureLayer<
                Point2,
                Point2,
                CirclePointSymbol,
                CartesianSpace2d,
            >>() {
                println!("Found target FeatureLayer for ID mapping.");
                for (original_index, (feature_id, _point_feature)) in
                    feature_layer.features().iter().enumerate()
                {
                    map_writer.insert(feature_id, original_index);
                    println!(
                        "Mapping actual FeatureId {:?} to original_index {}",
                        feature_id, original_index
                    );
                }
                layer_found_and_mapped = true;
                break; // Found and mapped our layer
            }
        }
        if !layer_found_and_mapped {
            eprintln!(
                "WARNING: Could not find the target FeatureLayer to build the FeatureId-to-index map."
            );
        }
    }

    let selected_feature_id_handler = Arc::new(RwLock::new(None::<FeatureId>));

    let handler_shared_points = shared_points_data.clone();
    let handler_id_map = feature_id_to_index_map.clone();
    let handler_line_id = line_feature_id_arc.clone();
    let handler_distance = shared_haversine_distance.clone();

    let handler: Box<dyn UserEventHandler> = Box::new(move |ev: &UserEvent, map: &mut Map| {
        let captured_shared_points = handler_shared_points.clone();
        let captured_id_map = handler_id_map.clone();
        let captured_line_id = handler_line_id.clone();
        let captured_distance = handler_distance.clone();
        match ev {
            UserEvent::DragStarted(mouse_button, event) => {
                handle_drag_started(mouse_button, event, map, &selected_feature_id_handler)
            }
            UserEvent::Drag(mouse_button, delta, event) => {
                match handle_drag(
                    mouse_button,
                    delta,
                    event,
                    &selected_feature_id_handler,
                    map,
                    &captured_shared_points,
                    &captured_id_map,
                    &captured_line_id,
                    &captured_distance,
                ) {
                    Ok(propagation) => propagation,
                    Err(e) => {
                        eprintln!("An error occurred during drag: {:?}", e);
                        EventPropagation::Stop // Default to Stop on error, or choose another suitable propagation.
                    }
                }
            }
            _ => EventPropagation::Propagate,
        }
    });
    let mut builder = galileo_egui::InitBuilder::new(map_instance);

    builder = builder
        .with_app_builder(move |egui_map_state| {
            Box::new(EguiMapApp::new(
                egui_map_state,
                shared_haversine_distance.clone(),
            ))
        })
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

#[derive(Debug)]
pub enum DragError {
    ScreenToMapConversionFailed,
    SelectedFeatureIdMissing,
    // Point update related errors
    PointFeatureNotFoundInLayer(FeatureId),
    FailedToUpdateSharedPointIndex(FeatureId, usize), // feature_id, index
    FailedToFindSharedPointId(FeatureId),
    // Line update related errors
    LineIdUnavailable,
    InsufficientSharedPointsForLine,
    ProjectionUnavailable,
    UnprojectionFailed,
    LineFeatureNotFoundInLayer(FeatureId),
}

fn handle_drag(
    _mouse_button: &galileo::control::MouseButton,
    _delta: &galileo_types::cartesian::Vector2<f64>,
    event: &galileo::control::MouseEvent,
    feature_id_arc: &Arc<RwLock<Option<FeatureId>>>,
    map: &mut Map,
    shared_points: &Arc<RwLock<Vec<Point2>>>,
    id_to_index_map: &Arc<RwLock<HashMap<FeatureId, usize>>>,
    line_id_arc: &Arc<RwLock<Option<FeatureId>>>,
    haversine_distance_arc: &Arc<RwLock<Option<f64>>>,
) -> Result<EventPropagation, DragError> {
    let opt_feature_id_to_drag = *feature_id_arc.read().unwrap();
    if let Some(feature_id_to_drag) = opt_feature_id_to_drag {
        let new_feature_position = map
            .view()
            .screen_to_map(event.screen_pointer_position)
            .ok_or(DragError::ScreenToMapConversionFailed)?;

        let mut needs_redraw = false;
        let mut point_updated_in_layer = false;

        for layer_trait_object in map.layers_mut().iter_mut() {
            if let Some(feature_layer) = layer_trait_object
                .as_any_mut()
                .downcast_mut::<FeatureLayer<Point2, Point2, CirclePointSymbol, CartesianSpace2d>>()
            {
                if feature_layer
                    .features_mut()
                    .get_mut(feature_id_to_drag)
                    .is_some()
                {
                    let point_to_update = feature_layer
                        .features_mut()
                        .get_mut(feature_id_to_drag)
                        .unwrap();
                    *point_to_update = new_feature_position;
                    feature_layer.update_feature(feature_id_to_drag);
                    point_updated_in_layer = true;

                    let id_map_reader = id_to_index_map.read().unwrap();
                    if let Some(index) = id_map_reader.get(&feature_id_to_drag) {
                        let mut shared_points_writer = shared_points.write().unwrap();
                        if *index < shared_points_writer.len() {
                            shared_points_writer[*index] = new_feature_position;
                            println!(
                                "Updated shared_points[{}] (mapped from FeatureId {:?}) to: {:?}",
                                index, feature_id_to_drag, new_feature_position
                            );
                        } else {
                            return Err(DragError::FailedToUpdateSharedPointIndex(
                                feature_id_to_drag,
                                *index,
                            ));
                        }
                    } else {
                        return Err(DragError::FailedToFindSharedPointId(feature_id_to_drag));
                    }

                    needs_redraw = true;
                    break;
                }
            }
        }

        if !point_updated_in_layer {
            return Err(DragError::PointFeatureNotFoundInLayer(feature_id_to_drag));
        }

        if needs_redraw {
            let opt_line_id_to_update = *line_id_arc.read().unwrap();
            let line_id_to_update = opt_line_id_to_update.ok_or(DragError::LineIdUnavailable)?;

            let current_cartesian_points = shared_points.read().unwrap();
            if current_cartesian_points.len() < 2 {
                return Err(DragError::InsufficientSharedPointsForLine);
            }
            let p1_cartesian = current_cartesian_points[0];
            let p2_cartesian = current_cartesian_points[1];

            let p1_geo_proj = unproject_cartesian_point_to_geo(&p1_cartesian)?;
            let p2_geo_proj = unproject_cartesian_point_to_geo(&p2_cartesian)?;

            let p1_geo_coord = geo::coord!(x: p1_geo_proj.lon(), y: p1_geo_proj.lat());
            let p2_geo_coord = geo::coord!(x: p2_geo_proj.lon(), y: p2_geo_proj.lat());

            let new_line_contour_data = Contour::new(vec![p1_geo_coord, p2_geo_coord], false);

            let mut line_layer_updated_successfully = false;
            for layer_trait_object_mut in map.layers_mut().iter_mut() {
                if let Some(line_feature_layer) = layer_trait_object_mut
                    .as_any_mut()
                    .downcast_mut::<FeatureLayer<
                        geo::Coord<f64>,
                        Contour<geo::Coord<f64>>,
                        SimpleContourSymbol,
                        GeoSpace2d,
                    >>()
                {
                    if let Some(line_to_update) =
                        line_feature_layer.features_mut().get_mut(line_id_to_update)
                    {
                        *line_to_update = new_line_contour_data.clone();
                        line_feature_layer.update_feature(line_id_to_update);
                        println!(
                            "Updated line feature {:?} in vector_layer2",
                            line_id_to_update
                        );
                        line_layer_updated_successfully = true;
                        break;
                    }
                }
            }

            if !line_layer_updated_successfully {
                return Err(DragError::LineFeatureNotFoundInLayer(line_id_to_update));
            }

            if let Some(contour_geom) = get_first_line_contour_geometry(map) {
                if let Some(distance) = calculate_contour_haversine_distance(contour_geom) {
                    *haversine_distance_arc.write().unwrap() = Some(distance);
                    println!(
                        "Updated Haversine distance in shared state: {:.2} meters",
                        distance
                    );
                } else {
                    *haversine_distance_arc.write().unwrap() = None;
                    println!("Could not calculate Haversine distance, clearing shared state.");
                }
            } else {
                *haversine_distance_arc.write().unwrap() = None; // Clear if no contour
            }

            map.redraw();
            Ok(EventPropagation::Consume)
        } else {
            Ok(EventPropagation::Stop)
        }
    } else {
        Ok(EventPropagation::Propagate)
    }
}

fn calculate_contour_haversine_distance(
    contour_geometry: &galileo_types::impls::Contour<geo::Coord<f64>>,
) -> Option<f64> {
    let points_vec: Vec<geo::Coord<f64>> = contour_geometry.iter_points().cloned().collect();

    if points_vec.len() >= 2 {
        let p1 = points_vec[0];
        let p2 = points_vec[1];
        let distance = geo::Haversine.distance(geo::Point(p1), geo::Point(p2));
        Some(distance)
    } else {
        println!("Line contour does not have enough points to calculate distance.");
        None
    }
}

fn unproject_cartesian_point_to_geo(cartesian_point: &Point2) -> Result<GeoPoint2d, DragError> {
    let projector = Crs::EPSG3857
        .get_projection::<GeoPoint2d, Point2>()
        .ok_or(DragError::ProjectionUnavailable)?;
    projector
        .unproject(cartesian_point)
        .ok_or(DragError::UnprojectionFailed)
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

fn get_default_circle_point_style() -> CirclePointSymbol {
    CirclePointSymbol {
        color: Color::GREEN,
        size: 10.0,
    }
}

fn get_default_line_contour_style() -> SimpleContourSymbol {
    SimpleContourSymbol {
        color: Color::BLUE,
        width: 3.0,
    }
}

fn create_map(
    initial_points: Vec<Point2>,
    geometries: &MapGeometryConfig,
    map_view: &MapViewConfig,
    line_feature_id_arc: Arc<RwLock<Option<FeatureId>>>,
) -> Map {
    let layer = RasterTileLayerBuilder::new_osm()
        .with_file_cache_checked(".tile_cache")
        .build()
        .expect("failed to create layer");

    let vector_layer: FeatureLayer<Point2, Point2, _, CartesianSpace2d> = FeatureLayer::new(
        initial_points,
        get_default_circle_point_style(),
        Crs::EPSG3857,
    );

    let line_data = vec![Contour::new(
        vec![
            geo::coord!(x: geometries.line.start.lon, y: geometries.line.start.lat),
            geo::coord!(x: geometries.line.end.lon, y: geometries.line.end.lat),
        ],
        false,
    )];

    let vector_layer2: FeatureLayer<geo::Coord<f64>, Contour<geo::Coord<f64>>, _, GeoSpace2d> =
        FeatureLayer::new(line_data, get_default_line_contour_style(), Crs::WGS84);

    {
        let mut line_id_writer = line_feature_id_arc.write().unwrap();
        if let Some((id, _)) = vector_layer2.features().iter().next() {
            *line_id_writer = Some(id);
            println!("Stored line FeatureId for vector_layer2: {:?}", id);
        } else {
            eprintln!("ERROR: vector_layer2 has no features to get ID from.");
        }
    }

    MapBuilder::default()
        .with_latlon(map_view.center_lat, map_view.center_lon)
        .with_z_level(map_view.zoom)
        .with_layer(layer)
        .with_layer(vector_layer2)
        .with_layer(vector_layer)
        .build()
}

fn get_first_line_contour_geometry(
    map: &Map,
) -> Option<&galileo_types::impls::Contour<geo::Coord<f64>>> {
    for layer_ref in map.layers().iter() {
        if let Some(line_layer) = layer_ref.as_any().downcast_ref::<FeatureLayer<
            geo::Coord<f64>,
            Contour<geo::Coord<f64>>,
            SimpleContourSymbol,
            GeoSpace2d,
        >>() {
            if let Some((_id, contour_feature)) = line_layer.features().iter().next() {
                return Some(contour_feature.geometry());
            }
            // If layer is found but has no features, we can stop.
            return None;
        }
    }
    None
}
