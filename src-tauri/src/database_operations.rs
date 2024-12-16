extern crate rusqlite;
use rusqlite::{Connection, Result};

#[tauri::command]
pub fn load_database_integer_database(column: String, database_name: String) -> Result<Vec<i32>, String> {
    let mut integer_vector = Vec::new();
    let column_name: &str = &column;
    let conn = match Connection::open(format!("{}.db", database_name)) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };
    
    let mut stmt = match conn.prepare(&format!("SELECT DISTINCT {} FROM flightData", column_name)) {
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

    for _ in rows {
        println!("-");
    }

    Ok(integer_vector)
}

#[tauri::command]
pub fn load_database_string_database(column: String, database_name: String) -> Result<Vec<String>, String> {
    let mut string_vector = Vec::new();
    let column_name: &str = &column;
    let conn = match Connection::open(format!("{}.db", database_name)) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };
    
    let mut stmt = match conn.prepare(&format!("SELECT DISTINCT {} FROM flightData", column_name)) {
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

    for _ in rows {
        println!("-");
    }

    Ok(string_vector)
}

#[tauri::command]
pub fn load_database_float_database(column: String, database_name: String) -> Result<Vec<f32>, String> {
    let mut float_vector = Vec::new();
    let column_name: &str = &column;
    let conn = match Connection::open(format!("{}.db", database_name)) {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Error opening connection: {}", err.to_string())),
    };
    
    let mut stmt = match conn.prepare(&format!("SELECT DISTINCT {} FROM flightData", column_name)) {
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

    for _ in rows {
        println!("-");
    }

    Ok(float_vector)
}
