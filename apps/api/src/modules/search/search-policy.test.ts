import test from "node:test";
import assert from "node:assert/strict";
import { clampSearchRadius, maybeMaskContactPhone } from "./search-policy";

test("caps requested radius at plan maximum", () => {
  assert.equal(clampSearchRadius(10000, 3000), 3000);
  assert.equal(clampSearchRadius(2500, 3000), 2500);
});

test("uses plan max for invalid radius", () => {
  assert.equal(clampSearchRadius(-1, 3000), 3000);
  assert.equal(clampSearchRadius(Number.NaN, 3000), 3000);
});

test("masks landlord phone for locked contacts", () => {
  assert.equal(maybeMaskContactPhone(false, "+256700000001"), null);
  assert.equal(maybeMaskContactPhone(true, "+256700000001"), "+256700000001");
});
