use galileo_egui::{EguiMap, EguiMapState};
use galileo_types::geo::GeoPoint;
use galileo_types::geo::impls::GeoPoint2d;

// Assuming EguiMapApp might need access to these if they are part of its state or methods
// For now, only direct dependencies for the struct and its impls are included.

// Import Algorithm and AlgorithmOutput
use crate::algorithms::{Algorithm, HaversineDistance};
use galileo_types::impls::Contour; // For Contour type
use geo::Coord; // For Coord type
use std::fmt::Display; // Needed for Box<dyn Display ...>

// Type alias for the stored, type-erased output of algorithms.
pub type StoredAlgorithmOutput = Box<dyn Display + Send + Sync>;

pub struct EguiMapApp {
    pub map: EguiMapState,
    pub position: GeoPoint2d,
    pub resolution: f64,
    algorithms: Vec<Box<dyn Algorithm>>,
    algorithm_outputs: Vec<Option<StoredAlgorithmOutput>>,
}

impl EguiMapApp {
    pub fn new(map_state: EguiMapState) -> Self {
        let position = map_state
            .map()
            .view()
            .position()
            .expect("invalid map position");
        let resolution = map_state.map().view().resolution();

        // Initialize algorithms
        let algorithms: Vec<Box<dyn Algorithm>> = vec![Box::new(HaversineDistance)];
        let mut algorithm_outputs: Vec<Option<StoredAlgorithmOutput>> =
            Vec::with_capacity(algorithms.len());
        for _ in 0..algorithms.len() {
            algorithm_outputs.push(None);
        }

        Self {
            map: map_state,
            position,
            resolution,
            algorithms,
            algorithm_outputs,
        }
    }

    // Helper to get line geometry. Assumes a single line feature in a specific layer type.
    fn get_line_geometry(&self) -> Option<Contour<Coord<f64>>> {
        let map_ref = self.map.map();
        for layer_trait_object in map_ref.layers().iter() {
            if let Some(feature_layer) = layer_trait_object
                .as_any()
                .downcast_ref::<galileo::layer::FeatureLayer<
                    geo::Coord<f64>,
                    Contour<Coord<f64>>,
                    galileo::symbol::SimpleContourSymbol,
                    galileo_types::geometry_type::GeoSpace2d,
                >>()
            {
                if let Some((_id, feature)) = feature_layer.features().iter().next() {
                    return Some(feature.clone());
                }
            }
        }
        None
    }
}

impl eframe::App for EguiMapApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        let line_contour = self.get_line_geometry();

        if let Some(ref geom_contour) = line_contour {
            for (i, algorithm) in self.algorithms.iter().enumerate() {
                self.algorithm_outputs[i] = algorithm.calculate_and_box_output(geom_contour);
            }
        } else {
            for output in self.algorithm_outputs.iter_mut() {
                *output = None;
            }
        }

        egui::CentralPanel::default().show(ctx, |ui| {
            EguiMap::new(&mut self.map)
                .with_position(&mut self.position)
                .with_resolution(&mut self.resolution)
                .show_ui(ui);

            egui::Window::new("Galileo map").show(ctx, |ui| {
                // Display algorithm outputs
                ui.label("Algorithm Outputs:");
                for (i, algorithm) in self.algorithms.iter().enumerate() {
                    let output_opt_ref = &self.algorithm_outputs[i];
                    algorithm.display_ui(ui, output_opt_ref);
                }
            });
        });
    }
}
