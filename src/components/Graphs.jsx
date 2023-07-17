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

export const data = {
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
};

const Graphs = () => {
  return (
    <div className='flex flex-col flex-1'>
      <div className="divider uppercase">graphs</div>
      <div className="tabs">
        <button className="tab tab-bordered">Tab 1</button>
        <button className="tab tab-bordered tab-active">Tab 2</button>
        <button className="tab tab-bordered">Tab 3</button>
      </div>
      <div className='flex-1'>
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

export default Graphs;