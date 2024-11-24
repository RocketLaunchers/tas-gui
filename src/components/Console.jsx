import { useState, useEffect } from 'react';

const Console = ({ 
    information, 
    orientationData, 
    Accel_ZArray, 
    Accel_xArray, 
    Accel_yArray, 
    gxArray, 
    gyArray, 
    gzArray 
}) => {
    const [activeTab, setActiveTab] = useState('console');
    const [calculatedOrientation, setCalculatedOrientation] = useState({
        pitch: 0,
        roll: 0,
        yaw: 0,
    });

    // Function to switch between tabs
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Calculate pitch, roll, and yaw from sensor arrays
    useEffect(() => {
        if (
            Accel_ZArray.length &&
            Accel_xArray.length &&
            Accel_yArray.length &&
            gxArray.length &&
            gyArray.length &&
            gzArray.length
        ) {
            // Example: Use the most recent data point for calculation
            const ax = Accel_xArray[Accel_xArray.length - 1];
            const ay = Accel_yArray[Accel_yArray.length - 1];
            const az = Accel_ZArray[Accel_ZArray.length - 1];
            const gx = gxArray[gxArray.length - 1];
            const gy = gyArray[gyArray.length - 1];
            const gz = gzArray[gzArray.length - 1];

            // Convert accelerometer data to angles (pitch and roll)
            const pitch = Math.atan2(ax, Math.sqrt(ay * ay + az * az)) * (180 / Math.PI);
            const roll = Math.atan2(ay, Math.sqrt(ax * ax + az * az)) * (180 / Math.PI);

            // Gyroscope data can be integrated over time for yaw (example only)
            const yaw = gz; // Example: Replace with appropriate calculation or filtering if needed

            setCalculatedOrientation({ pitch, roll, yaw });
        }
    }, [Accel_ZArray, Accel_xArray, Accel_yArray, gxArray, gyArray, gzArray]);

    // Function to render the rocket based on the orientation data
    const renderRocket = (orientation) => {
        const { pitch, roll, yaw } = orientation || { pitch: 0, roll: 0, yaw: 0 };

        const rocketStyle = {
            transform: `rotateX(${pitch}deg) rotateY(${roll}deg) rotateZ(${yaw}deg)`,
            transition: 'transform 0.3s ease', // Smooth transition for rotation
            width: '100px',
            height: '200px',
            margin: '0 auto',
            position: 'relative',
        };

        return (
            <div style={rocketStyle} className="rocket">
                <img src="/RL/model/rocket.png" alt="Rocket" style={{ width: '100%', height: '100%' }} />
            </div>
        );
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'console' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('console')}
                >
                    Console
                </button>
                <button
                    className={`tab ${activeTab === 'rocket' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('rocket')}
                >
                    Rocket
                </button>
            </div>

            {activeTab === 'console' && (
                <div className="console-tab">
                    <div className="divider uppercase">Console</div>
                    <textarea
                        className="grow-[1] resize-none textarea textarea-bordered"
                        readOnly={true}
                        value={information}
                    ></textarea>
                </div>
            )}

            {activeTab === 'rocket' && (
                <div className="rocket-tab">
                    <div className="divider uppercase">Rocket Orientation</div>
                    <div className="rocket-container">
                        {renderRocket(calculatedOrientation)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Console;