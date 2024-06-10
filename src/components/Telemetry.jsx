import React, { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

const Telemetry = () => {
  // State to store the current time
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const updateClock = async () => {
      // Listen for messages form Rust (Tauri)
      await listen('tauri:updateTime', (event) => {
        //update state with received time
        setTime(event.payload);
      });
    };
    updateClock();
  }, []);


    return (
        <div className='flex-1'>
            <div className="divider uppercase">mission clock</div>
            <span className="flex countdown font-mono text-6xl justify-center">
            -
            <span style={{ "--value": time.substring(0, 1) }}></span>:
            <span style={{ "--value": time.substring(3, 4) }}></span>:
            <span style={{ "--value": time.substring(6, 7) }}></span>
            </span>

            <div className="divider uppercase">telemtry</div>
            <div className='flex'>
            <div className='flex flex-col'>
                <p className='font-mono text-md'>RSSI: 12 dBm</p>
                <p className='font-mono text-md'>SNR: 12 dBm</p>
                <p className='font-mono text-md'>TLM &Delta;: 0.4 sec</p>
                <p className='font-mono text-md'>GPS Sats: 6</p>
                <p className='font-mono text-md'>BME Pres: 0.6 bar</p>
            </div>
            <div className='flex-1'>
                <p className='font-mono text-md'>Altitude: 10,000 ft</p>
            </div>
            </div>
        </div>
    );
}

export default Telemetry;
