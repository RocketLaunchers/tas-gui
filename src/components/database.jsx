import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, getElementAtEvent } from 'react-chartjs-2';
import { useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      
    }
  },
};


let integer_column_names = ["years", "months", "days", "fixquality", "satellities"];
let string_column_names = ["weekdays", "times"];
let float_column_names = ["Accel_x", "Accel_y", "Accel_Z", "gx", "gy", "gz", "Temperature_C", "Temperature", "Pressures", "Altitudes", "Humidity", "fixs", "latitudes", "longitudes", "speed", "altitude_gps"];

const Databases = ({setInformation, setliveData}) => {
 
  const [dbyearArray, dbsetYearArray] = useState([]);
  const [dbmonthsArray, dbsetMonthsArray] = useState([]);
  const [dbdaysArray, dbsetDaysArray] = useState([]);
  const [dbfixqualityArray, dbsetfixqualityArray] = useState([]);
  const [dbsatellitiesArray, dbsetsatellitiesArray] = useState([]);
  const [dbweekdaysArray, dbsetweekdaysArray] = useState([]);
  const [dbtimesArray, dbsettimesArray] = useState([]);
  const [dbAccel_xArray, dbsetAccel_xArray] = useState([]);
  const [dbAccel_yArray, dbsetAccel_yArray] = useState([]);
  const [dbAccel_ZArray, dbsetAccel_ZArray] = useState([]);
  const [dbgxArray, dbsetgxArray] = useState([]);
  const [dbgyArray, dbsetgyArray] = useState([]);
  const [dbgzArray, dbsetgzArray] = useState([]);
  const [dbTemperature_CArray, dbsetTemperature_CArray] = useState([]);
  const [dbTemperatureArray, dbsetTemperatureArray] = useState([]);
  const [dbPressuresArray, dbsetPressuresArray] = useState([]);
  const [dbAltitudesArray, dbsetAltitudesArray] = useState([]);
  const [dbHumidityArray, dbsetHumidityArray] = useState([]);
  const [dbfixsArray, dbsetfixsArray] = useState([]);
  const [dblatitudesArray, dbsetlatitudesArray] = useState([]);
  const [dblongitudesArray, dbsetlongitudesArray] = useState([]);
  const [dbspeedArray, dbsetspeedArray] = useState([]);
  const [dbaltitudes_gpsArray, dbsetaltitudes_gpsArray] = useState([]);
  const [dbcurrentIndex, dbsetcurrentIndex] = useState(0);
  const [loadYear, setloadYear] = useState("2022-2023");
  const labels = dbtimesArray;
  const [makedbScreen, setmakedbScreen] = useState(false);



  async function readDataInteger (name, databaseSelected){
      try{ 
        const tableData = await invoke('load_database_integer_database', {column: name, databaseName: databaseSelected})
        if (name === "years") {
            await dbsetYearArray(tableData);
        } else if (name === "months") {
            await dbsetMonthsArray(tableData);
        } else if (name === "days") {
            await dbsetDaysArray(tableData);
        } else if (name === "fixquality") {
            await dbsetfixqualityArray(tableData);
        } else if (name === "satellities") {
            await dbsetsatellitiesArray(tableData);
        }
        //setInformation('is it null ' + years[0]);
        if (name === "years") {
          setInformation('function works: '+ name + ' ' + dbyearArray[0]);
        } else if (name === "months") {
          setInformation('function works: '+ name + ' ' + dbmonthsArray[0]);
        } else if (name === "days") {
          setInformation('function works: '+ name + ' ' + dbdaysArray[0]);
        }
      
      } catch (error) {
        setInformation(error);
      }
    //setInformation(information === 'right' ? 'wrong' : 'right');
   }
  
  async function readDataString (name, databaseSelected) {
    try{
      const tableData = await invoke('load_database_string_database', {column: name, databaseName:databaseSelected})
      if (name === "weekdays"){
        await dbsetweekdaysArray(tableData);
      } else if (name === "times"){
          await dbsettimesArray(tableData);
      }

    } catch (error){
      setInformation(error);
    }
  }

  async function readDataFloat (name, databaseSelected) {
    try{
      const tableData = await invoke('load_database_float_database', {column: name, databaseName:databaseSelected})
      if(name === "Accel_x"){
          await dbsetAccel_xArray(tableData);
      } else if (name === "Accel_y") {
          await dbsetAccel_yArray(tableData); 
      } else if (name === "Accel_Z") {
           await dbsetAccel_ZArray(tableData);
      } else if (name === "gx") {
          await dbsetgxArray(tableData);
      } else if (name === "gy") {
          await dbsetgyArray(tableData);
      } else if (name === "gz") {
          await dbsetgzArray(tableData);
      } else if (name === "Temperature_C") {
          await dbsetTemperature_CArray(tableData);
      } else if (name === "Temperature") {
          await dbsetTemperatureArray(tableData);
      } else if (name === "Pressures") {
          await dbsetPressuresArray(tableData);
      } else if (name === "Altitude") {
          await dbsetAltitudesArray(tableData);
      } else if (name === "Humidity") {
          await dbsetHumidityArray(tableData);
      } else if (name === "fixs") {
          await dbsetfixsArray(tableData);
      } else if (name === "latitudes") {
          await dbsetlatitudesArray(tableData);
          console.log('updated longitudes array');
      } else if (name === "longitudes") {
          await dbsetlongitudesArray(tableData);
          console.log('updated longitudes array');
      } else if (name === "speed") {
          await dbsetspeedArray(tableData);
      } else if (name === "altitude_gps"){
          await dbsetaltitudes_gpsArray(tableData);
          console.log('updated altitude_gps data')
       }

      if (name === "Accel_x") {
        setInformation('function works: '+ name + ' ' + dbAccel_xArray[0]);
      } else if (name === "Accel_y") {
        setInformation('function works: '+ name + ' ' + dbAccel_yArray[0]);
      } else if (name === "altitude_gps") {
        setInformation('function works: '+ name + ' ' + dbaltitudes_gpsArray[0]);
      }


    } catch(error){
      setInformation(error)
    }
  }

   async function readAllData(databaseSelected){
   try{ 
    const promises = [];
    integer_column_names.forEach(name => promises.push(readDataInteger(name, databaseSelected)));
    string_column_names.forEach(name => promises.push(readDataString(name, databaseSelected)));
    float_column_names.forEach(name => promises.push(readDataFloat(name, databaseSelected)));
    await Promise.all(promises);
   } catch(error){
    setInformation(error);
   }
   };



function getRandomInt(max, min) {
  return Math.floor(Math.random() * max) + min;
}

const data = {
  labels,
  datasets: [
    {
      label: 'Altitude',
      data: labels.map((label, index) => dbaltitudes_gpsArray[index]),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
};


const chartRef = useRef();
const onClick = (event) => {
  console.log((getElementAtEvent(chartRef.current, event))[0].index);
  dbsetcurrentIndex((getElementAtEvent(chartRef.current, event))[0].index);
  setInformation(`the new value of index is :  ${dbcurrentIndex}`);
} 


const [activeTab, setActiveTab] = useState('Live');

const handleTabClick = (tab) => {
  setActiveTab(tab);
  setliveData((prevLive)=>!prevLive);
};
// useEffect(() => {
//   setliveData((prevLive)=>!prevLive);
// },[activeTab])

const [yearSelect, setyearSelect] = useState('2022-2023');
const yearPicker = (e) =>{
  setyearSelect(e.target.value);
  setloadYear(e.target.value);
  console.log(`the current load year is ->  ${loadYear}`);
}
if(makedbScreen === false){
return (
  <div className='flex flex-col flex-1'>
    <div className="divider uppercase">Databases</div>
    <div className="tabs">
      <button id="DatabaseTab" className={`tab tab-bordered tab-${activeTab === 'Databases' ? 'active' : ''}`} onClick={() => handleTabClick('Databases')}>Live</button>
      {/* <button className={`tab tab-bordered tab-${activeTab === 'Live' ? 'active' : ''}`} onClick={() => handleTabClick('Live')}>Live</button>
      <button className={`tab tab-bordered tab-${activeTab === 'tab3' ? 'active' : ''}`} onClick={() => handleTabClick('tab3')}>Tab 3</button> */}
    </div>
    <div className='flex-1'>
    <Line ref={chartRef} data={data} onClick={onClick} />
    </div>
    <div className='flex flex-col flex-1'>
     
      <div className='flex-column'>
           <button className={"btn btn-outline btn-error uppercase"} onClick={()=>{readAllData(loadYear)}}>Load:{`${yearSelect}`}</button>
           <button className={'btn btn-outline btn-error uppercase'} onClick={()=>setmakedbScreen(true)}> New Database</button>
           <div>
              <label>
                  Select Database 
                  <select value={yearSelect} onChange={yearPicker}>
                      <option value="2022-2023">2022-2023</option>
                      <option value="2023-2024">2023-2024</option>
                  </select>
              </label>
           </div>

           <div className='flex-1'>

          <div className='flex'>
          <div className='flex flex-col'>
              <p className='font-mono text-md'>latitude: {`${dblatitudesArray[dbcurrentIndex]}`}</p>
              <p className='font-mono text-md'>longitudes: {`${dblongitudesArray[dbcurrentIndex]}`}</p>
              <p className='font-mono text-md'>GPS Sats: {`${dbsatellitiesArray[dbcurrentIndex]}`}</p>
              <p className='font-mono text-md'>BME Pres: {`${dbPressuresArray[dbcurrentIndex]}`}</p>
              <p className='font-mono text-md'> Atltitude:{`${dbaltitudes_gpsArray[dbcurrentIndex]}`}</p>
          </div>
          <div className='flex-1'>
              
          </div>
          </div>
      </div>
      </div>
   
    </div>
  </div>
  
  
);
} else {
  return (
    <></>
  );
} 
}; 
export default Databases;