use galileo::layer::feature_layer::Feature;
use galileo_egui::{EguiMap, EguiMapState};
use galileo_types::geo::GeoPoint;
use galileo_types::geo::impls::GeoPoint2d;
use std::sync::{Arc, RwLock}; // May not be needed here directly

// Assuming EguiMapApp might need access to these if they are part of its state or methods
// For now, only direct dependencies for the struct and its impls are included.

pub struct EguiMapApp {
    pub map: EguiMapState,
    pub position: GeoPoint2d,
    pub resolution: f64,
    pub shared_haversine_distance: Arc<RwLock<Option<f64>>>,
}

impl EguiMapApp {
    pub fn new(
        map_state: EguiMapState,
        shared_haversine_distance: Arc<RwLock<Option<f64>>>,
    ) -> Self {
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
            shared_haversine_distance,
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
                    self.position.lat(), // GeoPoint trait needed for lat/lon
                    self.position.lon()
                ));

                ui.separator();
                ui.label("Map resolution:");
                ui.label(format!("{:6}", self.resolution));

                if let Some(distance) = *self.shared_haversine_distance.read().unwrap() {
                    ui.separator();
                    ui.label("Line Haversine Distance:");
                    ui.label(format!("{:.2} meters", distance));
                }
            });
        });
    }
}
