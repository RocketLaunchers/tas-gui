
import Map from './components/Map';
import Graphs from './components/Graphs';
import Console from './components/Console';
import React, { useState, useEffect } from 'react';
import Controls from './components/Controls';
import Telemetry from './components/Telemetry';
import Timeline from './components/Timeline';
import Database from './components/database';
import { Serialport } from 'tauri-plugin-serialport-api';
//import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { invoke } from '@tauri-apps/api/tauri'
//import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

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

  function parsePack(pack1, pack2, pack3, pack4, pack5, pack6, pack7, pack8, pack9, pack10, pack11){
     parseMessage(pack1);
    // Accel_ys.push(pack2); 
     setAccel_yArray(prevAccely => [...prevAccely, pack2]);
    // Accel_zs.push(pack3);
     setAccel_ZArray(prevAccelz => [...prevAccelz, pack3]);
    // gxs.push(pack4);
     setgxArray(prevgxs => [...prevgxs, pack4]);
    // gys.push(pack5);
     setgyArray(prevgys => [...prevgys, pack5]);
    // gzs.push(pack6);
     setgzArray(prevgzs => [...prevgzs, pack6]);
    // Temperature_Cs.push(pack7);
     setTemperature_CArray(prevTempC => [...prevTempC, pack7]);
    // Temperatures.push(pack8);
     setTemperatureArray(prevTemp => [...prevTemp, pack8]);
    // Pressures.push(pack9);
     setPressuresArray(prevTPressure => [...prevTPressure, pack9]);
    // Altitudes.push(pack10);
     setAltitudesArray(prevAltitudesArray => [...prevAltitudesArray, pack10]);
    // Humidities.push(pack11);
     setHumidityArray(prevHumidity => [...prevHumidity, pack11]);
    // fixs.push(pack12);
    // setfixsArray(prevfixs => [...prevfixs, pack12]);
    // fixqualities.push(pack13)
    // setfixqualityArray(fixqualities);
    // latitudes.push(pack14);
    // setlatitudesArray(latitudes);
    // longitudes.push(pack15);
    // setlongitudesArray(longitudes);
    // speeds.push(pack16);
    // setspeedArray(speeds);
    // altitudesgps.push(pack17);
    // setaltitudes_gpsArray(altitudesgps);
    // satellelites.push(pack18);
    // setsatellitiesArray(satellelites);
  
  }
  function parsePack2 (pack1, pack2, pack3, pack4, pack5, pack6, pack7, pack8, pack9, pack10, pack11, pack12, pack13, pack14, pack15, pack16, pack17, pack18){
    parseMessage(pack1);
    setAccel_yArray((prevState)=>prevState.push(pack2));
    setAccel_ZArray((prevState)=>prevState.push(pack3));
    setgxArray((prevState)=>prevState.push(pack4));
    setgyArray((prevState)=>prevState.push(pack5));
    setgzArray((prevState)=>prevState.push(pack6));
    setTemperature_CArray((prevState)=>prevState.push(pack7));
    setTemperatureArray((prevState) => (prevState.push(pack8)));
    setPressuresArray((prevState)=>prevState.push(pack9));
    setAltitudesArray((prevState)=>prevState.push(pack10));
    setHumidityArray((prevState)=>prevState.push(pack11));
    setfixsArray((prevState)=>prevState.push(pack12));
    setfixqualityArray((prevState)=>prevState.push(pack13));
    setlatitudesArray((prevState)=>prevState.push(pack14));
    setlongitudesArray((prevState)=>prevState.push(pack15));
    setspeedArray((prevState)=>prevState.push(pack16));
    setaltitudes_gpsArray((prevState)=>prevState.push(pack17));
    setsatellitiesArray((prevState)=>prevState.push(pack18));
  }
  useEffect(() => {
    //console.log('altitudes' + AltitudesArray);
    console.log('times' + timesArray);
  }, AltitudesArray)
  function parseMessage(inputString){
    const pattern = /Message: \[(\d{4})\/(\d{1,2})\/(\d{1,2}) \((\w+)\) (\d{2}:\d{2}:\d{2})\] (-?\d+\.\d+)/;  
    const match = inputString.match(pattern);

    if(match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const day = parseInt(match[3], 10);
      const weekday = match[4];
      const time = match[5];
      const decimalValue = parseFloat(match[6]);
      setYearArray(prevYear => [...prevYear, year]);
      setMonthsArray(prevMonth => [...prevMonth, month]);
      setDaysArray(prevDay => [...prevDay, day]);
      setweekdaysArray(prevWeekday => [...prevWeekday,weekday]);
      setAccel_xArray(prevAccelx => [...prevAccelx,decimalValue]); 
      settimesArray(prevtimes => [...prevtimes, time]);
      // setInformation(timesArray[timesArray.length-1]);
      //console.log('this is times array' + timesArray);
    }
  }
 let years = [];
 let months = [];
 let days = [];
 let times = [];
 let weekdays = [];
 let Accel_xs =[];
 let Accel_ys = [];
 let Accel_zs = [];
 let gxs = [];
 let gys = [];
 let gzs = [];
 let Temperature_Cs = [];
 let Temperatures = [];
 let Pressures = [];
 let Altitudes = [];
 let Humidities = [];
 let fixs = [];
 let fixqualities = [];
 let latitudes = [];
 let longitudes = [];
 let speeds = [];
 let altitudesgps = [];
 let satellelites = [];
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
          if(pack.length !== 0){
            console.log('this is pack')
            console.log(pack)
            console.log('this is pack[0]')
            console.log(pack[0])
            console.log('this is pack[0][0]')
            console.log(pack[0][0])
            parsePack(
              pack[0][0], 
              pack[0][1], 
              pack[0][2],
              pack[0][3], 
              pack[0][4], 
              pack[0][5], 
              pack[0][6], 
              pack[0][7], 
              pack[0][8], 
              pack[0][9], 
              pack[0][10]
            )
        }
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

          <Graphs 
              setliveData={setliveData}
              times_data={timesArray}
              altitudes_data={AltitudesArray}
              setInformation={setInformation}
              ></Graphs>

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
////////////////     4/17/24     //////////////////////////////
//function CLOCK() {
//  const [time, setTime] = useState('');
//  
//  useEffect(() => {
//    const updateClock = async () => {
//      //Listen for messages from Rust
//      await listen('tauri:updateTime', (event) => {
//        // Update state with recieved time
//        setTime(event.payload);
//      });
//    };
//  }, []);
//
//  return (
//    <div>
//
////////////////     4/17/24     //////////////////////////////
  
   
    
export default App;
