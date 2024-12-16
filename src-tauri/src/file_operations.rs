extern crate rusqlite;
use std::fs::File;
use std::io::prelude::*;

#[tauri::command]
pub fn create_file(data: String, file: String) {
    let pathname = format!("C:{}", file);
    let mut file = File::options().append(true).write(true).create(true).open(pathname).unwrap();
    
    file.write_all(data.as_bytes()).unwrap();
}
