import React from 'react';
import type { TemplateInfo, TemplateLayoutProps } from './types';
import { CleanClassicLayout, CleanClassicAltLayout } from './layouts/CleanClassic';
import { VisualStudioLayout, VisualStudioAltLayout } from './layouts/VisualStudio';
import { HomeServicesLayout, HomeServicesAltLayout } from './layouts/HomeServices';
import { ModernAppointmentsLayout, ModernAppointmentsAltLayout } from './layouts/ModernAppointments';
import { PersonalBrandLayout, PersonalBrandAltLayout } from './layouts/PersonalBrand';

// Template metadata for the switcher UI
export const TEMPLATES: (TemplateInfo & { component: React.FC<TemplateLayoutProps> })[] = [
  {
    key: 'clean_classic',
    name: 'Clean Classic',
    category: 'Minimal',
    description: 'Elegant and text-first — perfect for consultants',
    color: '#6366f1',
    component: CleanClassicLayout,
  },
  {
    key: 'clean_classic_alt',
    name: 'Classic Split',
    category: 'Minimal',
    description: 'Split hero with vertical services list',
    color: '#818cf8',
    component: CleanClassicAltLayout,
  },
  {
    key: 'visual_studio',
    name: 'Visual Studio',
    category: 'Creative',
    description: 'Gallery-forward — ideal for beauty & creatives',
    color: '#ec4899',
    component: VisualStudioLayout,
  },
  {
    key: 'visual_studio_alt',
    name: 'Visual Filmstrip',
    category: 'Creative',
    description: 'Horizontal gallery with compact service cards',
    color: '#f472b6',
    component: VisualStudioAltLayout,
  },
  {
    key: 'home_services',
    name: 'Home Services Pro',
    category: 'Trust-First',
    description: 'Strong CTA with reviews up front',
    color: '#14b8a6',
    component: HomeServicesLayout,
  },
  {
    key: 'home_services_alt',
    name: 'Home Services Clean',
    category: 'Trust-First',
    description: 'Card hero with clean service listing',
    color: '#2dd4bf',
    component: HomeServicesAltLayout,
  },
  {
    key: 'modern_appointments',
    name: 'Modern Appointments',
    category: 'Booking',
    description: 'Booking-forward with polished minimal feel',
    color: '#f59e0b',
    component: ModernAppointmentsLayout,
  },
  {
    key: 'modern_appointments_alt',
    name: 'Appointments Plus',
    category: 'Booking',
    description: 'Card hero with horizontal scroll services',
    color: '#fbbf24',
    component: ModernAppointmentsAltLayout,
  },
  {
    key: 'personal_brand',
    name: 'Personal Brand',
    category: 'Personal',
    description: 'Founder-focused with prominent about section',
    color: '#8b5cf6',
    component: PersonalBrandLayout,
  },
  {
    key: 'personal_brand_alt',
    name: 'Personal Minimal',
    category: 'Personal',
    description: 'Ultra-clean with vertical testimonials',
    color: '#a78bfa',
    component: PersonalBrandAltLayout,
  },
];

// Get a template component by key, fallback to clean_classic
export const getTemplateComponent = (key: string): React.FC<TemplateLayoutProps> => {
  const template = TEMPLATES.find(t => t.key === key);
  return template ? template.component : CleanClassicLayout;
};

// Get template metadata by key
export const getTemplateInfo = (key: string): TemplateInfo | undefined => {
  return TEMPLATES.find(t => t.key === key);
};
