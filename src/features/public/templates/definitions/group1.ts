// All 45 template definitions — Beauty, Fitness, Health
import type { TemplateDefinition } from '../types';

export const BEAUTY_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'beauty_editorial_luxe', name: 'Editorial Luxe', category: 'beauty', theme: 'luxurySoft',
    description: 'Magazine-style editorial experience for luxury brands',
    conversionStrategy: 'Storytelling → aspiration → book',
    color: '#B8977E',
    sectionOrder: ['hero','about','gallery','services','before_after','reviews','booking','footer'],
    layouts: { hero:'fullBleed', about:'editorial', gallery:'masonryGrid', services:'minimalList', before_after:'split', reviews:'editorial', booking:'centered', footer:'minimal' },
  },
  {
    id: 'beauty_bold_booking', name: 'Bold Booking', category: 'beauty', theme: 'modernBold',
    description: 'Speed-first mobile booking machine',
    conversionStrategy: 'Instant booking, zero friction',
    color: '#6B21A8',
    sectionOrder: ['hero','services','gallery','reviews','faq','footer'],
    layouts: { hero:'bookingEmbed', services:'cardGrid', gallery:'carousel', reviews:'minimal', faq:'accordion', footer:'ctaHeavy' },
  },
  {
    id: 'beauty_warm_storyteller', name: 'Warm Storyteller', category: 'beauty', theme: 'warmNeutral',
    description: 'Personal brand template for independent stylists',
    conversionStrategy: 'Personal connection → trust → book',
    color: '#C17F59',
    sectionOrder: ['hero','about','services','before_after','testimonials','gallery','booking','faq','footer'],
    layouts: { hero:'split', about:'centered', services:'pricingCards', before_after:'carousel', testimonials:'grid', gallery:'fullBleed', booking:'centered', faq:'accordion', footer:'standard' },
  },
  {
    id: 'beauty_noir_premium', name: 'Noir Premium', category: 'beauty', theme: 'darkLuxury',
    description: 'Dark-mode luxury for premium salons',
    conversionStrategy: 'Exclusivity → visual proof → book',
    color: '#E8CFC0',
    sectionOrder: ['hero','gallery','services','about','reviews','booking','footer'],
    layouts: { hero:'overlay', gallery:'fullBleed', services:'minimalList', about:'split', reviews:'carousel', booking:'centered', footer:'minimal' },
  },
  {
    id: 'beauty_playful_studio', name: 'Playful Studio', category: 'beauty', theme: 'playfulBright',
    description: 'Fun, colorful template for playful brands',
    conversionStrategy: 'Delight → browse → book',
    color: '#F97316',
    sectionOrder: ['hero','services','gallery','before_after','reviews','faq','booking','footer'],
    layouts: { hero:'centered', services:'cardGrid', gallery:'masonryGrid', before_after:'split', reviews:'grid', faq:'accordion', booking:'centered', footer:'standard' },
  },
];

