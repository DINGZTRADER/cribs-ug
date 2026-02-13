import { UnlockPropertyResultDto } from "@repo/types";
import { requestJson } from "./http";

export function unlockProperty(propertyId: string): Promise<UnlockPropertyResultDto> {
  return requestJson<UnlockPropertyResultDto>({
    path: `/subscriptions/unlock/${propertyId}`,
    method: "GET",
    auth: true
  });
}
