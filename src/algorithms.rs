use egui::Ui;
use galileo_types::contour::Contour as ContourTrait;
use galileo_types::impls::Contour;
use geo::{Coord, Distance, Haversine as GeoHaversine, Point as GeoPoint};
use std::fmt::Display;

// This is the object-safe trait definition
pub trait Algorithm: Send + Sync + 'static {
    fn name(&self) -> String;
    // Renaming to avoid confusion with previous attempts, this is the main processing method.
    fn calculate_and_box_output(
        &self,
        contour: &Contour<Coord<f64>>,
    ) -> Option<Box<dyn Display + Send + Sync>>;
    fn display_ui(&self, ui: &mut Ui, output: &Option<Box<dyn Display + Send + Sync>>);
}

pub struct HaversineDistance;

// Internal types specific to HaversineDistance, NOT associated types of the Algorithm trait.
impl HaversineDistance {
    // Helper using concrete types specific to HaversineDistance
    fn create_specific_input_for_haversine(
        &self,
        line_geometry: &Contour<Coord<f64>>,
    ) -> Result<(Coord<f64>, Coord<f64>), String> {
        let points_vec: Vec<Coord<f64>> = line_geometry.iter_points().cloned().collect();
        if points_vec.len() >= 2 {
            Ok((points_vec[0], points_vec[1]))
        } else {
            Err("Haversine Distance: Requires at least two points.".to_string())
        }
    }

    // Helper using concrete types specific to HaversineDistance
    fn run_specific_calculation_for_haversine(
        &self,
        input: &(Coord<f64>, Coord<f64>),
    ) -> Option<String> {
        let (p1, p2) = *input; // Dereference the tuple from the reference
        let distance = GeoHaversine.distance(GeoPoint(p1), GeoPoint(p2));
        Some(format!("{:.2} meters", distance))
    }
}

impl Algorithm for HaversineDistance {
    fn name(&self) -> String {
        "Haversine Distance".to_string()
    }

    fn calculate_and_box_output(
        &self,
        contour: &Contour<Coord<f64>>,
    ) -> Option<Box<dyn Display + Send + Sync>> {
        match self.create_specific_input_for_haversine(contour) {
            Ok(specific_input) => {
                let concrete_output: Option<String> =
                    self.run_specific_calculation_for_haversine(&specific_input);
                concrete_output.map(|val_str| Box::new(val_str) as Box<dyn Display + Send + Sync>)
            }
            Err(err_msg_string) => Some(Box::new(err_msg_string) as Box<dyn Display + Send + Sync>),
        }
    }

    fn display_ui(&self, ui: &mut Ui, output: &Option<Box<dyn Display + Send + Sync>>) {
        let content = output
            .as_ref()
            .map_or_else(|| "N/A".to_string(), |val| val.to_string());
        ui.label(format!("{}: {}", self.name(), content));
    }
}
