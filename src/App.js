
import Map from './components/Map';
import Graphs from './components/Graphs';
import Console from './components/Console';
import React from 'react';
import Controls from './components/Controls';
import Telemetry from './components/Telemetry';
import Timeline from './components/Timeline';
import Database from './components/database';
import { Serialport } from 'tauri-plugin-serialport-api';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react';

function App() {
  const [COMPort, setCOMPort] = useState('COM3');
  const [connectionState, setConnectionState] = useState('btn-warning');
  const [packets, setPackets] = useState([])
  const [serialport, setSerialport] = useState(() => new Serialport({ path:`${COMPort}`, baudRate: 115200 }))
  const [information, setInformation] = useState('right');
  const [yearArray, setYearArray] = useState([]);
  const [monthsArray, setMonthsArray] = useState([]);
  const [daysArray, setDaysArray] = useState([]);
  const [fixqualityArray, setfixqualityArray] = useState([]);
  const [satellitiesArray, setsatellitiesArray] = useState([]);
  const [weekdaysArray, setweekdaysArray] = useState([]);
  const [timesArray, settimesArray] = useState([]);
  const [Accel_xArray, setAccel_xArray] = useState([]);
  const [Accel_yArray, setAccel_yArray] = useState([]);
  const [Accel_ZArray, setAccel_ZArray] = useState([]);
  const [gxArray, setgxArray] = useState([]);
  const [gyArray, setgyArray] = useState([]);
  const [gzArray, setgzArray] = useState([]);
  const [Temperature_CArray, setTemperature_CArray] = useState([]);
  const [TemperatureArray, setTemperatureArray] = useState([]);
  const [PressuresArray, setPressuresArray] = useState([]);
  const [AltitudesArray, setAltitudesArray] = useState([]);
  const [HumidityArray, setHumidityArray] = useState([]);
  const [fixsArray, setfixsArray] = useState([]);
  const [latitudesArray, setlatitudesArray] = useState([]);
  const [longitudesArray, setlongitudesArray] = useState([]);
  const [speedArray, setspeedArray] = useState([]);
  const [altitudes_gpsArray, setaltitudes_gpsArray] = useState([]);
  const [currentIndex, setcurrentIndex] = useState(0);
 
  const [live, setliveData] = useState(true);

 
  useEffect(() => {
    
  }, [packets])
  
  useEffect(()=>{

    const newSerialPort = new Serialport({path: COMPort, baudRate: 115200})
    setSerialport(newSerialPort)
  },[COMPort])

  function openSerialport() {
    serialport
      .open()
      .then((res) => read())
      .catch((err) => {
        setConnectionState('btn-error')
        toast.error('Serial port not found.', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.error(err);
      });
  }

  function write() {
    serialport
      .write('t')
      .then((res) => {
        console.log('write serialport: ', res);
      })
      .catch((err) => {
        setConnectionState('btn-error')
        console.error(err);
      });
  }

  function read() {
    serialport
      .read({ timeout: 1 })
      .then((res) => listen())
      .catch((err) => {
        setConnectionState('btn-error')
        console.error(err);
      });
  }
  function listen() {
    serialport
      .listen((data) => {
       // invoke('create_file', { data: data })
        data = data.split("$")
        data.shift()
        for (let pack of data) {
          pack = pack.split("\r\n")
          pack.pop()
          pack.shift()  
          pack = pack.map(raw_packet => raw_packet.split(","))
          console.log('this is pack')
          console.log(pack)
          console.log('this is pack[0]')
          console.log(pack[0])
          console.log('this is pack[0][0]')
          console.log(pack[0][0])
          console.log()
        }
      }, false)
      .then((res) => {
        setConnectionState('btn-success btn-disabled')
        console.log('listen serialport: ', res);
      })
      .catch((err) => {
        setConnectionState('btn-error')
        console.error(err);
      });
  }
  function cancelRead() {
    serialport
      .cancelRead()
      .then((res) => {
        console.log('cancel read: ', res);
      })
      .catch((err) => {
        console.error(err);
      });
   }
  
  

  if (live){
    return(
    <div className='h-screen w-screen flex flex-col'>

      <div className='flex w-full flex-1 p-2'>

        <div className='flex-1 flex flex-col'>

          <Map></Map>

          <Console  information={information}></Console> 
  
        </div>

        <div className="divider divider-horizontal"></div>

        <div className='flex flex-col flex-1'>

          <Graphs setliveData={setliveData}></Graphs>

          <div className='flex flex-1'>

            <Controls connectionState={connectionState} openSerialport={openSerialport} setCOMPort={setCOMPort} COMPort={COMPort} setInformation={setInformation}></Controls>

            <div className="divider divider-horizontal mt-[16px]"></div>

            <Telemetry></Telemetry>

          </div>

        </div>

      </div>

      <Timeline></Timeline>

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

    </div>
  );
} else { 
  return(
    <Database
    setInformation={setInformation} 
    setliveData={setliveData} 
   >   
    </Database>
  ); 
}
}

export default App;
