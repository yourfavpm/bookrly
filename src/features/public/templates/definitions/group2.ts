// All 45 template definitions — Professional, Creative, Events
import type { TemplateDefinition } from '../types';

export const PROFESSIONAL_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'professional_authority_counsel', name: 'Authority Counsel', category: 'professional', theme: 'darkAuthority',
    description: 'Classic authority for lawyers and advisors',
    conversionStrategy: 'Authority → evidence → consult',
    color: '#D4A853',
    sectionOrder: ['hero','about','services','case_studies','reviews','pricing','contact','footer'],
    layouts: { hero:'overlay', about:'split', services:'minimalList', case_studies:'cardGrid', reviews:'editorial', pricing:'pricingCards', contact:'split', footer:'standard' },
  },
  {
    id: 'professional_modern_consultant', name: 'Modern Consultant', category: 'professional', theme: 'modernBold',
    description: 'SaaS-inspired consultant landing',
    conversionStrategy: 'Problem → methodology → book call',
    color: '#6B21A8',
    sectionOrder: ['hero','services','about','case_studies','testimonials','faq','contact','footer'],
    layouts: { hero:'centered', services:'cardGrid', about:'centered', case_studies:'cardGrid', testimonials:'carousel', faq:'accordion', contact:'centered', footer:'minimal' },
  },
  {
    id: 'professional_personal_expert', name: 'Personal Expert', category: 'professional', theme: 'editorialMinimal',
    description: 'Personal brand for solo consultants',
    conversionStrategy: 'Personal credibility → work with me',
    color: '#1A1A1A',
    sectionOrder: ['hero','about','credentials','services','testimonials','case_studies','contact','footer'],
    layouts: { hero:'split', about:'editorial', credentials:'minimalList', services:'pricingCards', testimonials:'grid', case_studies:'minimalList', contact:'centered', footer:'minimal' },
  },
  {
    id: 'professional_firm_corporate', name: 'Firm Corporate', category: 'professional', theme: 'clinicalClean',
    description: 'Multi-partner firm presence',
    conversionStrategy: 'Institutional trust → inquire',
    color: '#0284C7',
    sectionOrder: ['hero','services','team','about','case_studies','reviews','contact','footer'],
    layouts: { hero:'overlay', services:'cardGrid', team:'cardGrid', about:'centered', case_studies:'minimalList', reviews:'minimal', contact:'split', footer:'standard' },
  },
  {
    id: 'professional_creative_advisor', name: 'Creative Advisor', category: 'professional', theme: 'editorialMinimal',
    description: 'Design-forward creative professional',
    conversionStrategy: 'Design quality → contact',
    color: '#1A1A1A',
    sectionOrder: ['hero','portfolio','services','about','testimonials','contact','footer'],
    layouts: { hero:'fullBleed', portfolio:'masonryGrid', services:'minimalList', about:'editorial', testimonials:'editorial', contact:'centered', footer:'minimal' },
  },
];

