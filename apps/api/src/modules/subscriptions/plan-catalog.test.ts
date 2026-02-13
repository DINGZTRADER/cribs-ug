import test from "node:test";
import assert from "node:assert/strict";
import { canTierUnlockRent, requiredTierForRent } from "./plan-catalog";

test("maps rent to required tier correctly", () => {
  assert.equal(requiredTierForRent(300000), "budget");
  assert.equal(requiredTierForRent(900000), "family");
  assert.equal(requiredTierForRent(1500000), "premium");
});

test("enforces rent lock by tier", () => {
  assert.equal(canTierUnlockRent("free", 200000), false);
  assert.equal(canTierUnlockRent("budget", 400000), true);
  assert.equal(canTierUnlockRent("budget", 900000), false);
  assert.equal(canTierUnlockRent("family", 900000), true);
  assert.equal(canTierUnlockRent("family", 2000000), false);
  assert.equal(canTierUnlockRent("premium", 2000000), true);
});
