#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

extern crate rusqlite;
use rusqlite::{Connection, Result};
//mod clock;

#[tauri::command]
fn create_file(data: String) {
  use std::fs::File;
  use std::io::prelude::*;

  let mut file = File::options().append(true).write(true).create(true).open("C:/Users/ramga/Desktop/test.txt").unwrap();
  
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
    
    let mut stmt = match conn.prepare("SELECT * FROM flightData") {
        Ok(stmt) => stmt,
        Err(err) => return Err(format!("Error preparing statement: {}", err.to_string())),
    };
    
    //let rows = match stmt.query_map([], |row| {
    //    let year: i32 = match row.get(column_name) {
    //        Ok(year) => year,
    //        Err(err) => return Err(err),
    //    };
    ////////////////////
    ////for year_result in rows{
    ////    year_vector.push(year_result);
    ////}
    /////////////////////
    //    year_vector.push(year);
    //    println!("This is the current year -> {:?}", year);
    //    Ok(year)
    //}) 

    //{
    //    Ok(rows) => rows,
    //    Err(err) => return Err(format!("Error querying rows: {}", err.to_string())),
    //};

    //for _ in rows {
    //    println!("-");
    //}

    //Ok(year_vector)


//##################################################################
    let rows = match stmt.query_map([], |row| {
        let value: i32 = match row.get(column_name) {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        integer_vector.push(value);
        println!("This is the current year -> {:?}", value);
        Ok(value)
    }) {
        Ok(rows) => rows,
        Err(err) => return Err(format!("Error querying rows: {}", err.to_string())),
    };

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
    
    let mut stmt = match conn.prepare("SELECT * FROM flightData") {
        Ok(stmt) => stmt,
        Err(err) => return Err(format!("Error preparing statement: {}", err.to_string())),
    };
    
    let rows = match stmt.query_map([], |row| {
        let value: String = match row.get(column_name) {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        string_vector.push(value.clone());
        println!("This is the current year -> {:?}", value);
        Ok(value)
    }) {
        Ok(rows) => rows,
        Err(err) => return Err(format!("Error querying rows: {}", err.to_string())),
    };

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
    
    let mut stmt = match conn.prepare("SELECT * FROM flightData") {
        Ok(stmt) => stmt,
        Err(err) => return Err(format!("Error preparing statement: {}", err.to_string())),
    };
    
    let rows = match stmt.query_map([], |row| {
        let value: f32 = match row.get(column_name) {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        float_vector.push(value);
        println!("This is the current value -> {:?}", value);
        Ok(value)
    }) {
        Ok(rows) => rows,
        Err(err) => return Err(format!("Error querying rows: {}", err.to_string())),
    };

    for _ in rows {
        println!("-");
    }

    Ok(float_vector)
}


fn main() {
    let context = tauri::generate_context!();
//    let clock = clock::Clock::new(); // Create an instance of Clock

    tauri::Builder::default()
        .menu(if cfg!(target_os = "macos") {
            tauri::Menu::os_default(&context.package_info().name)
        } else {
            tauri::Menu::default()
        })
        .invoke_handler(tauri::generate_handler![create_file,load_database_integer_database, load_database_string_database, load_database_float_database,])
        .plugin(tauri_plugin_serialport::init())
        .run(context)
        .expect("failed to run app");
        
    //// Get a reference to the Tauri runtime
    //let runtime = tauri::async_runtime::Runtime::new().unwrap();

    //// Run the Tauri runtime
    //runtime.block_on(async {
    //    // Send a message to update time every second
    //    loop{
    //        clock.update_time(&runtime);
    //        // Sleep for 1 second
    //        std::thread::sleep(std::time::Duration::from_secs(1));
    //    }
    //});
}
