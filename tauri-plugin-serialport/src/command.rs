use crate::error::Error;
use crate::state::{ReadData, SerialportInfo, SerialportState};
// use std::collections::HashMap;
use serialport::{DataBits, FlowControl, Parity, StopBits};
use std::sync::mpsc;
use std::sync::mpsc::{Receiver, Sender, TryRecvError};
use std::thread;
use std::time::Duration;
use tauri::{command, AppHandle, Runtime, State, Window};

/// Get serial port from state using path and apply function `f`
fn get_serialport<T, F: FnOnce(&mut SerialportInfo) -> Result<T, Error>>(
    state: State<'_, SerialportState>,
    path: String,
    f: F,
) -> Result<T, Error> {
    match state.serialports.lock() {
        Ok(mut map) => match map.get_mut(&path) {
            Some(serialport_info) => f(serialport_info),
            None => Err(Error::String("Serial port not found".to_string())),
        },
        Err(error) => Err(Error::String(format!("Failed to acquire lock! {}", error))),
    }
}

/// Convert integer value to DataBits
fn get_data_bits(value: Option<usize>) -> DataBits {
    match value {
        Some(value) => match value {
            5 => DataBits::Five,
            6 => DataBits::Six,
            7 => DataBits::Seven,
            8 => DataBits::Eight,
            _ => DataBits::Eight,
        },
        None => DataBits::Eight,
    }
}

/// Convert string value to FlowControl
fn get_flow_control(value: Option<String>) -> FlowControl {
    match value {
        Some(value) => match value.as_str() {
            "Software" => FlowControl::Software,
            "Hardware" => FlowControl::Hardware,
            _ => FlowControl::None,
        },
        None => FlowControl::None,
    }
}

/// Convert string value to Parity
fn get_parity(value: Option<String>) -> Parity {
    match value {
        Some(value) => match value.as_str() {
            "Odd" => Parity::Odd,
            "Even" => Parity::Even,
            _ => Parity::None,
        },
        None => Parity::None,
    }
}

/// Convert integer value to StopBits
fn get_stop_bits(value: Option<usize>) -> StopBits {
    match value {
        Some(value) => match value {
            1 => StopBits::One,
            2 => StopBits::Two,
            _ => StopBits::Two,
        },
        None => StopBits::Two,
    }
}

/// Get a list of available serial ports
#[command]
pub fn available_ports() -> Vec<String> {
    let mut list = match serialport::available_ports() {
        Ok(list) => list,
        Err(_) => vec![],
    };
    list.sort_by(|a, b| a.port_name.cmp(&b.port_name));

    let mut name_list: Vec<String> = vec![];
    for i in &list {
        name_list.push(i.port_name.clone());
    }

    name_list
}

/// Cancel serial port data reading
#[command]
pub async fn cancel_read<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, SerialportState>,
    path: String,
) -> Result<(), Error> {
    get_serialport(state, path.clone(), |serialport_info| {
        if let Some(sender) = &serialport_info.sender {
            if sender.send(1).is_err() {
                return Err(Error::String("Failed to cancel serial port data reading".to_string()));
            }
        }
        serialport_info.sender = None;
        Ok(())
    })
}

/// Close a specific serial port
#[command]
pub fn close<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, SerialportState>,
    path: String,
) -> Result<(), Error> {
    match state.serialports.lock() {
        Ok(mut serialports) => {
            if serialports.remove(&path).is_some() {
                Ok(())
            } else {
                Err(Error::String(format!("Serial port {} not open!", path)))
            }
        }
        Err(error) => Err(Error::String(format!("Failed to acquire lock: {}", error))),
    }
}

/// Close all serial ports
#[command]
pub fn close_all<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, SerialportState>,
) -> Result<(), Error> {
    match state.serialports.lock() {
        Ok(mut map) => {
            for serialport_info in map.values() {
                if let Some(sender) = &serialport_info.sender {
                    if sender.send(1).is_err() {
                        return Err(Error::String("Failed to cancel serial port data reading".to_string()));
                    }
                }
            }
            map.clear();
            Ok(())
        }
        Err(error) => Err(Error::String(format!("Failed to acquire lock: {}", error))),
    }
}

