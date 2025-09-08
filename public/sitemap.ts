import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.whatsscope.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Yeni sayfalar ekledikçe buraya ekleyebilirsin
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.7,
    // },
  ]
}