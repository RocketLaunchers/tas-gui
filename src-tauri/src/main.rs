#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn create_file(data: String) {
  use std::fs::File;
  use std::io::prelude::*;

  let mut file = File::options().append(true).write(true).create(true).open("C:/Users/ramga/Desktop/test.txt").unwrap();
  file.write_all(data.as_bytes()).unwrap();
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .menu(if cfg!(target_os = "macos") {
            tauri::Menu::os_default(&context.package_info().name)
        } else {
            tauri::Menu::default()
        })
        .invoke_handler(tauri::generate_handler![create_file])

        .plugin(tauri_plugin_serialport::init())
        .run(context)
        .expect("failed to run app");
}
