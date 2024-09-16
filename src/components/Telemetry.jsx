import React, { useState, useEffect } from 'react';


const Telemetry = ({altitudes_array, satellites, rssi, snr, pressure}) => {
	const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date());
        };

        // Update time every second
        const interval = setInterval(updateTime, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='flex-1'>
            <div className="divider uppercase">mission clock</div>
            <span className="flex countdown font-mono-md  text-6xl justify-center">
            </span>
<span className="flex countdown font-mono text-3xl justify-center">
  {currentTime.toLocaleTimeString()}
</span>


            <div className="divider uppercase">telemetry</div>
            <div className='flex'>
            <div className='flex flex-col'>
                <p className='font-mono text-md'>Altitude: {altitudes_array[altitudes_array.length-1]}</p>
                <p className='font-mono text-md'>{rssi[rssi.length-1]}: dBm</p>
                <p className='font-mono text-md'>{snr[snr.length-1]}: dBm</p>
                <p className='font-mono text-md'>TLM &Delta;: 0.4 sec</p>
                <p className='font-mono text-md'>GPS Sats: {satellites[satellites.length-1]}</p>
                <p className='font-mono text-md'>BME Pres: {pressure[pressure.length-1]} bar</p>
            </div>
            </div>
        </div>
    );
}

export default Telemetry;
