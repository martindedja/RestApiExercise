import GoogleMapReact from "google-map-react";
import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import axios from "axios";

const Marker = () => <LocationOnIcon />;
const NearbyMarker = () => <LocationOnIcon style={{color:'red'}} />;

function App() {
  const [coordinates, setCoordinates] = useState({
    lat: 53.5711,
    lng: 10.0015,
  });
  const [nearbyMarkers, setNearbyMarkes] = useState([]);
  const [errors, setErrors] = useState();

  const handleOnClick = (event) => {
    const { lat, lng } = event;
    setCoordinates({ lat, lng });

    setErrors("");

    axios
      .get("https://v5.db.transport.rest/stops/nearby", {
        params: {
          latitude: lat,
          longitude: lng,
          results: 5,
        },
      })
      .then((response) => {
        const { data } = response;

        const arrivedMarkers = data.map((x) => {
          return {
            name: x.name,
            lat: x.location.latitude,
            lng: x.location.longitude,
          };
        });

        setNearbyMarkes(arrivedMarkers);
      })
      .catch((reason) => {
        setErrors(reason);
      });
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Typography
        className="header"
        style={{
          fontSize: 42,
          textAlign: "center",
          padding: 10,
          fontWeight: 900,
        }}
      >
        Nearest Bus Station Locator
      </Typography>
      {errors && (
        <Typography
          className="header"
          style={{
            fontSize: 20,
            textAlign: "center",
            padding: 10,
            fontWeight: 900,
            color: "red",
          }}
        >
          {errors}
        </Typography>
      )}
      <div
        style={{
          height: "60vh",
          width: "80%",
          align: "center",
          marginLeft: "10%",
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAuc6rLw6Z8w8HwJx3MGiJ3Bt7nMpv8mIo" }}
          center={coordinates}
          defaultZoom={13}
          onClick={handleOnClick}
        >
          <Marker lat={coordinates.lat} lng={coordinates.lng} />
          {nearbyMarkers.map((x, i) => {
            return <NearbyMarker key={i} lat={x.lat} lng={x.lng} />;
          })}
        </GoogleMapReact>
        <ol>
          {nearbyMarkers.map((x) => {
            return <li>{x.name}</li>;
          })}
        </ol>
      </div>
    </div>
  );
}

export default App;
