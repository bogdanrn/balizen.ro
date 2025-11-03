import rawHomepage from '../data/homepage.json';
import rawReviews from '../data/reviews.json';
import rawServices from '../data/services.json';
import rawSite from '../data/site.json';

import type { HomepageConfig, Review, ServiceItem, ServicesCatalog, SiteConfig } from '../types';

export const siteConfig = rawSite as SiteConfig;
export const homepageConfig = rawHomepage as HomepageConfig;
export const servicesCatalog = rawServices as ServicesCatalog;
export const reviews = rawReviews as Review[];

export function getSortedServiceCategories(): Array<{ name: string; services: ServiceItem[] }> {
  return Object.entries(servicesCatalog)
    .map(([name, services]) => ({
      name,
      services: [...services].sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
