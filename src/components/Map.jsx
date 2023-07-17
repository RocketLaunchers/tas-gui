import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

const Map = () => {
    //const position = [32.9901482,-106.9750699]
    const position = [26.306049, -98.172949]
    return (
        <div className='flex flex-col flex-1 grow-[2]'>
            <div className="divider uppercase">Map</div>
            <MapContainer center={position} zoom={13} maxZoom={15} scrollWheelZoom={true} className='rounded-xl flex-1'>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="/4uMaps/{z}/{x}/{y}.png"
                />
                <Marker position={[26.306173, -98.174721]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default Map;