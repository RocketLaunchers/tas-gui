import { invoke } from '@tauri-apps/api'
import Map from './components/Map';

function App() {
  invoke('greet', { name: 'World' }).then((response) => console.log(response))
  return (
    <div className='h-screen w-screen flex flex-col'>
      <div className='grid grid-rows-4 grid-cols-5 flex-1'>
        <canvas></canvas>
        <canvas></canvas>
        <canvas></canvas>
        <canvas></canvas>
        <canvas></canvas>
        <canvas></canvas>
        <Map></Map>
        <canvas></canvas>
        <canvas></canvas>
        <canvas></canvas>
        <canvas></canvas>
        <canvas></canvas>
      </div>
      <div className="divider uppercase">timeline</div>
      <ul className="steps">
        <li className="step step-info">Fly to moon</li>
        <li className="step step-info">Shrink the moon</li>
        <li className="step step-info">Grab the moon</li>
        <li className="step step-error" data-content="?">Sit on toilet</li>
      </ul>
    </div>
  );
}

export default App;
