import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "./password-hash";

test("hashPassword and verifyPassword roundtrip", () => {
  const password = "StrongPass123!";
  const hash = hashPassword(password);
  assert.equal(verifyPassword(password, hash), true);
  assert.equal(verifyPassword("wrong-password", hash), false);
});
