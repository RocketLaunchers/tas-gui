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
    rawData,
    altitudes_gpsArray,
}) => {
    const [activeTab, setActiveTab] = useState('console');
    const [calculatedOrientation, setCalculatedOrientation] = useState({
        pitch: 0,
        roll: 0,
        yaw: 0,
    });
    const [apogee, setApogee] = useState(null);
    const [eventLog, setEventLog] = useState([]);

    const handleTabChange = (tab) => setActiveTab(tab);

    // Calculate orientation
    useEffect(() => {
        if (
            Accel_ZArray.length &&
            Accel_xArray.length &&
            Accel_yArray.length &&
            gxArray.length &&
            gyArray.length &&
            gzArray.length
        ) {
            const ax = Accel_xArray.at(-1);
            const ay = Accel_yArray.at(-1);
            const az = Accel_ZArray.at(-1);
            const gx = gxArray.at(-1);
            const gy = gyArray.at(-1);
            const gz = gzArray.at(-1);

            const pitch = Math.atan2(ax, Math.sqrt(ay * ay + az * az)) * (180 / Math.PI);
            const roll = Math.atan2(ay, Math.sqrt(ax * ax + az * az)) * (180 / Math.PI);
            const yaw = gz; // Simplified yaw calculation for demonstration

            setCalculatedOrientation({ pitch, roll, yaw });
        }
    }, [Accel_ZArray, Accel_xArray, Accel_yArray, gxArray, gyArray, gzArray]);

    // Detect apogee and log events
    useEffect(() => {
        if (altitudes_gpsArray.length > 1) {
            const currentAltitude = altitudes_gpsArray.at(-1);
            const previousAltitude = altitudes_gpsArray.at(-2);

            if (previousAltitude > currentAltitude && apogee === null) {
                setApogee(previousAltitude);
                const timestamp = new Date().toLocaleString();
                setEventLog((prevLog) => [
                    ...prevLog,
                    {
                        event: 'Apogee Reached',
                        altitude: previousAltitude,
                        time: timestamp,
                    },
                ]);
            }
        }
    }, [altitudes_gpsArray, apogee]);

    // Render rocket visualization
    const renderRocket = ({ pitch, roll, yaw }) => {
        const rocketStyle = {
            transform: `rotateX(${pitch}deg) rotateY(${roll}deg) rotateZ(${yaw}deg)`,
            transition: 'transform 0.3s ease',
            width: '100px',
            height: '200px',
            margin: '0 auto',
        };

        return (
            <div style={rocketStyle} className="rocket">
                <img
                    src="/RL/model/rocket.png"
                    alt="Rocket"
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        );
    };

    // Format recent raw data
    const getRecentRawData = () => {
        if (rawData?.length > 0) {
            return rawData
                .slice(-1)
                .map((packet) => JSON.stringify(packet, null, 2))
                .join('\n');
        }
        return 'No raw data available.';
    };

    return (
        <div className="flex flex-col flex-1">
            {/* Tabs */}
            <div className="tabs">
                {['console', 'rocket', 'rawData', 'events'].map((tab) => (
                    <button
                        key={tab}
                        className={`tab ${activeTab === tab ? 'tab-active' : ''}`}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Console Tab */}
            {activeTab === 'console' && (
                <div className="console-tab">
                    <div className="divider uppercase">Console</div>
                    <textarea
                        className="textarea textarea-bordered w-full h-52 text-sm resize-none"
                        readOnly
                        value={information || 'No information available.'}
                    ></textarea>
                </div>
            )}

            {/* Rocket Visualization */}
            {activeTab === 'rocket' && (
                <div className="rocket-tab">
                    <div className="divider uppercase">Rocket Orientation</div>
                    <div className="rocket-container">{renderRocket(calculatedOrientation)}</div>
                </div>
            )}

            {/* Raw Data Tab */}
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

            {/* Events Tab */}
            {activeTab === 'events' && (
                <div className="events-tab">
                    <div className="divider uppercase">Events</div>
                    <textarea
                        className="textarea textarea-bordered w-full h-72 text-sm resize-none"
                        readOnly
                        value={
                            eventLog.length
                                ? eventLog
                                      .map(
                                          (log) =>
                                              `${log.time}: ${log.event} at ${log.altitude} meters.`
                                      )
                                      .join('\n')
                                : 'No events logged yet.'
                        }
                    ></textarea>
                </div>
            )}
        </div>
    );
};

export default Console;
