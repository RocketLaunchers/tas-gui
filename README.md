# Telemetry Acquisition System GUI v1
Date: 7/2024
## Screenshots

![App Screenshot](http://ramongarciajr.tech/TAS%20GUI.jpeg)


## Lessons Learned
ramongarciajr:
During my tenure as the telemetry lead(Fall 2022-Summer 2023), my involvement extended beyond the creation of TAS v2 and encompassed the development of accompanying software for the associated hardware. Regarding the software, we initially envisioned a desktop application that would feature a responsive graphical user interface (GUI) accessible through a web interface. This requirement led us to evaluate two potential options: Electron and Tauri, each offering distinct advantages and disadvantages.

Electron presented favorable aspects such as strong community support and user-friendliness. However, it posed certain challenges due to its age and lack of recent updates and support. On the other hand, Tauri emerged as a newer alternative that employed Rust as the server, instead of Node.js. Both frameworks offered web interfaces for the client-side GUI, but ultimately, our decision hinged on the fact that Electron's SerialPort API had become outdated and lacked sufficient support in recent times.

While Tauri also faced limitations, including a single library for serial port communication with under-documented aspects, it nonetheless fulfilled its intended functionality. Ultimately, we selected Tauri due to its novelty and improved performance compared to Electron.


## Optimizations

In general, the system demonstrated functionality; however, there were several optimizations that I aimed to implement. Firstly, an improvement was necessary in the storage and retrieval of map titles. These map titles are essentially individual blocks that are combined to create maps, similar to how Google Maps functions. In the current version, the approach involved downloading and locally storing all the titles, which proved to be a slow and space-consuming process. To enhance this aspect, a more efficient method for managing and accessing map titles needed to be devised.

Additionally, there was a need to optimize the processing of the incoming serial stream to effectively filter out erroneous data. By implementing better filtering techniques, we aimed to obtain a more precise representation of the rocket's trajectory during flight. This optimization would enable us to enhance the accuracy of the data obtained from the serial stream, ensuring a more reliable depiction of the rocket's behavior throughout its journey.


## Run Locally

Clone the project

```bash
git clone https://github.com/LoneCuriosity/tas-gui-v1.1.0
```

Open terminal in project root directory and run

```bash
npm run tauri dev
```


## 🛠 Skills
React.js, Rust, Tailwind


## Tech Stack

- Tauri
- Tailwind
- React.js
- Rust

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ramongarciajr.tech/)


## Authors

- [@LoneCuriosity](https://www.github.com/LoneCuriosity)
- [@HECTOR-SO](https://github.com/HECTOR-SO)
- [@JofredG](https://github.com/JofredG)
- [@andrewalvrz](https://github.com/andrewalvrz)
