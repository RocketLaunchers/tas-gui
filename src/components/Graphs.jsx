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
import { Line } from 'react-chartjs-2';
import { useEffect, useRef, useState } from 'react';
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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

function getRandomInt(max, min) {
  return Math.floor(Math.random() * max) + min;
}

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: labels.map(() => getRandomInt(1000, -1000)),
//       borderColor: 'rgb(255, 99, 132)',
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//     {
//       label: 'Dataset 2',
//       data: labels.map(() => getRandomInt(1000, -1000)),
//       borderColor: 'rgb(53, 162, 235)',
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//   ],
// };



const Graphs = ({setliveData, times_data, altitudes_data, setInformation}) => {
const [activeTab, setActiveTab] = useState('Live');

const pointstoPlot = 12;

let data
if (altitudes_data && times_data){

  const recentAltitudes = altitudes_data.slice(-pointstoPlot);
  const recentTimes = times_data.slice(-pointstoPlot);

 data = {
  labels: recentTimes,
  datasets: [
    {
      label: 'BAR_Altitude',
      data: recentAltitudes,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgb(255, 99, 132, 0.5)',
    },
  ]
}
} else {
  data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => getRandomInt(1000, -1000)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => getRandomInt(1000, -1000)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
}
const handleTabClick = (tab) => {
  setActiveTab(tab);
  setliveData((prevLive)=>!prevLive);
};
  return (
    <div className='flex flex-col flex-1'>
      <div className="divider uppercase">graphs</div>
      <div className="tabs">
      <button id="DatabaseTab" className={`tab tab-bordered tab-${activeTab === 'Databases' ? 'active' : ''}`} onClick={() => handleTabClick('Databases')}>Databases</button>
      </div>
      <div className='flex-1'>
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

export default Graphs;