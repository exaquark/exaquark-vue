
export function getFinalLatLon (lat1, lon1, distance, angle) {
  let deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }
  // dy = R*sin(theta)
  let dy = distance * Math.sin(deg2rad(angle))
  let deltaLatitude = dy / 110574
  // One degree of latitude on the Earth's surface equals (110574 meters
  deltaLatitude = parseFloat(deltaLatitude.toFixed(6))

  // final latitude = start_latitude + delta_latitude
  let lat2 = lat1 + deltaLatitude

  // dx = R*cos(theta)
  let dx = distance * Math.cos(deg2rad(angle))
  // One degree of longitude equals 111321 meters (at the equator)
  let deltaLongitude = dx / (111321 * Math.cos(deg2rad(lat1)))
  deltaLongitude = parseFloat(deltaLongitude.toFixed(6))

  // final longitude = start_longitude + deltaLongitude
  let lon2 = lon1 + deltaLongitude

  return [lat2, lon2]
}
