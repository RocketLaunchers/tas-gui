use chrono::Local;
use tauri::Manager;

// Struct to manage state
pub struct Clock {
    time: String,
}

impl Clock {
    // Method to create a new instance of Clock
    pub fn new() -> Self {
        Self {
            time: String::new(),
        }
    }

    // Method to update time in state
    //pub fn update_time(&mut self, runtime: &tauri::Runtime) {
    pub fn update_time(&mut self, runtime: &tauri::Runtime) {
        // Get the current local time
        let current_time = Local::now().format("%H:%M:%S").to_string();
        // Update state with current time
        self.time = current_time;
        // Send message to JavaScript to update time
        runtime
            .execute_script(&format!("window.tauri.updateTime('{}')", self.time))
            .expect("Failed to execute script");
    }
}
