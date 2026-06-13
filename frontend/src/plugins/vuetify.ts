import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Colors mirror the CSS tokens in styles/global.scss so Vuetify-rendered
// surfaces (cards, dialogs, dividers, selects) stay consistent with the data table cards.
const siloamLight = {
  dark: false,
  colors: {
    background: '#FAFAFA', // zinc-50 — matches the app shell behind the cards
    surface: '#FFFFFF',
    'surface-subtle': '#F4F4F5', // zinc-100 (= --muted)

    primary: '#16A34A',
    'primary-darken-1': '#15803D',
    secondary: '#0F766E',

    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',

    'on-background': '#18181B', // zinc-900 (= --fg)
    'on-surface': '#18181B',
  },
  variables: {
    'border-color': '#E4E4E7', // zinc-200 (= --border) — one line color everywhere
    'border-opacity': 1,
    'theme-text-secondary': '#52525B', // zinc-600 (= --fg-secondary)
    'theme-text-muted': '#71717A', // zinc-500 (= --fg-muted)
  },
};

export default createVuetify({
  theme: {
    defaultTheme: 'siloamLight',
    themes: { siloamLight },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none; font-weight: 600; letter-spacing: 0;',
      rounded: 'lg',
    },
    VTextField: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
    VSelect: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
    VCard: { elevation: 0, rounded: 'lg' },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
});
