import test from 'node:test';
import assert from 'node:assert/strict';
import {initialLocale, persistLocale, isSupportedLocale} from '../../src/utils/locale.js';

test('only supported stored locales override the browser preference', () => {
  assert.equal(initialLocale('en-US',() => ({getItem:() => 'zh-CN'})),'zh-CN');
  for(const invalid of [null,'','fr-FR','__proto__','<script>']) {
    assert.equal(initialLocale('zh-HK',() => ({getItem:() => invalid})),'zh-CN');
    assert.equal(initialLocale('fr-FR',() => ({getItem:() => invalid})),'en-US');
  }
});

test('Spanish language variants select Spanish and saved preferences take priority', () => {
  const empty = () => ({getItem: () => null});
  for (const language of ['es', 'es-ES', 'es-MX', 'es-AR', 'ES-co']) {
    assert.equal(initialLocale(language, empty), 'es-ES');
  }
  assert.equal(initialLocale('es-MX', () => ({getItem: () => 'zh-CN'})), 'zh-CN');
  assert.equal(initialLocale('en-US', () => ({getItem: () => 'es-ES'})), 'es-ES');
  assert.equal(initialLocale('estonian', empty), 'en-US');
  assert.equal(isSupportedLocale('es-ES'), true);
  const denied = () => { throw new Error('Storage denied'); };
  assert.equal(initialLocale('es-MX', denied), 'es-ES');
  let written;
  persistLocale('es-ES', () => ({setItem: (key, value) => { written = [key, value]; }}));
  assert.deepEqual(written, ['locale', 'es-ES']);
});

test('blocked storage reads and writes do not block language selection', () => {
  const denied = () => { throw new Error('Storage denied'); };
  assert.equal(initialLocale('zh-TW',denied),'zh-CN');
  assert.doesNotThrow(() => persistLocale('zh-CN',denied));
  let written;
  persistLocale('zh-CN',() => ({setItem:(key,value) => { written = [key,value]; }}));
  assert.deepEqual(written,['locale','zh-CN']);
  written = null;
  persistLocale('fr-FR',() => ({setItem:() => { written = true; }}));
  assert.equal(written,null);
});
