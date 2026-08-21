export default function manifest() {
  return {
    name: 'AUTO MAESTRO LLC - Prestige & Sport Vehicles',
    short_name: 'Auto Maestro',
    description: 'Certified Prestige, Sport, and Luxury Vehicles Dealership.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0f19',
    theme_color: '#0b0f19',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
