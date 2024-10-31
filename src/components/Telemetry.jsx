import React, { useState, useEffect } from 'react';

const Telemetry = ({altitudes_array,satellites,rssi,snr,pressure,Accel_xArray,Accel_yArray,Accel_ZArray,gxArray,gyArray,gzArray,longitudesArray,latitudesArray,}) => {
    const [elapsedTime, setElapsedTime] = useState(0); // State for elapsed mission time
    const [isCounting, setIsCounting] = useState(false); // State to track whether mission clock is counting
    const [loggedTimes, setLoggedTimes] = useState([]); // State to store logged times
    const [systemTime, setSystemTime] = useState(new Date()); // State for live system time

    // Update live system time every second
    useEffect(() => {
        const systemTimeInterval = setInterval(() => {
            setSystemTime(new Date());
        }, 1000); // Update every second

        // Clean up the interval when the component unmounts
        return () => clearInterval(systemTimeInterval);
    }, []);

    // Function to format system time as HH:MM:SS (12-hour format)
    const formatSystemTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;  // Convert 24-hour to 12-hour format
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
    };

    // Function to format elapsed mission time
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Function to calculate the combined acceleration, adjusting for orientation
    const calculateAdjustedAcceleration = () => {
        const gx = gxArray[gxArray.length - 1] || 0;
        const gy = gyArray[gyArray.length - 1] || 0;
        const gz = gzArray[gzArray.length - 1] || 0;

        const Accel_x = Accel_xArray[Accel_xArray.length - 1] || 0;
        const Accel_y = Accel_yArray[Accel_yArray.length - 1] || 0;
        const Accel_z = Accel_ZArray[Accel_ZArray.length - 1] || 0;

        // Calculate pitch, roll, and yaw from gyroscope data
        const pitch = gx * (Math.PI / 180); // Convert to radians
        const roll = gy * (Math.PI / 180);  // Convert to radians

        // Apply rotation matrix to adjust acceleration readings
        const adjustedAccel_x = Accel_x * Math.cos(pitch) - Accel_y * Math.sin(roll);
        const adjustedAccel_y = Accel_x * Math.sin(roll) + Accel_y * Math.cos(pitch);
        const adjustedAccel_z = Accel_z; // Keeping Z-axis for vertical acceleration

        // Combine adjusted accelerations into a single vector magnitude
        return Math.sqrt(
            adjustedAccel_x ** 2 +
            adjustedAccel_y ** 2 +
            adjustedAccel_z ** 2
        ).toFixed(2);
    };

    // Logic for mission clock to 
    useEffect(() => {
        const currentAcceleration =  calculateAdjustedAcceleration(); 

        const takeoffThreshold = 10; // threshold above gravity
        const gravityThreshold = 9.8; // approximate gravity force
        const stabilityRange = 0.5; // Range around Gravity  indicating stationary
        const stabilityDuration = 3000; // duration in ms to confirm stationary 3 secs

          // Timer reference for detecting stable period
    let stabilityTimer = null;

    // Start counting on takeoff
    if (currentAcceleration >= takeoffThreshold && !isCounting) {
        setIsCounting(true);
    }

    // Check for a stable period around gravity to stop counting
    if (isCounting && Math.abs(currentAcceleration - gravityThreshold) < stabilityRange) {
        // Set or reset stability timer
        if (!stabilityTimer) {
            stabilityTimer = setTimeout(() => {
                setIsCounting(false);
                setLoggedTimes((prev) => [...prev, elapsedTime]); // Log elapsed time
            }, stabilityDuration);
        }
    } else {
        // Clear timer if acceleration deviates from stable range
        clearTimeout(stabilityTimer);
        stabilityTimer = null;
    }

    // Cleanup function to clear timer if component unmounts or dependencies change
    return () => clearTimeout(stabilityTimer);

        
    }, [calculateAdjustedAcceleration, elapsedTime, isCounting]);

    // Update the mission elapsed time every second if counting
    useEffect(() => {
        let interval;
        if (isCounting) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1); // Increment elapsed time every second
            }, 1000);
        }

        // Clean up interval when not counting or component unmounts
        return () => clearInterval(interval);
    }, [isCounting]);

    return (
        <div className='flex-1'>
            <div className="divider uppercase">Mission Clock</div>
            <span className="flex countdown font-mono-md text-5xl justify-center">
                {formatTime(elapsedTime)} {/* Display the formatted elapsed time */}
            </span>

            {/* Display live system time */}
            <div className="flex justify-center my-4">
                <p className="font-mono text-lg">System Time: {formatSystemTime(systemTime)}</p>
            </div>

            <div className="divider uppercase">Telemetry</div>
            <div className='flex'>
                <div className='flex flex-col'>
                    <p className='font-mono text-md'>Altitude: {altitudes_array[altitudes_array.length - 1]}</p>
                    <p className='font-mono text-md'>{rssi[rssi.length - 1]}: dBm</p>
                    <p className='font-mono text-md'>{snr[snr.length - 1]}: dBm</p>
                    <p className='font-mono text-md'>TLM &Delta;: 0.4 sec</p>
                    <p className='font-mono text-md'>GPS Sats: {satellites[satellites.length - 1]}</p>
                    <p className='font-mono text-md'>BME Pres: {pressure[pressure.length - 1]} bar</p>
                    <p className='font-mono text-md'>Acceleration: {calculateAdjustedAcceleration()} m/s²</p>
                    <p className='font-mono text-md'>Longitudes: {longitudesArray[longitudesArray.length - 1]}</p>
                    <p className='font-mono text-md'>Latitudes: {latitudesArray[latitudesArray.length - 1]}</p>
                </div>
            </div>

            {/* Display the logged times */}
            <div className="divider uppercase">Logged Times</div>
            {loggedTimes.length > 0 ? (
                <ul className='font-mono'>
                    {loggedTimes.slice(-3).map((time, index) => (
                        <li key={index}>Time logged: {formatTime(time)}</li>
                    ))}
                </ul>
            ) : (
                <p>No times logged yet.</p>
            )}
        </div>
    );
}

export default Telemetry;
