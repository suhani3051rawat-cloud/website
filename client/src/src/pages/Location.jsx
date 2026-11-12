
import React, { useEffect, useState } from "react";
import { useAuth } from "../pages/AuthContext.jsx";
import { useAddress } from "../pages/AddressContext.jsx";

function Location() {
  const { user, loading } = useAuth();
  const { selectedAddress } = useAddress();

  const [currentLocation, setCurrentLocation] = useState("");

  const savedAddresses = (user?.Address || [])
    .filter(Boolean)
    .flatMap((item) => item.address || [])
    .filter((item) => item && !item.isDelete);

  const activeAddress = selectedAddress
    ? savedAddresses.find(
        (item) => item._id === selectedAddress._id
      )
    : null;

  const addressText = activeAddress
    ? [activeAddress.addr1, activeAddress.addr2]
        .filter(Boolean)
        .join(", ")
    : currentLocation;

  useEffect(() => {
    if (loading || activeAddress || currentLocation) return;

    if (!navigator.geolocation) {
      setCurrentLocation("Location unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );

          if (!response.ok) {
            throw new Error("Location request failed");
          }

          const data = await response.json();

          setCurrentLocation(
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.city ||
            data.display_name ||
            "Location unavailable"
          );
        } catch (error) {
          setCurrentLocation("Location unavailable");
        }
      },
      () => setCurrentLocation("Location unavailable"),
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, [loading, activeAddress, currentLocation]);

  return (
    <p
      className="location-text"
      title={addressText || "Getting location..."}
    >
      {addressText || "Getting location..."}
    </p>
  );
}

export default Location;
