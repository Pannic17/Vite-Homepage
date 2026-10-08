export const supportedLocales = ['en-US', 'zh-CN', 'es-ES'];
export const isSupportedLocale = value => supportedLocales.includes(value);

export function initialLocale(browserLanguage, getStorage) {
  try {
    const saved = getStorage().getItem('locale');
    if (isSupportedLocale(saved)) return saved;
  } catch { /* Privacy settings can reject even reading localStorage. */ }
  if (/^zh(?:-|$)/i.test(browserLanguage || '')) return 'zh-CN';
  return /^es(?:-|$)/i.test(browserLanguage || '') ? 'es-ES' : 'en-US';
}

export function persistLocale(locale, getStorage) {
  if (!isSupportedLocale(locale)) return;
  try { getStorage().setItem('locale', locale); } catch { /* Keep the in-memory selection usable. */ }
}
