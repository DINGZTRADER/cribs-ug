import { SearchResponseDto } from "@repo/types";
import { requestJson } from "./http";

export interface NearbySearchResponse {
  radiusUsedMeters: number;
  items: SearchResponseDto[];
}

export async function fetchNearbyProperties(options: {
  lat: number;
  lng: number;
  radius: number;
}): Promise<NearbySearchResponse> {
  const params = new URLSearchParams({
    lat: String(options.lat),
    lng: String(options.lng),
    radius: String(options.radius)
  });

  return requestJson<NearbySearchResponse>({
    path: `/search/nearby?${params.toString()}`,
    method: "GET",
    auth: true
  });
}
