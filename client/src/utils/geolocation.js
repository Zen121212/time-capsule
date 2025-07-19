export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
}

export async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const city =
      data.address.city || data.address.town || data.address.village || "";
    const country = data.address.country || "";

    return `${city}, ${country}`;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Unknown location";
  }
}
