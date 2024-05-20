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
fn load_database(column: String) -> Result<Vec<i32>, String> {
    let mut year_vector = Vec::new();
    let column_name: &str = &column;
    let conn = match Connection::open("flight-data.db") {
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
        let year: i32 = match row.get(column_name) {
            Ok(year) => year,
            Err(err) => return Err(err),
        };
        year_vector.push(year);
        println!("This is the current year -> {:?}", year);
        Ok(year)
    }) 

    {
        Ok(rows) => rows,
        Err(err) => return Err(format!("Error querying rows: {}", err.to_string())),
    };

    for _ in rows {
        println!("-");
    }

    Ok(year_vector)
//#####################################################################
}
#[tauri::command]
fn example() -> String {
    "Hello from rust".into()
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
        .invoke_handler(tauri::generate_handler![create_file, example, load_database])

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
