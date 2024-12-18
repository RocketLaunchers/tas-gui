#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod file_operations;
mod database_operations;

use file_operations::create_file;
use database_operations::{load_database_integer_database, load_database_string_database, load_database_float_database, start_replay, create_new_database, list_databases};




fn main() {
    let context = tauri::generate_context!();

    tauri::Builder::default()
        .menu(if cfg!(target_os = "macos") {
            tauri::Menu::os_default(&context.package_info().name)
        } else {
            tauri::Menu::default()
        })
        .invoke_handler(tauri::generate_handler![
            create_file, 
            load_database_integer_database, 
            load_database_string_database, 
            load_database_float_database,
            start_replay,
            create_new_database,
            list_databases,
        ])
        .plugin(tauri_plugin_serialport::init())
        .run(context)
        .expect("failed to run app");
}