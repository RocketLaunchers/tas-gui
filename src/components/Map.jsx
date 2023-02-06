import { MapContainer, TileLayer } from 'react-leaflet'

const Map = () => {
    const position = [32.9901482,-106.9750699]
    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} className='grow-[3] rounded-xl'>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="/4uMaps/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
}

export default Map;