export const languages = {
  ro: { name: 'Română', flag: '🇷🇴' },
  en: { name: 'English', flag: '🇬🇧' },
} as const;

export const defaultLang = 'ro';

export type Lang = keyof typeof languages;
