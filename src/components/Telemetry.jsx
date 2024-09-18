import React, { useState, useEffect } from 'react';


const Telemetry = ({altitudes_array, satellites, rssi, snr, pressure}) => {
	const [currentTime, setCurrentTime] = useState(new Date());

   const [launchTime] = useState(new Date());
    
    // State to store the elapsed time in seconds
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const updateElapsedTime = () => {
            // Calculate the elapsed time in seconds
            const currentTime = new Date();
            const diffInSeconds = Math.floor((currentTime - launchTime) / 1000);
            setElapsedTime(diffInSeconds);
        };

        // Update elapsed time every second
        const interval = setInterval(updateElapsedTime, 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, [launchTime]);

    // Function to format elapsed time
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className='flex-1'>
            <div className="divider uppercase">Mission Clock</div>
            <span className="flex countdown font-mono-md text-5xl justify-center">
                {formatTime(elapsedTime)} {/* Display the formatted elapsed time */}
            </span>

            <div className="divider uppercase">Telemetry</div>
            <div className='flex'>
                <div className='flex flex-col'>
                    <p className='font-mono text-md'>Altitude: {altitudes_array[altitudes_array.length - 1]}</p>
                    <p className='font-mono text-md'>{rssi[rssi.length - 1]}: dBm</p>
                    <p className='font-mono text-md'>{snr[snr.length - 1]}: dBm</p>
                    <p className='font-mono text-md'>TLM &Delta;: 0.4 sec</p>
                    <p className='font-mono text-md'>GPS Sats: {satellites[satellites.length - 1]}</p>
                    <p className='font-mono text-md'>BME Pres: {pressure[pressure.length - 1]} bar</p>
                </div>
            </div>
        </div>
    );
}

export default Telemetry;







