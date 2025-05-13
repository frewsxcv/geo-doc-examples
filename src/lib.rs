//! Example showing how to integrate Galileo map into your egui application.

use galileo::layer::raster_tile_layer::RasterTileLayerBuilder;
use galileo::{Map, MapBuilder};
use galileo_egui::{EguiMap, EguiMapState};
use galileo_types::geo::GeoPoint;
use galileo_types::geo::impls::GeoPoint2d;
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
    let mut builder = galileo_egui::InitBuilder::new(create_map())
        .with_app_builder(|egui_map_state| Box::new(EguiMapApp::new(egui_map_state)));

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

fn create_map() -> Map {
    let layer = RasterTileLayerBuilder::new_osm()
        .with_file_cache_checked(".tile_cache")
        .build()
        .expect("failed to create layer");

    MapBuilder::default()
        .with_latlon(37.566, 128.9784)
        .with_z_level(8)
        .with_layer(layer)
        .build()
}