export const CREATIVE_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'creative_gallery_first', name: 'Gallery First', category: 'creative', theme: 'editorialMinimal',
    description: 'Portfolio-dominant visual showcase',
    conversionStrategy: 'Visual impact → inquiry',
    color: '#1A1A1A',
    sectionOrder: ['hero','portfolio','services','testimonials','about','contact','footer'],
    layouts: { hero:'fullBleed', portfolio:'masonryGrid', services:'minimalList', testimonials:'minimal', about:'split', contact:'centered', footer:'minimal' },
  },
  {
    id: 'creative_editorial_storyteller', name: 'Editorial Storyteller', category: 'creative', theme: 'warmNeutral',
    description: 'Narrative-driven creative portfolio',
    conversionStrategy: 'Emotional storytelling → inquiry',
    color: '#C17F59',
    sectionOrder: ['hero','portfolio','about','testimonials','services','pricing','contact','footer'],
    layouts: { hero:'split', portfolio:'fullBleed', about:'editorial', testimonials:'editorial', services:'cardGrid', pricing:'pricingCards', contact:'centered', footer:'standard' },
  },
  {
    id: 'creative_bold_studio', name: 'Bold Studio', category: 'creative', theme: 'modernBold',
    description: 'High-energy creative studio',
    conversionStrategy: 'Visual shock → explore → hire',
    color: '#6B21A8',
    sectionOrder: ['hero','portfolio','services','about','testimonials','contact','footer'],
    layouts: { hero:'overlay', portfolio:'cardGrid', services:'cardGrid', about:'centered', testimonials:'carousel', contact:'split', footer:'ctaHeavy' },
  },
  {
    id: 'creative_minimal_craft', name: 'Minimal Craft', category: 'creative', theme: 'craftMinimal',
    description: 'Quiet, craft-focused artisan portfolio',
    conversionStrategy: 'Craft appreciation → commission',
    color: '#8B7355',
    sectionOrder: ['hero','portfolio','about','services','testimonials','contact','footer'],
    layouts: { hero:'centered', portfolio:'masonryGrid', about:'editorial', services:'minimalList', testimonials:'minimal', contact:'centered', footer:'minimal' },
  },
  {
    id: 'creative_commercial_pro', name: 'Commercial Pro', category: 'creative', theme: 'modernBold',
    description: 'Business-oriented creative professional',
    conversionStrategy: 'Portfolio credibility → hire',
    color: '#6B21A8',
    sectionOrder: ['hero','portfolio','services','case_studies','testimonials','about','pricing','contact','footer'],
    layouts: { hero:'fullBleed', portfolio:'cardGrid', services:'pricingCards', case_studies:'cardGrid', testimonials:'grid', about:'split', pricing:'pricingCards', contact:'split', footer:'standard' },
  },
];

export const EVENTS_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'events_emotion_showcase', name: 'Emotion Showcase', category: 'events', theme: 'luxurySoft',
    description: 'Cinematic emotional storytelling',
    conversionStrategy: 'Emotional impact → inquiry',
    color: '#B8977E',
    sectionOrder: ['hero','gallery','services','testimonials','about','contact','footer'],
    layouts: { hero:'fullBleed', gallery:'fullBleed', services:'cardGrid', testimonials:'editorial', about:'centered', contact:'centered', footer:'ctaHeavy' },
  },
  {
    id: 'events_structured_planner', name: 'Structured Planner', category: 'events', theme: 'modernBold',
    description: 'Organized corporate event planner',
    conversionStrategy: 'Service clarity → request quote',
    color: '#6B21A8',
    sectionOrder: ['hero','services','about','gallery','testimonials','faq','contact','footer'],
    layouts: { hero:'split', services:'pricingCards', about:'split', gallery:'carousel', testimonials:'grid', faq:'accordion', contact:'split', footer:'standard' },
  },
  {
    id: 'events_intimate_artisan', name: 'Intimate Artisan', category: 'events', theme: 'craftMinimal',
    description: 'Bespoke intimate event design',
    conversionStrategy: 'Taste alignment → exclusive inquiry',
    color: '#8B7355',
    sectionOrder: ['hero','gallery','about','services','testimonials','contact','footer'],
    layouts: { hero:'centered', gallery:'masonryGrid', about:'editorial', services:'minimalList', testimonials:'editorial', contact:'centered', footer:'minimal' },
  },
  {
    id: 'events_party_energy', name: 'Party Energy', category: 'events', theme: 'darkEnergy',
    description: 'High-energy nightlife and party events',
    conversionStrategy: 'Energy hook → book',
    color: '#F472B6',
    sectionOrder: ['hero','gallery','services','about','testimonials','contact','footer'],
    layouts: { hero:'overlay', gallery:'carousel', services:'cardGrid', about:'centered', testimonials:'carousel', contact:'centered', footer:'ctaHeavy' },
  },
  {
    id: 'events_venue_showcase', name: 'Venue Showcase', category: 'events', theme: 'luxurySoft',
    description: 'Venue-first space showcase',
    conversionStrategy: 'Venue beauty → inquire',
    color: '#B8977E',
    sectionOrder: ['hero','gallery','services','about','testimonials','faq','contact','footer'],
    layouts: { hero:'fullBleed', gallery:'masonryGrid', services:'cardGrid', about:'split', testimonials:'grid', faq:'accordion', contact:'split', footer:'standard' },
  },
];
