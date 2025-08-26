'use client';

import React from 'react';

interface StructuredDataProps {
  type: 'person' | 'website' | 'organization';
}

const StructuredData: React.FC<StructuredDataProps> = ({ type }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'person':
        return {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Muhammed Basil',
          alternateName: 'Basil',
          jobTitle: 'AI & ML Developer',
          description: 'Computer Science student specializing in AI, ML, and web development',
          url: 'https://basil-portfolio.vercel.app',
          sameAs: [
            'https://github.com/basilcp909',
            'https://www.linkedin.com/in/muhammed-basil-cp-cse007',
          ],
          knowsAbout: [
            'Artificial Intelligence',
            'Machine Learning',
            'Natural Language Processing',
            'Computer Vision',
            'Web Development',
            'React',
            'Next.js',
            'Python',
            'Deep Learning',
            'Data Science',
          ],
          hasOccupation: {
            '@type': 'Occupation',
            name: 'Software Developer',
            description: 'AI/ML Developer with expertise in building intelligent systems',
          },
          worksFor: {
            '@type': 'Organization',
            name: 'Freelance',
            description: 'Independent AI/ML Developer',
          },
          alumniOf: {
            '@type': 'EducationalOrganization',
            name: 'Computer Science Program',
            description: 'Computer Science Student',
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Kerala',
            addressCountry: 'India',
          },
          email: 'basilcp090@gmail.com',
          telephone: '+91-XXXXXXXXXX',
          image: 'https://basil-portfolio.vercel.app/profile-image.jpg',
          birthDate: '2000-01-01', // Update with actual date
          nationality: 'Indian',
          gender: 'Male',
        };

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Muhammed Basil Portfolio',
          description: 'AI & ML Developer Portfolio showcasing projects in machine learning, web development, and intelligent systems',
          url: 'https://basil-portfolio.vercel.app',
          author: {
            '@type': 'Person',
            name: 'Muhammed Basil',
          },
          publisher: {
            '@type': 'Person',
            name: 'Muhammed Basil',
          },
          inLanguage: 'en-US',
          isAccessibleForFree: true,
          dateCreated: '2024-01-01', // Update with actual date
          dateModified: new Date().toISOString().split('T')[0],
          mainEntity: {
            '@type': 'Person',
            name: 'Muhammed Basil',
            jobTitle: 'AI & ML Developer',
            description: 'Computer Science student specializing in AI, ML, and web development',
          },
        };

      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Muhammed Basil Development',
          description: 'AI & ML Development Services',
          url: 'https://basil-portfolio.vercel.app',
          logo: 'https://basil-portfolio.vercel.app/logo.png',
          founder: {
            '@type': 'Person',
            name: 'Muhammed Basil',
          },
          employee: {
            '@type': 'Person',
            name: 'Muhammed Basil',
            jobTitle: 'AI & ML Developer',
          },
          serviceArea: {
            '@type': 'GeoCircle',
            geoMidpoint: {
              '@type': 'GeoCoordinates',
              latitude: 10.8505, // Kerala coordinates
              longitude: 76.2711,
            },
            geoRadius: '50000',
          },
          areaServed: 'Worldwide',
          serviceType: [
            'AI Development',
            'Machine Learning',
            'Web Development',
            'Data Science',
            'NLP Solutions',
          ],
        };

      default:
        return {};
    }
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
};

export default StructuredData;
