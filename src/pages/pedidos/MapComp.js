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

	clickMarker = (props, marker) => {};

	render() {
		if (!this.props.loaded) return <div>Cargando...</div>;

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
					initialCenter={
						this.props.markerPos || {
							lat: -34.8938251,
							lng: -56.1663526,
						}
					}
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
	apiKey: process.env.REACT_APP_API_GOOGLE,
	language: 'es',
})(MapContainer);
