import { getVehiclesAsync } from '../lib/db-helper';

export default async function sitemap() {
  const baseUrl = 'https://www.automaestrocars.com';
  let vehicles = [];
  try {
    vehicles = await getVehiclesAsync();
  } catch (e) {
    vehicles = [];
  }

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/legal-terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const vehicleRoutes = (vehicles || []).map((car) => ({
    url: `${baseUrl}/vehicles/${car.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
