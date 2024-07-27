
const Telemetry = ({altitudes_array, satellites, rssi, snr, pressure}) => {
    return (
        <div className='flex-1'>
            <div className="divider uppercase">mission clock</div>
            <span className="flex countdown font-mono text-6xl justify-center">
            -
            <span style={{ "--value": 0 }}></span>:
            <span style={{ "--value": 3 }}></span>:
            <span style={{ "--value": 44 }}></span>
            </span>

            <div className="divider uppercase">telemtry</div>
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
