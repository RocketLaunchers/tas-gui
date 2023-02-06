import { invoke } from '@tauri-apps/api'
import Map from './components/Map';

function App() {
  invoke('greet', { name: 'World' }).then((response) => console.log(response))
  return (
    <div className='h-screen w-screen flex flex-col'>
      <div className='flex w-full flex-1 p-2'>
        <div className='flex-1 flex flex-col'>
          <div className="divider uppercase">Map</div>
          <Map></Map>
          <div className="divider uppercase">Console</div>
          <textarea className="grow-[1] resize-none	textarea textarea-bordered" readOnly value=">"></textarea>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className='flex flex-col flex-1'>
          <div className="divider uppercase">graphs</div>
          <div className="tabs">
            <a className="tab tab-bordered">Tab 1</a>
            <a className="tab tab-bordered tab-active">Tab 2</a>
            <a className="tab tab-bordered">Tab 3</a>
          </div>
          <canvas className='flex-1 bg-base-200'></canvas>

          <div className='flex flex-1'>
            <div className='flex-1'>
              <div className="divider uppercase">controls</div>
              <div className='card flex-1 flex flex-col gap-2'>
                <div className='flex-1'>
                  <div className="input-group w-full">
                    <input type="text" placeholder="set frequency" className="w-full input input-bordered uppercase" />
                    <button className="btn btn-square">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="24" height="24" viewBox="0 0 24 24"><path d="M6.043 17.496l-1.483 1.505c-2.79-2.201-4.56-5.413-4.56-9.001s1.77-6.8 4.561-9l1.483 1.504c-2.327 1.835-3.805 4.512-3.805 7.496s1.478 5.661 3.804 7.496zm8.957-7.496c0-1.657-1.344-3-3-3s-3 1.343-3 3c0 1.304.838 2.403 2 2.816v10.184h2v-10.184c1.162-.413 2-1.512 2-2.816zm-8.282 0c0-1.791.887-3.398 2.282-4.498l-1.481-1.502c-1.86 1.467-3.04 3.608-3.04 6s1.18 4.533 3.04 6l1.481-1.502c-1.396-1.1-2.282-2.707-2.282-4.498zm12.722-9l-1.483 1.504c2.326 1.835 3.804 4.512 3.804 7.496s-1.478 5.661-3.804 7.496l1.483 1.505c2.79-2.201 4.56-5.413 4.56-9.001s-1.77-6.8-4.56-9zm-2.959 3l-1.481 1.502c1.396 1.101 2.282 2.707 2.282 4.498s-.886 3.398-2.282 4.498l1.481 1.502c1.86-1.467 3.04-3.608 3.04-6s-1.179-4.533-3.04-6z"/></svg>
                    </button>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <div className='flex flex-col gap-2 flex-1'>
                    <button className="btn btn-outline btn-info uppercase">replay from file</button>
                    <button className="btn btn-outline btn-warning uppercase">flush memory</button>
                  </div>
                  <div className='flex flex-col gap-2 flex-1'>
                    <button className="btn btn-outline btn-warning uppercase">mpu reset</button>
                    <button className="btn btn-outline btn-warning uppercase">reset clock</button>
                  </div>
                </div>
                <button className="btn btn-outline btn-error uppercase">shutdown</button>
                <button className="btn btn-outline btn-warning uppercase">connect</button>
              </div>
            </div>
            <div className="divider divider-horizontal mt-[16px]"></div>
            <div className='flex-1'>

              <div className="divider uppercase">mission clock</div>
              <span className="flex countdown font-mono text-6xl justify-center">
                -
                <span style={{"--value":0}}></span>:
                <span style={{"--value":3}}></span>:
                <span style={{"--value":44}}></span>
              </span>

              <div className="divider uppercase">telemtry</div>
              <div className='flex'>
                <div className='flex flex-col'>
                  <p className='font-mono text-xl'>RSSI: 12 dBm</p>
                  <p className='font-mono text-xl'>SNR: 12 dBm</p>
                  <p className='font-mono text-xl'>TLM &Delta;: 0.4 sec</p>
                  <p className='font-mono text-xl'>GPS Sats: 6</p>
                  <p className='font-mono text-xl'>BME Pres: 0.6 bar</p>
                </div>
                <div className='flex-1'></div>
              </div>

            </div>
          </div>

        </div>
      </div>
      <div className="divider uppercase">timeline</div>
      <ul className="steps uppercase">
        <li className="step">Ignition</li>
        <li className="step">Burnout</li>
        <li className="step">Drogue</li>
        <li className="step">Main</li>
        <li className="step">Touch Down</li>
      </ul>
    </div>
  );
}

export default App;
