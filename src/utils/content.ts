import rawHomepage from '../data/homepage.json';
import rawReviews from '../data/reviews.json';
import rawServices from '../data/services.json';
import rawSite from '../data/site.json';

import enHomepage from '../data/en/homepage.json';
import enSite from '../data/en/site.json';
import enServices from '../data/en/services.json';

import type { HomepageConfig, Review, ServiceItem, ServicesCatalog, SiteConfig } from '../types';
import type { Lang } from '../i18n/ui';

// Romanian is the default
export const siteConfig = rawSite as SiteConfig;
export const homepageConfig = rawHomepage as HomepageConfig;
export const servicesCatalog = rawServices as ServicesCatalog;
export const reviews = rawReviews as Review[];

// English translations
const enSiteConfig = enSite as SiteConfig;
const enHomepageConfig = enHomepage as HomepageConfig;
const enServicesCatalog = enServices as ServicesCatalog;

export function getSiteConfig(lang: Lang = 'ro'): SiteConfig {
  return lang === 'en' ? enSiteConfig : siteConfig;
}

export function getHomepageConfig(lang: Lang = 'ro'): HomepageConfig {
  return lang === 'en' ? enHomepageConfig : homepageConfig;
}

export function getServicesCatalog(lang: Lang = 'ro'): ServicesCatalog {
  return lang === 'en' ? enServicesCatalog : servicesCatalog;
}

export function getReviews(_lang: Lang = 'ro'): Review[] {
  return reviews;
}

export function getSortedServiceCategories(lang: Lang = 'ro'): Array<{ name: string; services: ServiceItem[] }> {
  const catalog = getServicesCatalog(lang);
  return Object.entries(catalog)
    .map(([name, services]) => ({
      name,
      services: [...services].sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