export const FITNESS_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'fitness_transformation_engine', name: 'Transformation Engine', category: 'fitness', theme: 'modernBold',
    description: 'Results-first transformation showcase',
    conversionStrategy: 'Transformation proof → sign up',
    color: '#6B21A8',
    sectionOrder: ['hero','before_after','about','services','testimonials','schedule','booking','footer'],
    layouts: { hero:'fullBleed', before_after:'split', about:'centered', services:'pricingCards', testimonials:'carousel', schedule:'cardGrid', booking:'centered', footer:'ctaHeavy' },
  },
  {
    id: 'fitness_zen_wellness', name: 'Zen Wellness', category: 'fitness', theme: 'zenMinimal',
    description: 'Calm, mindful template for yoga and pilates',
    conversionStrategy: 'Calm invitation → book',
    color: '#7D8B6A',
    sectionOrder: ['hero','about','services','schedule','testimonials','gallery','booking','faq','footer'],
    layouts: { hero:'split', about:'editorial', services:'minimalList', schedule:'minimalList', testimonials:'editorial', gallery:'fullBleed', booking:'centered', faq:'accordion', footer:'minimal' },
  },
  {
    id: 'fitness_performance_hub', name: 'Performance Hub', category: 'fitness', theme: 'industrialStrong',
    description: 'Data-driven performance center',
    conversionStrategy: 'Authority → program → sign up',
    color: '#FF453A',
    sectionOrder: ['hero','credentials','services','schedule','about','testimonials','booking','footer'],
    layouts: { hero:'overlay', credentials:'cardGrid', services:'cardGrid', schedule:'cardGrid', about:'split', testimonials:'grid', booking:'centered', footer:'standard' },
  },
  {
    id: 'fitness_lifestyle_brand', name: 'Lifestyle Brand', category: 'fitness', theme: 'energeticBrand',
    description: 'Boutique fitness lifestyle brand',
    conversionStrategy: 'Lifestyle → community → book',
    color: '#10B981',
    sectionOrder: ['hero','gallery','about','services','testimonials','schedule','booking','footer'],
    layouts: { hero:'fullBleed', gallery:'carousel', about:'centered', services:'cardGrid', testimonials:'carousel', schedule:'minimalList', booking:'centered', footer:'ctaHeavy' },
  },
  {
    id: 'fitness_coach_personal', name: 'Coach Personal', category: 'fitness', theme: 'warmNeutral',
    description: 'Personal trainer brand',
    conversionStrategy: 'Personal authority → consultation',
    color: '#C17F59',
    sectionOrder: ['hero','about','before_after','services','testimonials','faq','contact','footer'],
    layouts: { hero:'split', about:'editorial', before_after:'split', services:'pricingCards', testimonials:'grid', faq:'accordion', contact:'centered', footer:'standard' },
  },
];

export const HEALTH_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'health_clinical_trust', name: 'Clinical Trust', category: 'health', theme: 'clinicalClean',
    description: 'Maximum trust for medical professionals',
    conversionStrategy: 'Trust → credentials → appointment',
    color: '#0284C7',
    sectionOrder: ['hero','credentials','services','about','team','reviews','faq','booking','footer'],
    layouts: { hero:'centered', credentials:'cardGrid', services:'minimalList', about:'split', team:'cardGrid', reviews:'minimal', faq:'accordion', booking:'centered', footer:'minimal' },
  },
  {
    id: 'health_warm_care', name: 'Warm Care', category: 'health', theme: 'warmCare',
    description: 'Empathetic patient-centered design',
    conversionStrategy: 'Empathy → safety → book',
    color: '#7FB5A0',
    sectionOrder: ['hero','about','credentials','services','reviews','faq','booking','contact','footer'],
    layouts: { hero:'split', about:'editorial', credentials:'minimalList', services:'cardGrid', reviews:'editorial', faq:'accordion', booking:'centered', contact:'split', footer:'standard' },
  },
  {
    id: 'health_modern_specialist', name: 'Modern Specialist', category: 'health', theme: 'modernBold',
    description: 'Sleek specialist practice',
    conversionStrategy: 'Modern authority → book',
    color: '#6B21A8',
    sectionOrder: ['hero','services','credentials','about','reviews','booking','footer'],
    layouts: { hero:'overlay', services:'cardGrid', credentials:'cardGrid', about:'centered', reviews:'carousel', booking:'centered', footer:'minimal' },
  },
  {
    id: 'health_holistic_natural', name: 'Holistic Natural', category: 'health', theme: 'organicEarth',
    description: 'Organic design for holistic practitioners',
    conversionStrategy: 'Philosophy alignment → book',
    color: '#4A7C59',
    sectionOrder: ['hero','about','services','credentials','testimonials','faq','booking','footer'],
    layouts: { hero:'fullBleed', about:'editorial', services:'minimalList', credentials:'minimalList', testimonials:'grid', faq:'accordion', booking:'centered', footer:'standard' },
  },
  {
    id: 'health_multiservice_clinic', name: 'Multi-Service Clinic', category: 'health', theme: 'clinicalClean',
    description: 'Comprehensive multi-provider clinic',
    conversionStrategy: 'Find service → find provider → book',
    color: '#0284C7',
    sectionOrder: ['hero','services','team','about','reviews','faq','booking','contact','footer'],
    layouts: { hero:'centered', services:'cardGrid', team:'cardGrid', about:'split', reviews:'grid', faq:'accordion', booking:'split', contact:'split', footer:'standard' },
  },
];
