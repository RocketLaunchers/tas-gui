import { MapContainer, TileLayer } from 'react-leaflet'

const Map = () => {
    const position = [32.9901482,-106.9750699]
    return (
        <div className='flex flex-col flex-1 grow-[2]'>
            <div className="divider uppercase">Map</div>
            <MapContainer center={position} zoom={13} scrollWheelZoom={true} className='rounded-xl flex-1'>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="/4uMaps/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}

export default Map;