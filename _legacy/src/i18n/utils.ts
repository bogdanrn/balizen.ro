import { languages, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function useTranslations(_lang: Lang) {
  return function t(key: string) {
    // For now, return the key - we'll add actual translations later
    return key;
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  if (lang === defaultLang) {
    return path;
  }
  return `/${lang}${path}`;
}

export function getAlternateLocalePaths(currentPath: string, currentLang: Lang): Record<Lang, string> {
  const paths: Record<Lang, string> = {} as Record<Lang, string>;

  // Remove current locale prefix if present and trailing slash
  let basePath = currentPath.replace(/\/$/, ''); // Remove trailing slash
  if (currentLang !== defaultLang && basePath.startsWith(`/${currentLang}`)) {
    basePath = basePath.slice(`/${currentLang}`.length) || '/';
  } else if (currentLang === defaultLang && basePath.startsWith('/en')) {
    basePath = basePath.slice('/en'.length) || '/';
  }

  // Ensure basePath starts with /
  if (!basePath.startsWith('/')) {
    basePath = '/' + basePath;
  }

  // Normalize path (remove trailing slash for consistency)
  basePath = basePath.replace(/\/$/, '') || '/';

  // Generate paths for each locale
  for (const lang of Object.keys(languages) as Lang[]) {
    if (lang === defaultLang) {
      paths[lang] = basePath;
    } else {
      paths[lang] = `/${lang}${basePath === '/' ? '' : basePath}`;
    }
  }

  return paths;
}