/// Force close a serial port
#[command]
pub fn force_close<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, SerialportState>,
    path: String,
) -> Result<(), Error> {
    match state.serialports.lock() {
        Ok(mut map) => {
            if let Some(serial) = map.get_mut(&path) {
                if let Some(sender) = &serial.sender {
                    if sender.send(1).is_err() {
                        return Err(Error::String("Failed to cancel serial port data reading".to_string()));
                    }
                }
                map.remove(&path);
            }
            Ok(())
        }
        Err(error) => Err(Error::String(format!("Failed to acquire lock: {}", error))),
    }
}

/// Open a specific serial port
#[command]
pub fn open<R: Runtime>(
    _app: AppHandle<R>,
    state: State<'_, SerialportState>,
    _window: Window<R>,
    path: String,
    baud_rate: u32,
    data_bits: Option<usize>,
    flow_control: Option<String>,
    parity: Option<String>,
    stop_bits: Option<usize>,
    timeout: Option<u64>,
) -> Result<(), Error> {
    match state.serialports.lock() {
        Ok(mut serialports) => {
            if serialports.contains_key(&path) {
                return Err(Error::String(format!("Serial port {} is already open!", path)));
            }
            match serialport::new(path.clone(), baud_rate)
                .data_bits(get_data_bits(data_bits))
                .flow_control(get_flow_control(flow_control))
                .parity(get_parity(parity))
                .stop_bits(get_stop_bits(stop_bits))
                .timeout(Duration::from_millis(timeout.unwrap_or(200)))
                .open()
            {
                Ok(serial) => {
                    serialports.insert(path, SerialportInfo {
                        serialport: serial,
                        sender: None,
                    });
                    Ok(())
                }
                Err(error) => Err(Error::String(format!(
                    "Failed to create serial port {}: {}",
                    path, error
                ))),
            }
        }
        Err(error) => Err(Error::String(format!("Failed to acquire lock: {}", error))),
    }
}

/// Read data from a serial port
#[command]
pub fn read<R: Runtime>(
    _app: AppHandle<R>,
    window: Window<R>,
    state: State<'_, SerialportState>,
    path: String,
    timeout: Option<u64>,
    size: Option<usize>,
) -> Result<(), Error> {
    get_serialport(state.clone(), path.clone(), |serialport_info| {
        if serialport_info.sender.is_some() {
            return Ok(());
        }
        match serialport_info.serialport.try_clone() {
            Ok(mut serial) => {
                let read_event = format!("plugin-serialport-read-{}", &path);
                let (tx, rx): (Sender<usize>, Receiver<usize>) = mpsc::channel();
                serialport_info.sender = Some(tx);
                thread::spawn(move || loop {
                    match rx.try_recv() {
                        Ok(_) | Err(TryRecvError::Disconnected) => break,
                        Err(TryRecvError::Empty) => {}
                    }
                    serial.write_data_terminal_ready(true).unwrap();
                    let mut serial_buf = vec![0; size.unwrap_or(1024)];
                    if let Ok(size) = serial.read(serial_buf.as_mut_slice()) {
                        if window.emit(&read_event, ReadData { data: &serial_buf[..size], size }).is_err() {
                            // Log failed emit
                        }
                    }
                    thread::sleep(Duration::from_millis(timeout.unwrap_or(200)));
                });
                Ok(())
            }
            Err(error) => Err(Error::String(format!("Failed to read from serial port {}: {}", path, error))),
        }
    })
}

/// Write data to a serial port
#[command]
pub fn write<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, SerialportState>,
    path: String,
    value: String,
) -> Result<usize, Error> {
    get_serialport(state, path.clone(), |serialport_info| {
        serialport_info.serialport.write(value.as_bytes())
            .map_err(|error| Error::String(format!("Failed to write to serial port {}: {}", path, error)))
    })
}

/// Write binary data to a serial port
#[command]
pub fn write_binary<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, SerialportState>,
    path: String,
    value: Vec<u8>,
) -> Result<usize, Error> {
    get_serialport(state, path.clone(), |serialport_info| {
        serialport_info.serialport.write(value.as_slice())
            .map_err(|error| Error::String(format!("Failed to write to serial port {}: {}", path, error)))
    })
}
