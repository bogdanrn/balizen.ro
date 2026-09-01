import {
  IconArrowRight,
  IconArrowUpRight,
  IconBrandApple,
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandWaze,
  IconBrandWhatsapp,
  IconCalendar,
  IconCertificate,
  IconCheck,
  IconChevronDown,
  IconClock,
  IconGift,
  IconList,
  IconMail,
  IconMap,
  IconMapPin,
  IconMenu2,
  IconMessageStar,
  IconPhone,
  IconStar,
  IconStarFilled,
  IconX,
} from '@tabler/icons-react'

// The CMS stores Tabler icon names in kebab-case without the "tabler:" prefix
// (e.g. "calendar", "brand-whatsapp"). Unknown names render nothing.
const ICONS = {
  calendar: IconCalendar,
  'brand-whatsapp': IconBrandWhatsapp,
  'brand-instagram': IconBrandInstagram,
  'brand-facebook': IconBrandFacebook,
  'brand-tiktok': IconBrandTiktok,
  'brand-google': IconBrandGoogle,
  'brand-waze': IconBrandWaze,
  'brand-apple': IconBrandApple,
  phone: IconPhone,
  list: IconList,
  star: IconStar,
  'star-filled': IconStarFilled,
  certificate: IconCertificate,
  gift: IconGift,
  'map-pin': IconMapPin,
  map: IconMap,
  clock: IconClock,
  mail: IconMail,
  'message-star': IconMessageStar,
  'arrow-right': IconArrowRight,
  'arrow-up-right': IconArrowUpRight,
  check: IconCheck,
  'chevron-down': IconChevronDown,
  'menu-2': IconMenu2,
  x: IconX,
} as const

export type IconName = keyof typeof ICONS

export default function Icon({ name, className }: { name: string; className?: string }) {
  const Component = ICONS[name as IconName]
  if (!Component) return null
  return <Component className={className} aria-hidden="true" />
}
