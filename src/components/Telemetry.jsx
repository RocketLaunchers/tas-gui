import React, { useState, useEffect, useRef } from 'react';

const Telemetry = ({
    altitudes_array,
    satellites,
    rssi,
    snr,
    pressure,
    Accel_xArray,
    Accel_yArray,
    Accel_ZArray,
    gxArray,
    gyArray,
    gzArray,
    longitudesArray,
    latitudesArray,
}) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const [loggedTimes, setLoggedTimes] = useState([]);
    const [systemTime, setSystemTime] = useState(new Date());
    const [timeInGravity, setTimeInGravity] = useState(0); // Track time within gravity range
    const [tlmDeltas, setTlmDeltas] = useState({}); // Store telemetry deltas

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
            adjustedAccel_x ** 2 +
            adjustedAccel_y ** 2 +
            adjustedAccel_z ** 2
        ) / 10;

        return accelMeanSqrt.toFixed(2);
    };

    const calculateDeltas = (array) => {
        if (array.length < 2) return 0;
        const current = array[array.length - 1];
        const previous = array[array.length - 2];
        return (current - previous).toFixed(2);
    };

    useEffect(() => {
        const currentAcceleration = parseFloat(calculateAdjustedAcceleration());

        const takeoffThreshold = 1.00;
        const gravityLowerBound = 0.95;
        const gravityUpperBound = 0.99;
        const stabilityDuration = 5000; // 5 seconds

        const isInGravityRange = currentAcceleration >= gravityLowerBound && currentAcceleration <= gravityUpperBound;

        if (currentAcceleration >= takeoffThreshold) {
            if (!isCounting) {
                setIsCounting(true);
            }
            setTimeInGravity(0);
        } else if (isInGravityRange) {
            if (isCounting) {
                setTimeInGravity((prev) => prev + 1000);

                if (timeInGravity >= stabilityDuration) {
                    setIsCounting(false);
                    setLoggedTimes((prev) => [...prev, elapsedTime]);
                }
            }
        } else {
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
        setTlmDeltas({
            altitudeDelta: calculateDeltas(altitudes_array),
            pressureDelta: calculateDeltas(pressure),
            accelDelta: calculateDeltas([
                ...Accel_xArray.map((x, i) =>
                    Math.sqrt(
                        Accel_xArray[i] ** 2 +
                        Accel_yArray[i] ** 2 +
                        Accel_ZArray[i] ** 2
                    )
                ),
            ]),
        });
    }, [
        altitudes_array,
        pressure,
        Accel_xArray,
        Accel_yArray,
        Accel_ZArray,
    ]);

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
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
            2,
            '0'
        )}:${String(seconds).padStart(2, '0')} ${ampm}`;
    };

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
            2,
            '0'
        )}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className='flex-1'>
            <div className="divider uppercase">Mission Clock</div>
            <span className="flex countdown font-mono-md text-5xl justify-center">
                {formatTime(elapsedTime)}
            </span>
            <div className="flex justify-center my-4">
                <p className="font-mono text-lg">
                    System Time: {formatSystemTime(systemTime)}
                </p>
            </div>
            <div className="divider uppercase">Telemetry</div>
            <div className="flex">
                <div className="flex flex-col">
                    <p className="font-mono text-md">
                        Altitude: {altitudes_array[altitudes_array.length - 1]} m (Δ: {tlmDeltas.altitudeDelta} m)
                    </p>
                    <p className="font-mono text-md">RSSI: {rssi[rssi.length - 1]}</p>
                    <p className="font-mono text-md">SNR: {snr[snr.length - 1]}</p>
                    <p className="font-mono text-md">
                        Pressure: {pressure[pressure.length - 1]} bar (Δ: {tlmDeltas.pressureDelta} bar)
                    </p>
                    <p className="font-mono text-md">
                        Acceleration: {calculateAdjustedAcceleration()} m/s² (Δ: {tlmDeltas.accelDelta} m/s²)
                    </p>
                    <p className="font-mono text-md">
                        Longitude: {longitudesArray[longitudesArray.length - 1]}
                    </p>
                    <p className="font-mono text-md">
                        Latitude: {latitudesArray[latitudesArray.length - 1]}
                    </p>
                    <p className="font-mono text-md">
                        Satellites: {satellites[satellites.length - 1]}
                    </p>
                </div>
            </div>
            <div className="divider uppercase">Logged Times</div>
            {loggedTimes.length > 0 ? (
                <ul className="font-mono">
                    {loggedTimes.slice(-3).map((time, index) => (
                        <li key={index}>Time logged: {formatTime(time)}</li>
                    ))}
                </ul>
            ) : (
                <p>No times logged yet.</p>
            )}
        </div>
    );
};

export default Telemetry;