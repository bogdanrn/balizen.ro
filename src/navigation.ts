import { getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  fullWidth: true,
  position: 'center',

  links: [
    { text: 'SERVICII', href: '/#servicii' },
    { text: 'PROGRAM', href: '/#locatie' },
    { text: 'ABONAMENTE', href: '/#abonamente' },
    { text: 'CONTACT', href: '/#programare' },
    { text: 'LOCATIE', href: '/#locatie' },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Legal',
      links: [
        { text: 'Termeni si conditii', href: getPermalink('/terms-policy') },
        { text: 'Politica de confidentialitate', href: getPermalink('/privacy-policy') },
        { text: 'Politica de returnare', href: getPermalink('/return-policy') },
        { text: 'Politica de anulare', href: getPermalink('/cancellation-policy') },
      ],
    },
    {
      title: 'Contact',
      links: [
        { text: 'Email: contact@balizen.ro', href: 'mailto:contact@balizen.ro' },
        { text: 'Telefon: 0733-211-325', href: 'tel:+40733211325' },
        {
          text: 'Whatsapp: 0733-211-325',
          href: 'https://wa.me/40733211325',
        },
      ],
    },
    {
      title: 'Locatie',
      links: [
        {
          text: 'Program Luni-Duminica <br>10:00 - 21:00',
        },
        {
          text: 'Strada Gheorghe Grigore Cantacuzino nr 190, Ploiesti',
          href: 'https://maps.app.goo.gl/mLPy3SwVjH5j6E5t7',
        },
      ],
    },
  ],
  secondaryLinks: [
    {
      href: 'https://anpc.ro/ce-este-sal/',
      target: '_blank',
      rel: 'nofollow',
      text: `<img src="${getAsset('/images/anpc-sal.png')}" alt="Solutionarea Alternativa a Litigiilor" style="width: 250px;">`,
    },
    {
      href: 'https://ec.europa.eu/consumers/odr',
      target: '_blank',
      rel: 'nofollow',
      text: `<img src="${getAsset('images/anpc-sol.png')}" alt="Solutionarea Online a Litigiilor" style="width: 250px;">`,
    },
  ],
  socialLinks: [
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/balizen.ploiesti' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/balizen.ro' },
    { ariaLabel: 'Whatsapp', icon: 'tabler:brand-whatsapp', href: 'https://wa.me/40733211325' },
  ],
  footNote: `
    © Bali Zen SRL 2024. Toate drepturile rezervate.
  `,
};
