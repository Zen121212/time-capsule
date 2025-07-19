export async function getPublicIp() {
  try {
    const res = await fetch("https://api64.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (error) {
    console.error("IP fetch error:", error);
    return null;
  }
}
