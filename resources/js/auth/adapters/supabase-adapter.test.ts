import assert from 'node:assert/strict';
import test from 'node:test';

import { shouldUseDemoAuth } from './supabase-adapter.ts';

test('uses demo auth for the built-in sign-in credentials', () => {
  assert.equal(shouldUseDemoAuth('demo@kt.com', 'demo123'), true);
});

test('does not use demo auth for unrelated credentials', () => {
  assert.equal(shouldUseDemoAuth('someone@example.com', 'wrong-password'), false);
});
