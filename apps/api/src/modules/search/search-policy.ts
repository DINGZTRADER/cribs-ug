export function clampSearchRadius(requestedRadius: number, maxRadius: number): number {
  if (!Number.isFinite(requestedRadius) || requestedRadius <= 0) {
    return maxRadius;
  }
  return Math.min(requestedRadius, maxRadius);
}

export function maybeMaskContactPhone(
  canRevealLandlordPhone: boolean,
  phone: string | null
): string | null {
  return canRevealLandlordPhone ? phone : null;
}
