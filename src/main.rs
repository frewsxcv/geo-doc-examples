#[cfg(not(target_arch = "wasm32"))]
fn main() {
    geo_doc_examples::run(geo_doc_examples::AppConfig::default());
}
