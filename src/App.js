
import Map from './components/Map';
import Graphs from './components/Graphs';
import Console from './components/Console';
import React, { useState, useEffect } from 'react';
import Controls from './components/Controls';
import Telemetry from './components/Telemetry';
import Timeline from './components/Timeline';
import { Serialport } from 'tauri-plugin-serialport-api';
//import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { invoke } from '@tauri-apps/api/tauri'
//import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

function App() {
  const [connectionState, setConnectionState] = useState('btn-warning');
  const [packets, setPackets] = useState([])
  const [serialport] = useState(() => new Serialport({ path: 'COM7', baudRate: 115200 }))
  const [information, setInformation] = useState('READY');
  const [yearArray, setYearArray] = useState([]);
  const [monthsArray, setMonthsArray] = useState([]);
  const [daysArray, setDaysArray] = useState([]);


  //let columnNames = ["years", "months", "days"];
  let columnNames = ["years"];
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
        setInformation('function works: '+ name + ' ' + yearArray[0]);
      } 
      //if (name === "years") {
      //}
     
    } catch (error) {
      setInformation(error);
    }
    //try{
      //if (name === "years") {
      //  setInformation('function works: '+ name + ' ' + yearArray[0]);
      //}
    //} catch (error) {
    //  setInformation(error);
    //}

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
