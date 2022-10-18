import React, { Component, useState } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

export class MapContainer extends Component {
	state = {
		center: {
			lat: -34.8938251,
			lng: -56.1663526,
		},
		markers: null,
	};

	// const [initialPosition, setInitialPosition] = useState({
	// 	latitude: -34.90658452897425,
	// 	longitude: -56.18052889728755,
	// 	latitudeDelta: 0.09,
	// 	longitudeDelta: 0.035,
	// });

	// fetchPlaces = (mapProps, map) => {
	//   let coordinates = [];
	//   const { google } = mapProps;
	//   const service = new google.maps.places.PlacesService(map);
	//   var request = {
	//     location: this.state.center,
	//     radius: "500",
	//     query: "restaurant"
	//   };
	//   service.textSearch(request, (results, status) => {
	//     if (status == google.maps.places.PlacesServiceStatus.OK) {
	//       for (var i = 0; i < results.length; i++) {
	//         //console.log(results[i]);
	//         coordinates.push(results[i]);
	//       }
	//       this.setState({ markers: coordinates });
	//     }
	//   });
	// };

	clickMarker = (props, marker) => {
		console.log(props.placeId);
	};

	render() {
		if (!this.props.loaded) return <div>Loading...</div>;

		return (
			<div>
				<Map
					className="map"
					google={this.props.google}
					center={
						this.props.markerPos || {
							lat: -34.8938251,
							lng: -56.1663526,
						}
					}
					initialCenter={{
						lat: -34.8938251,
						lng: -56.1663526,
					}}
					zoom={12}
					// onReady={this.fetchPlaces}
					style={{ height: 250, position: 'relative', width: 455 }}
				>
					{this.props.markerPos && <Marker key={34} position={this.props.markerPos} onClick={this.clickMarker} />}
				</Map>
			</div>
		);
	}
}
export default GoogleApiWrapper({
	apiKey: '',
	language: 'es',
})(MapContainer);
