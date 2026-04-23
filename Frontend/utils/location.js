export const getCurrentLocationLabel = async () => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported in this browser.");
  }

  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
    });
  });

  const { latitude, longitude } = position.coords;
  const coordsLabel = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: { Accept: "application/json" },
      },
    );
    if (!response.ok) return coordsLabel;
    const data = await response.json();
    return data?.display_name || coordsLabel;
  } catch (_err) {
    return coordsLabel;
  }
};
