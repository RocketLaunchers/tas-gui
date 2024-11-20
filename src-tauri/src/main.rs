#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

extern crate rusqlite;
use rusqlite::{Connection, Result};
//mod clock;

#[tauri::command]
fn create_file(data: String, file: String) {
    use std::fs::File;
    use std::io::prelude::*;

    let pathname = format!("C:{}", file);
    let mut file = File::options().append(true).write(true).create(true).open(pathname).unwrap();
    
    file.write_all(data.as_bytes()).unwrap();
}

#[tauri::command]
fn load_database_integer_database(column: String, database_name: String) -> Result<Vec<i32>, String> {
    let mut integer_vector = Vec::new();
    let column_name: &str = &column;
    let conn = match Connection::open(format!("{}.db", database_name)) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };
    
    // Querying the flightData table for the specified column
    let mut stmt = match conn.prepare(&format!("SELECT {} FROM flightData", column_name)) {
        Ok(stmt) => stmt,
        Err(err) => return Err(format!("Error preparing statement: {}", err.to_string())),
    };
    
    let rows = match stmt.query_map([], |row| {
        let value: i32 = match row.get(column_name) {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        integer_vector.push(value);
        println!("This is the current value from column '{}' -> {:?}", column_name, value);
        Ok(value)
    }) {
        Ok(rows) => rows,
        Err(err) => return Err(format!("Error querying rows: {}", err.to_string())),
    };

    // Debugging print for each row
    for _ in rows {
        println!("-");
    }

    Ok(integer_vector)
}

#[tauri::command]
fn load_database_string_database(column: String, database_name: String) -> Result<Vec<String>, String> {
    let mut string_vector = Vec::new();
    let column_name: &str = &column;
    let conn = match Connection::open(format!("{}.db", database_name)) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };
    
    let mut stmt = match conn.prepare(&format!("SELECT {} FROM flightData", column_name)) {
        Ok(stmt) => stmt,
        Err(err) => return Err(format!("Error preparing statement: {}", err.to_string())),
    };
    
    let rows = match stmt.query_map([], |row| {
        let value: String = match row.get(column_name) {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        string_vector.push(value.clone());
        println!("This is the current value from column '{}' -> {:?}", column_name, value);
        Ok(value)
    }) {
        Ok(rows) => rows,
        Err(err) => return Err(format!("Error querying rows: {}", err.to_string())),
    };

    // Debugging print for each row
    for _ in rows {
        println!("-");
    }

    Ok(string_vector)
}

#[tauri::command]
fn load_database_float_database(column: String, database_name: String) -> Result<Vec<f32>, String> {
    let mut float_vector = Vec::new();
    let column_name: &str = &column;
    let conn = match Connection::open(format!("{}.db", database_name)) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };
    
    let mut stmt = match conn.prepare(&format!("SELECT {} FROM flightData", column_name)) {
        Ok(stmt) => stmt,
        Err(err) => return Err(format!("Error preparing statement: {}", err.to_string())),
    };
    
    let rows = match stmt.query_map([], |row| {
        let value: f32 = match row.get(column_name) {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        float_vector.push(value);
        println!("This is the current value from column '{}' -> {:?}", column_name, value);
        Ok(value)
    }) {
        Ok(rows) => rows,
        Err(err) => return Err(format!("Error querying rows: {}", err.to_string())),
    };

    // Debugging print for each row
    for _ in rows {
        println!("-");
    }

    Ok(float_vector)
}

fn main() {
    let context = tauri::generate_context!();

    tauri::Builder::default()
        .menu(if cfg!(target_os = "macos") {
            tauri::Menu::os_default(&context.package_info().name)
        } else {
            tauri::Menu::default()
        })
        .invoke_handler(tauri::generate_handler![create_file, load_database_integer_database, load_database_string_database, load_database_float_database])
        .plugin(tauri_plugin_serialport::init())
        .run(context)
        .expect("failed to run app");
}
