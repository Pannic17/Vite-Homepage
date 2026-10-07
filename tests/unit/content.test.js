import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {createI18n} from 'vue-i18n';
import {portfolio, works, projects, kaiwu, detailEntries} from '../../src/content/portfolio.js';
import {profile} from '../../src/content/profile.js';
import {productionPaths} from '../../src/routePaths.js';
import en from '../../src/lang/en.js';
import cn from '../../src/lang/cn.js';

const resolveKey = (messages,key) => key.split('.').reduce((value,part) => value?.[part],messages);
const flatten = (object,prefix='') => Object.entries(object).flatMap(([key,value]) => typeof value === 'object' ? flatten(value,prefix + key + '.') : [prefix + key]);

test('catalog IDs, navigation, local assets and translations form a valid content contract', () => {
  assert.equal(works.length,9);
  assert.equal(projects.length,6);
  assert.equal(new Set(portfolio.map(entry => entry.id)).size,portfolio.length);
  assert.equal(new Set(productionPaths).size,productionPaths.length);
  for(const entry of portfolio) {
    assert.match(entry.id,/^[a-z0-9-]+$/);
    assert.ok(existsSync('public/' + entry.cover),entry.cover);
    for(const key of [entry.titleKey,entry.introKey,entry.categoryKey,entry.dateKey,...entry.tags.filter(tag => typeof tag === 'object').map(tag => tag.key)].filter(Boolean)) {
      for(const messages of [en,cn]) assert.equal(typeof resolveKey(messages,key),'string',key);
    }
    const destination=entry.destination;
    assert.ok(['internal','external','none'].includes(destination.kind));
    if(destination.kind === 'internal') assert.ok(productionPaths.includes(destination.to));
    if(destination.kind === 'external') assert.match(destination.href,/^https:\/\//);
    if(destination.kind === 'none') assert.deepEqual(Object.keys(destination),['kind']);
    if(entry.detail) {
      assert.ok(productionPaths.includes(entry.detail.parent));
      assert.equal(destination.kind,'internal');
      assert.equal(destination.to,entry.detail.path);
      for(const key of entry.detail.paragraphKeys) for(const messages of [en,cn]) assert.equal(typeof resolveKey(messages,key),'string');
      for(const key of [entry.detail.heroKey, entry.detail.sectionTitleKey, ...entry.detail.headingKeys || [], ...entry.detail.links?.map(link => link.labelKey) || []].filter(Boolean)) {
        for(const messages of [en,cn]) assert.equal(typeof resolveKey(messages,key),'string',key);
      }
      for(const link of entry.detail.links || []) assert.match(link.href,/^https:\/\//);
    }
  }
  assert.equal(detailEntries.find(entry => entry.id === 'chronoscape').detail.path,'/works/gcs');
  assert.deepEqual(flatten(en).sort(),flatten(cn).sort(),'Both languages must expose the same keys');
  for(const poster of kaiwu.posters) assert.ok(existsSync('public/' + poster.src));
});

test('baseline external destinations survive except the retired Kaiwu domain', () => {
  const actual = new Set([
    ...portfolio.filter(entry => entry.destination.kind === 'external').map(entry => entry.destination.href),
    ...profile.contacts.map(contact => contact.href),
  ]);
  const baseline = JSON.parse(readFileSync('docs/Phase1/baseline/2026-09-18/external-links.json','utf8'));
  for(const {url} of baseline) {
    if(new URL(url).hostname==='kaiwuart.cn')continue;
    assert.ok(actual.has(url),'Missing destination: ' + url);
  }
  for(const entry of [kaiwu,profile.company,...kaiwu.links]) {
    assert.ok(['internal','none'].includes(entry.destination.kind));
    if(entry.destination.kind==='internal')assert.ok(productionPaths.includes(entry.destination.to));
  }
  assert.equal(kaiwu.links.filter(link=>link.destination.kind==='internal').length,0);
  assert.ok(actual.has('mailto:pannic1984@outlook.com'));
});

test('missing Chinese copy falls back to English rather than showing a translation key', () => {
  const partial = structuredClone(cn);
  delete partial.intro.GCS;
  const i18n=createI18n({legacy:false,locale:'zh-CN',fallbackLocale:'en-US',missingWarn:false,fallbackWarn:false,messages:{'en-US':en,'zh-CN':partial}});
  assert.equal(i18n.global.t('intro.GCS'),en.intro.GCS);
  i18n.dispose();
});
