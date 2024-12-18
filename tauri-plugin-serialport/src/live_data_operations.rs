extern crate rusqlite;
use rusqlite::{Connection, Result};
use tauri::{Runtime, Window};
//use crate::state::ReadData;
//use tauri::Window;

#[tauri::command]
pub fn write_live_data_to_database(database_name: String, data: String) -> Result<(), String> {
    let db_path = if database_name.ends_with(".db") {
        database_name
    } else {
        format!("{}.db", database_name)
    };

    println!("Opening database at path: {}", db_path);

    let conn = match Connection::open(&db_path) {
        Ok(conn) => conn,
        Err(err) => {
            println!("Error opening connection: {}", err.to_string());
            return Err(format!("Error opening connection: {}", err.to_string()));
        }
    };

    println!("Inserting data into database: {}", data);

    match conn.execute(
        "INSERT INTO flightData (data) VALUES (?1)",
        &[&data],
    ) {
        Ok(_) => {
            println!("Data inserted successfully");
            Ok(())
        },
        Err(err) => {
            println!("Error inserting data: {}", err.to_string());
            Err(format!("Error inserting data: {}", err.to_string()))
        }
    }
}

//async function to process live data
pub async fn process_live_data<R: Runtime>(window: Window<R>, path: String, data: Vec<u8>, database_name: Option<String>) {
    let read_event = format!("plugin-serialport-read-{}", &path);
    let data_str = String::from_utf8_lossy(&data).to_string();

    // Send data to frontend in a suitable format
    let formatted_data = data_str.split("$")
        .filter(|s| !s.is_empty())
        .map(|s| s.split("\r\n").filter(|s| !s.is_empty()).collect::<Vec<&str>>())
        .collect::<Vec<Vec<&str>>>();

    if window.emit(&read_event, formatted_data).is_err() {
        eprintln!("Failed to emit data to frontend");
    }

    // Send data to backend
    if let Err(e) = window.emit("plugin-serialport-read-your_path", data_str.clone()) {
        eprintln!("Failed to send data to backend: {}", e);
    }

    // If recording is enabled, write data to the database
    if let Some(db_name) = database_name {
        if let Err(e) = write_live_data_to_database(db_name, data_str) {
            eprintln!("Failed to write live data to database: {}", e);
        }
    }
}
