import React from 'react';
import type { TemplateInfo, TemplateLayoutProps } from './types';
import { EditorialLuxeLayout, EditorialLuxeAltLayout } from './layouts/EditorialLuxe';
import { VisualStudioLayout, VisualStudioAltLayout } from './layouts/VisualStudio';
import { HomeServicesLayout, HomeServicesAltLayout } from './layouts/HomeServices';
import { ModernAppointmentsLayout, ModernAppointmentsAltLayout } from './layouts/ModernAppointments';
import { PersonalBrandLayout, PersonalBrandAltLayout } from './layouts/PersonalBrand';

import { NoirEditorialLayout } from './layouts/NoirEditorial';

// Template metadata for the switcher UI
export const TEMPLATES: (TemplateInfo & { component: React.FC<TemplateLayoutProps> })[] = [
  {
    key: 'noir_editorial',
    name: 'Noir Editorial',
    category: 'Premium',
    description: 'Cinematic, dark-themed beauty portfolio',
    color: '#0B0B0D',
    thumbnail: '/thumbnails/noir_editorial.png',
    component: NoirEditorialLayout,
  },
  {
    key: 'clean_classic',
    name: 'Editorial Luxe',
    category: 'Premium',
    description: 'Refined, minimal design for high-end brands',
    color: '#111111',
    thumbnail: '/thumbnails/clean_classic.png',
    component: EditorialLuxeLayout,
  },
  {
    key: 'clean_classic_alt',
    name: 'Luxe Trust-First',
    category: 'Premium',
    description: 'Editorial style with reviews elevated',
    color: '#333333',
    thumbnail: '/thumbnails/clean_classic_alt.png',
    component: EditorialLuxeAltLayout,
  },
  {
    key: 'visual_studio',
    name: 'Visual Studio',
    category: 'Creative',
    description: 'Gallery-forward — ideal for beauty & creatives',
    color: '#ec4899',
    thumbnail: '/thumbnails/visual_studio.png',
    component: VisualStudioLayout,
  },
  {
    key: 'visual_studio_alt',
    name: 'Visual Filmstrip',
    category: 'Creative',
    description: 'Horizontal gallery with compact service cards',
    color: '#f472b6',
    thumbnail: '/thumbnails/visual_studio_alt.png',
    component: VisualStudioAltLayout,
  },
  {
    key: 'home_services',
    name: 'Home Services Pro',
    category: 'Trust-First',
    description: 'Strong CTA with reviews up front',
    color: '#14b8a6',
    thumbnail: '/thumbnails/home_services.png',
    component: HomeServicesLayout,
  },
  {
    key: 'home_services_alt',
    name: 'Home Services Clean',
    category: 'Trust-First',
    description: 'Card hero with clean service listing',
    color: '#2dd4bf',
    thumbnail: '/thumbnails/home_services_alt.png',
    component: HomeServicesAltLayout,
  },
  {
    key: 'modern_appointments',
    name: 'Modern Appointments',
    category: 'Booking',
    description: 'Booking-forward with polished minimal feel',
    color: '#f59e0b',
    thumbnail: '/thumbnails/modern_appointments.png',
    component: ModernAppointmentsLayout,
  },
  {
    key: 'modern_appointments_alt',
    name: 'Appointments Plus',
    category: 'Booking',
    description: 'Card hero with horizontal scroll services',
    color: '#fbbf24',
    thumbnail: '/thumbnails/modern_appointments_alt.png',
    component: ModernAppointmentsAltLayout,
  },
  {
    key: 'personal_brand',
    name: 'Personal Brand',
    category: 'Personal',
    description: 'Founder-focused with prominent about section',
    color: '#8b5cf6',
    thumbnail: '/thumbnails/personal_brand.png',
    component: PersonalBrandLayout,
  },
  {
    key: 'personal_brand_alt',
    name: 'Personal Minimal',
    category: 'Personal',
    description: 'Ultra-clean with vertical testimonials',
    color: '#a78bfa',
    thumbnail: '/thumbnails/personal_brand_alt.png',
    component: PersonalBrandAltLayout,
  },
];

// Get a template component by key, fallback to editorial_luxe
export const getTemplateComponent = (key: string): React.FC<TemplateLayoutProps> => {
  const template = TEMPLATES.find(t => t.key === key);
  return template ? template.component : EditorialLuxeLayout;
};

// Get template metadata by key
export const getTemplateInfo = (key: string): TemplateInfo | undefined => {
  return TEMPLATES.find(t => t.key === key);
};
