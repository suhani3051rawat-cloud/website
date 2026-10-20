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
        ? savedAddresses.find((item) => item._id === selectedAddress._id)
        : null;

    useEffect(() => {
        if (loading || activeAddress || currentLocation) return;

        if (!navigator.geolocation) {
            setCurrentLocation("Unable to get location");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
                    );
                    const data = await response.json();
                    setCurrentLocation(data.display_name);
                } catch (error) {
                    setCurrentLocation("Unable to get location");
                }
            },
            () => setCurrentLocation("Unable to get location")
        );
    }, [loading, activeAddress, currentLocation]);

    if (activeAddress) {
        return <p>{`${activeAddress.addr1}, ${activeAddress.addr2}`}</p>;
    }

    return <p className="current-address">{currentLocation || "Getting location..."}</p>;
}

export default Location;