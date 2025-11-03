export interface Action {
  label: string;
  href: string;
  variant?: string;
  icon?: string;
  class?: string;
  target?: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  class?: string;
}

export interface NavLink {
  label: string;
  href: string;
  class?: string;
  target?: string;
  rel?: string;
}

export interface FooterLink {
  text: string;
  href?: string;
  class?: string;
  target?: string;
  rel?: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SecondaryFooterLink {
  href: string;
  target?: string;
  rel?: string;
  image: ImageAsset;
}

export interface SocialLink {
  label: string;
  icon: string;
  href: string;
}

export interface BrandInfo {
  name: string;
  tagline: string;
  legalName: string;
  description: string;
  copyright: string;
}

export interface ContactInfo {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: string;
  schedule: string;
  bookingUrl: string;
  mapsUrl: string;
  googleReviewsUrl: string;
}

export interface HeaderConfig {
  fullWidth: boolean;
  position: 'center' | 'start' | 'end';
  links: NavLink[];
  primaryAction?: Action;
}

export interface FooterConfig {
  locations?: LocationInfo[];
  columns: FooterColumn[];
  secondaryLinks: SecondaryFooterLink[];
  socialLinks: SocialLink[];
  footnote: string;
}

export interface SiteConfig {
  brand: BrandInfo;
  contact: ContactInfo;
  header: HeaderConfig;
  footer: FooterConfig;
}

export interface HeroConfig {
  title: string;
  subtitle: string[];
  heroText?: string;
  primaryActions: Action[];
  secondaryActions?: Action[];
  image: ImageAsset;
}

export interface AboutBullet {
  title: string;
  description: string;
}

export interface AboutSection {
  id: string;
  tagline: string;
  title: string;
  intro: string;
  bullets: AboutBullet[];
  cta: Action;
  image: ImageAsset;
}

export interface ServicesSection {
  id: string;
  title: string;
  description: string;
  cta: Action;
}

export interface SubscriptionHighlight {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
  image: ImageAsset;
}

export interface GiftCardFeature {
  icon: string;
  title: string;
  description: string;
}

export interface GiftCardSection {
  id: string;
  title: string;
  description: string[];
  features: GiftCardFeature[];
  cta: Action;
  image: ImageAsset;
}

export interface SimpleCallToAction {
  id: string;
  title: string;
  subtitle: string;
  cta: Action;
}

export interface LocationDetail {
  icon: string;
  title: string;
  description: string;
  href?: string;
}

export interface LocationInfo {
  name: string;
  address: string;
  phone: string;
  phoneHref: string;
  schedule: string;
  mapsUrl: string;
}

export interface LocationSection {
  id: string;
  title: string;
  locations?: LocationInfo[];
  email?: string;
  emailHref?: string;
  details?: LocationDetail[];
}

export interface HomepageConfig {
  hero: HeroConfig;
  about: AboutSection;
  services: ServicesSection;
  subscriptions: SubscriptionHighlight[];
  subscriptionAction: Action;
  giftCard: GiftCardSection;
  callToAction: SimpleCallToAction;
  location: LocationSection;
}

export interface PricingInfo {
  price: string;
  duration: number;
}

export type ServiceImage = ImageAsset;

export interface ServiceItem {
  order: number;
  title: string;
  description: string;
  pricing: PricingInfo[];
  image?: ServiceImage;
  isNew?: boolean;
}

export type ServicesCatalog = Record<string, ServiceItem[]>;

export interface Review {
  author: string;
  text: string;
  rating: number;
  date: string;
}
