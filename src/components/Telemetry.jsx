import React, { useState, useEffect, useRef } from 'react';

const Telemetry = ({ altitudes_array, satellites, rssi, snr, pressure, Accel_xArray, Accel_yArray, Accel_ZArray, gxArray, gyArray, gzArray, longitudesArray, latitudesArray,}) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const [loggedTimes, setLoggedTimes] = useState([]);
    const [systemTime, setSystemTime] = useState(new Date());
    const [timeInGravity, setTimeInGravity] = useState(0); // Track time within gravity range
    const stabilityTimerRef = useRef(null);

    const calculateAdjustedAcceleration = () => {
        const gx = gxArray[gxArray.length - 1] || 0;
        const gy = gyArray[gyArray.length - 1] || 0;
        const gz = gzArray[gzArray.length - 1] || 0;

        const Accel_x = Accel_xArray[Accel_xArray.length - 1] || 0;
        const Accel_y = Accel_yArray[Accel_yArray.length - 1] || 0;
        const Accel_z = Accel_ZArray[Accel_ZArray.length - 1] || 0;

        const pitch = gx * (Math.PI / 180);
        const roll = gy * (Math.PI / 180);

        const adjustedAccel_x = Accel_x * Math.cos(pitch) - Accel_y * Math.sin(roll);
        const adjustedAccel_y = Accel_x * Math.sin(roll) + Accel_y * Math.cos(pitch);
        const adjustedAccel_z = Accel_z;

        const accelMeanSqrt = Math.sqrt(
            adjustedAccel_x **2 +
            adjustedAccel_y **2 +
            adjustedAccel_z **2
        ) /10 ;
	return accelMeanSqrt.toFixed(2)
    };

    useEffect(() => {
        const currentAcceleration = parseFloat(calculateAdjustedAcceleration()) ;

        const takeoffThreshold = 1.00;
        const gravityLowerBound = 0.95; // Lower bound for gravity range
        const gravityUpperBound = 0.99; // Upper bound for gravity range
        const stabilityDuration = 5000; // 5 seconds

        // Check if we are within the gravity range
        const isInGravityRange = currentAcceleration >= gravityLowerBound && currentAcceleration <= gravityUpperBound;

        if (currentAcceleration >= takeoffThreshold) {
            // Start counting if above the takeoff threshold
            if (!isCounting) {
                setIsCounting(true);
            }
            // Reset timeInGravity since we're exceeding the threshold
            setTimeInGravity(0);
        } else if (isInGravityRange) {
            // We're within the gravity range
            if (isCounting) {
                // Increment time in gravity range
                setTimeInGravity((prev) => prev + 1000); // Increment by 1 second

                if (timeInGravity >= stabilityDuration) {
                    // If within gravity for 5 seconds, stop counting
                    setIsCounting(false);
                    setLoggedTimes((prev) => [...prev, elapsedTime]); // Log the time when stopping
                }
            }
        } else {
            // Reset timeInGravity if we're not in the gravity range
            setTimeInGravity(0);
        }

        return () => {
            if (stabilityTimerRef.current) {
                clearTimeout(stabilityTimerRef.current);
                stabilityTimerRef.current = null;
            }
        };
    }, [calculateAdjustedAcceleration, elapsedTime, isCounting, timeInGravity]);

    useEffect(() => {
        let interval;
        if (isCounting) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCounting]);

    useEffect(() => {
        const systemTimeInterval = setInterval(() => {
            setSystemTime(new Date());
        }, 1000);
        return () => clearInterval(systemTimeInterval);
    }, []);

    const formatSystemTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
    };

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
                {formatTime(elapsedTime)}
            </span>

            <div className="flex justify-center my-4">
                <p className="font-mono text-lg">System Time: {formatSystemTime(systemTime)}</p>
            </div>

            <div className="divider uppercase">Telemetry</div>
            <div className='flex'>
                <div className='flex flex-col'>
                    <p className='font-mono text-md'>Altitude: {altitudes_array[altitudes_array.length - 1]} m</p>
                    <p className='font-mono text-md'>RSSI: {rssi[rssi.length - 1]} </p>
                    <p className='font-mono text-md'>SNR: {snr[snr.length - 1]} </p>
                    <p className='font-mono text-md'>TLM Δ: 0.4 sec</p>
                    <p className='font-mono text-md'>GPS Sats: {satellites[satellites.length - 1]}</p>
                    <p className='font-mono text-md'>BME Pres: {pressure[pressure.length - 1]} bar</p>
                    <p className='font-mono text-md'>Acceleration: {calculateAdjustedAcceleration()} m/s²</p>
                    <p className='font-mono text-md'>Longitude: {longitudesArray[longitudesArray.length - 1]}</p>
                    <p className='font-mono text-md'>Latitude: {latitudesArray[latitudesArray.length - 1]}</p>
                </div>
            </div>

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
