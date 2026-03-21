export default function sitemap() {
  const baseUrl = 'https://wargaldii.com';
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/#marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/#elearning`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/#loker`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/#investasi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/#bmt`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/#hibah`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/#dashboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.5 },
    { url: `${baseUrl}/#profile`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];
}
