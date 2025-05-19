use galileo_egui::{EguiMap, EguiMapState};
use galileo_types::geo::GeoPoint;
use galileo_types::geo::impls::GeoPoint2d;

// Assuming EguiMapApp might need access to these if they are part of its state or methods
// For now, only direct dependencies for the struct and its impls are included.

// Import Algorithm and AlgorithmOutput
use crate::algorithms::{Algorithm, AlgorithmOutput, HaversineDistance};
use galileo_types::impls::Contour; // For Contour type
use geo::Coord; // For Coord type

pub struct EguiMapApp {
    pub map: EguiMapState,
    pub position: GeoPoint2d,
    pub resolution: f64,
    algorithms: Vec<Box<dyn Algorithm>>,
    algorithm_outputs: Vec<Option<AlgorithmOutput>>,
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
        let mut algorithm_outputs = Vec::with_capacity(algorithms.len());
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

    // Helper function to get the line geometry (simplified, assumes one line layer)
    // This might need to be more robust depending on how line geometry is managed.
    // Based on get_first_line_contour_geometry from lib.rs
    fn get_line_geometry(&self) -> Option<Contour<Coord<f64>>> {
        let map_ref = self.map.map();
        for layer_trait_object in map_ref.layers().iter() {
            if let Some(feature_layer) = layer_trait_object
                .as_any()
                .downcast_ref::<galileo::layer::FeatureLayer<
                    geo::Coord<f64>,     // Corrected: Geometry type from lib.rs
                    Contour<Coord<f64>>, // Corrected: Feature/Properties type from lib.rs
                    galileo::symbol::SimpleContourSymbol,
                    galileo_types::geometry_type::GeoSpace2d,
                >>()
            {
                if let Some((_id, feature)) = feature_layer.features().iter().next() {
                    // feature is the Contour<Coord<f64>> itself
                    return Some(feature.clone());
                }
            }
        }
        None
    }
}

impl eframe::App for EguiMapApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        // Attempt to get the current line geometry
        let line_geometry = self.get_line_geometry();

        // Run algorithms if geometry is available
        if let Some(ref geom) = line_geometry {
            for (i, algorithm) in self.algorithms.iter().enumerate() {
                self.algorithm_outputs[i] = algorithm.run(geom);
            }
        } else {
            // If no geometry, clear previous outputs or set to None
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
                ui.label("Map center position:");
                ui.label(format!(
                    "Lat: {:.4} Lon: {:.4}",
                    self.position.lat(), // GeoPoint trait needed for lat/lon
                    self.position.lon()
                ));

                ui.separator();
                ui.label("Map resolution:");
                ui.label(format!("{:6}", self.resolution));

                // Display algorithm outputs
                ui.separator();
                ui.label("Algorithm Outputs:");
                for (i, algorithm) in self.algorithms.iter().enumerate() {
                    // Get a reference to the Option<AlgorithmOutput> directly
                    let output_opt_ref = &self.algorithm_outputs[i];
                    algorithm.display_ui(ui, output_opt_ref);
                }
            });
        });
    }
}
