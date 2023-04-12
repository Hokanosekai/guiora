use gtk::prelude::*;
use gtk::{Application, ApplicationWindow};
use std::ptr;

#[no_mangle]
pub extern "C" fn create_window() {

  if gtk::init().is_err() {
    println!("Failed to initialize GTK.");
  }

  let app = Application::builder()
    .application_id("com.example.myapp")
    .build();

  app.connect_activate(|app| {
    let window = ApplicationWindow::builder()
        .application(app)
        .title("My App")
        .default_width(640)
        .default_height(480)
        .build();

    window.show();
  });

  app.run();
}

fn main() {
    create_window();
}