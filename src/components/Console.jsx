import React, { useState, useEffect } from 'react';

const Console = ({
    information, 
    orientationData, 
    Accel_ZArray, 
    Accel_xArray, 
    Accel_yArray, 
    gxArray, 
    gyArray, 
    gzArray, 
    rawData 
}) => {
    const [activeTab, setActiveTab] = useState('console'); 
    const [calculatedOrientation, setCalculatedOrientation] = useState({
        pitch: 0, 
        roll: 0, 
        yaw: 0, 
    });

    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Calculate orientation whenever accelerometer and gyroscope arrays update
    useEffect(() => {
        if (
            Accel_ZArray.length &&
            Accel_xArray.length &&
            Accel_yArray.length &&
            gxArray.length &&
            gyArray.length &&
            gzArray.length
        ) {
            const ax = Accel_xArray[Accel_xArray.length - 1]; 
            const ay = Accel_yArray[Accel_yArray.length - 1]; 
            const az = Accel_ZArray[Accel_ZArray.length - 1]; 
            const gx = gxArray[gxArray.length - 1]; 
            const gy = gyArray[gyArray.length - 1]; 
            const gz = gzArray[gzArray.length - 1]; 

            // Calculate pitch and roll angles from accelerometer data
            const pitch = Math.atan2(ax, Math.sqrt(ay * ay + az * az)) * (180 / Math.PI);
            const roll = Math.atan2(ay, Math.sqrt(ax * ax + az * az)) * (180 / Math.PI);
            const yaw = gz; // Use Z-axis gyroscope as a proxy for yaw angle

            setCalculatedOrientation({ pitch, roll, yaw }); // Update orientation state
        }
    }, [Accel_ZArray, Accel_xArray, Accel_yArray, gxArray, gyArray, gzArray]);

    // Renders a rocket visualization with orientation applied
    const renderRocket = (orientation) => {
        const { pitch, roll, yaw } = orientation;

        // Style for rocket transformation based on pitch, roll, and yaw
        const rocketStyle = {
            transform: `rotateX(${pitch}deg) rotateY(${roll}deg) rotateZ(${yaw}deg)`,
            transition: 'transform 0.3s ease', // Smooth transition for orientation changes
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

    // Extracts and formats the most recent raw data packets
    const getRecentRawData = () => {
        if (rawData && rawData.length > 0) {
            const formattedPackets = rawData
                .slice(-1) // Get the last 3 packets
                .map((packet) => JSON.stringify(packet, null, 2)) // Format each packet with proper indentation
                .join('\n'); // Combine packets with line breaks
            return formattedPackets;
        }
        return 'No raw data available.'; // Fallback if no raw data is present
    };

    return (
        <div className="flex flex-col flex-1">
            {/* Tab navigation */}
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
                <button
                    className={`tab ${activeTab === 'rawData' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('rawData')}
                >
                    Raw Data
                </button>
            </div>

            {/* Console tab content */}
            {activeTab === 'console' && (
                <div className="console-tab">
                    <div className="divider uppercase">Console</div>
                    <textarea
                        className="textarea textarea-bordered w-full h-52 text-sm resize-none"
                        readOnly
                        value={information}
                    ></textarea>
                </div>
            )}

            {/* Rocket visualization tab content */}
            {activeTab === 'rocket' && (
                <div className="rocket-tab">
                    <div className="divider uppercase">Rocket Orientation</div>
                    <div className="rocket-container">
                        {renderRocket(calculatedOrientation)}
                    </div>
                </div>
            )}

            {/* Raw data tab content */}
            {activeTab === 'rawData' && (
                <div className="raw-data-tab">
                    <div className="divider uppercase">Raw Data</div>
                    <textarea
                        className="textarea textarea-bordered w-full h-72 text-sm resize-none"
                        readOnly
                        value={getRecentRawData()}
                    ></textarea>
                </div>
            )}
        </div>
    );
};

export default Console;
