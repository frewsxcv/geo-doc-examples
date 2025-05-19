use egui::Ui;
use galileo_types::contour::Contour as ContourTrait; // For iter_points
use galileo_types::impls::Contour;
use geo::{Coord, Distance, Haversine as GeoHaversine, Point as GeoPoint};
use std::fmt::Display; // Renamed Haversine to GeoHaversine

// Type alias for algorithm output. Box<dyn Display> allows flexibility.
pub type AlgorithmOutput = Box<dyn Display + Send + Sync>;

pub trait Algorithm: Send + Sync + 'static {
    fn name(&self) -> String;
    fn run(&self, line_geometry: &Contour<Coord<f64>>) -> Option<AlgorithmOutput>;
    fn display_ui(&self, ui: &mut Ui, output: &Option<AlgorithmOutput>);
}

pub struct HaversineDistance;

impl Algorithm for HaversineDistance {
    fn name(&self) -> String {
        "Haversine Distance".to_string()
    }

    fn run(&self, line_geometry: &Contour<Coord<f64>>) -> Option<AlgorithmOutput> {
        let points_vec: Vec<Coord<f64>> = line_geometry.iter_points().cloned().collect();

        if points_vec.len() >= 2 {
            let p1 = points_vec[0];
            let p2 = points_vec[1];
            // Use geo::Point for distance calculation
            let distance = GeoHaversine.distance(GeoPoint(p1), GeoPoint(p2));
            Some(Box::new(format!("{:.2} meters", distance)))
        } else {
            println!("Line contour does not have enough points to calculate Haversine distance.");
            None
        }
    }

    fn display_ui(&self, ui: &mut Ui, output: &Option<AlgorithmOutput>) {
        let content = output.as_ref().map_or_else(
            || "N/A".to_string(),
            |val| val.to_string(), // val is Box<dyn Display>, so .to_string() works
        );
        ui.label(format!("{}: {}", self.name(), content));
    }
}
