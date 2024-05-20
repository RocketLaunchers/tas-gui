
import Map from './components/Map';
import Graphs from './components/Graphs';
import Console from './components/Console';
import React from 'react';
import Controls from './components/Controls';
import Telemetry from './components/Telemetry';
import Timeline from './components/Timeline';
import { Serialport } from 'tauri-plugin-serialport-api';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react';

function App() {
  const [connectionState, setConnectionState] = useState('btn-warning');
  const [packets, setPackets] = useState([])
  const [serialport] = useState(() => new Serialport({ path: '/dev/cu.usbmodem11301', baudRate: 115200 }))
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


  let columnNames = ["years", "months", "days"];
  useEffect(() => {
    
  }, [packets])
  
console.log("test");

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
        invoke('create_file', { data: data })
       
        data = data.split("\r\n")
        data.pop()
        data.shift()
        data = data.map(raw_packet => raw_packet.split(","))
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
  
  async function readData (name){
    try{ 
      const tableData = await invoke('load_database', {column: name})
      if (name === "years") {
        await setYearArray(tableData);
      } else if (name === "months") {
        await setMonthsArray(tableData);
      } else if (name === "days") {
        await setDaysArray(tableData);
      }
      //setInformation('is it null ' + years[0]);
      if (name === "years") {
        setInformation('function works: '+ name + ' ' + yearArray[0]);
      } else if (name === "months") {
        setInformation('function works: '+ name + ' ' + monthsArray[0]);
      } else if (name === "days") {
        setInformation('function works: '+ name + ' ' + daysArray[0]);
      }
     
    } catch (error) {
      setInformation(error);
    }
    //setInformation(information === 'right' ? 'wrong' : 'right');
   }

   function readAllData(){
    columnNames.forEach(name => readData(name));
   };
  return (
    <div className='h-screen w-screen flex flex-col'>

      <div className='flex w-full flex-1 p-2'>

        <div className='flex-1 flex flex-col'>

          <Map></Map>

          <Console  information={information}></Console> 
  
        </div>

        <div className="divider divider-horizontal"></div>

        <div className='flex flex-col flex-1'>

          <Graphs></Graphs>

          <div className='flex flex-1'>

            <Controls connectionState={connectionState} openSerialport={openSerialport} loadData={readAllData}></Controls>

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
}

export default App;
