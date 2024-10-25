import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'; 
import { useEffect, useState } from 'react';

const Map = ({ longitudesArray = [], latitudesArray = [] }) => {
	// State for position
	const [position, setPosition] = useState([26.305210, -98.175972]); // Default static position
	const [isLoading, setIsLoading] = useState(true); // State to manage loading

	// Effect to update position based on latitude and longitude arrays
	useEffect(() => {
		console.log("useEffect fired", latitudesArray, longitudesArray);

		if (latitudesArray.length > 0 && longitudesArray.length > 0) {
			const newPosition = [
				latitudesArray[latitudesArray.length - 1],
				longitudesArray[longitudesArray.length - 1]
			];

			// Check if new position is valid before setting
			if (isFinite(newPosition[0]) && isFinite(newPosition[1])) {
				setPosition(newPosition);
			}
		} else {
			// Reset position to default if no valid data
			setPosition([26.305210, -98.175972]);
		}

		setIsLoading(false); // Mark loading as complete
	}, [latitudesArray, longitudesArray]); // Run effect when arrays change

	if (isLoading) {
		return <div>Loading map...</div>; // Show loading state
	}

	return (
		<div className='flex flex-col flex-1 grow-[2]'>
			<div className="divider uppercase">Map</div>
			<MapContainer center={position} zoom={11} maxZoom={18} scrollWheelZoom={true} className='rounded-xl flex-1'>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="/4uMaps/maps/{z}/{x}/{y}.png"
				/>
				<Marker position={position}>
					<Popup>
						Live Location. <br /> Easily customizable.
					</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}

export default Map;
