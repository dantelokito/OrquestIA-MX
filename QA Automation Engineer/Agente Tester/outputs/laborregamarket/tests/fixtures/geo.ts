export const MONTERREY_PIN = {
  lat: 25.6714,
  lng: -100.3089,
};

/** Default centro F7 (San Nicolás de los Garza) — ADR-026 */
export const SAN_NICOLAS_PIN = {
  lat: 25.7475,
  lng: -100.283,
};

/** Valid bbox corner likely far from seed providers (empty radio). */
export const MONTERREY_FAR_PIN = {
  lat: 25.85,
  lng: -100.55,
};

export const CDMX_PIN = {
  lat: 19.4326,
  lng: -99.1332,
};

/** Fuera de MEXICO_BOUNDS (ADR-028). No usar Laredo: el rectángulo puede incluirlo. */
export const OUTSIDE_MEXICO_PIN = {
  lat: 33.0,
  lng: -99.0,
};

export function addressPayload(
  label = "Casa QA",
  pin = MONTERREY_PIN
) {
  return {
    label,
    formattedAddress: `${label}, Centro, Monterrey`,
    lat: pin.lat,
    lng: pin.lng,
    isFavorite: true,
    isDefault: false,
  };
}
