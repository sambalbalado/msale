import { LanguageCode } from '@/types/domain';

const localeMap: Record<LanguageCode, string> = { en: 'en-MY', ms: 'ms-MY', zh: 'zh-MY' };

export function formatPrice(value: number, language: LanguageCode = 'en') {
  return new Intl.NumberFormat(localeMap[language], {
    style: 'currency', currency: 'MYR', maximumFractionDigits: 0,
  }).format(value);
}

export function formatRelativeDate(value: string, language: LanguageCode = 'en') {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const absolute = Math.abs(seconds);
  const unit = absolute < 3600 ? 'minute' : absolute < 86400 ? 'hour' : absolute < 604800 ? 'day' : 'week';
  const divisor = unit === 'minute' ? 60 : unit === 'hour' ? 3600 : unit === 'day' ? 86400 : 604800;
  const amount = Math.round(seconds / divisor);

  // RelativeTimeFormat is not present in every Hermes/iOS runtime. Prefer the
  // native formatter when available, but keep chat and listings usable without it.
  if (typeof Intl.RelativeTimeFormat === 'function') {
    try {
      return new Intl.RelativeTimeFormat(localeMap[language], { numeric: 'auto' }).format(amount, unit);
    } catch {
      // Fall through to the small localized formatter below.
    }
  }

  return formatRelativeDateFallback(amount, unit, language);
}

type RelativeUnit = 'minute' | 'hour' | 'day' | 'week';

function formatRelativeDateFallback(amount: number, unit: RelativeUnit, language: LanguageCode) {
  if (amount === 0) {
    return language === 'ms' ? 'baru sahaja' : language === 'zh' ? '刚刚' : 'just now';
  }

  const value = Math.abs(amount);
  const future = amount > 0;

  if (language === 'zh') {
    if (unit === 'day' && value === 1) return future ? '明天' : '昨天';
    const labels: Record<RelativeUnit, string> = { minute: '分钟', hour: '小时', day: '天', week: '周' };
    return future ? `${value}${labels[unit]}后` : `${value}${labels[unit]}前`;
  }

  if (language === 'ms') {
    if (unit === 'day' && value === 1) return future ? 'esok' : 'semalam';
    const labels: Record<RelativeUnit, string> = { minute: 'minit', hour: 'jam', day: 'hari', week: 'minggu' };
    return future ? `dalam ${value} ${labels[unit]}` : `${value} ${labels[unit]} lalu`;
  }

  if (unit === 'day' && value === 1) return future ? 'tomorrow' : 'yesterday';
  const label = value === 1 ? unit : `${unit}s`;
  return future ? `in ${value} ${label}` : `${value} ${label} ago`;
}
