// All 45 template definitions — Education, Home Services, Digital
import type { TemplateDefinition } from '../types';

export const EDUCATION_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'education_program_authority', name: 'Program Authority', category: 'education', theme: 'modernBold',
    description: 'Structured program enrollment page',
    conversionStrategy: 'Outcome proof → enroll',
    color: '#6B21A8',
    sectionOrder: ['hero','about','services','reviews','faq','pricing','contact','footer'],
    layouts: { hero:'centered', about:'editorial', services:'cardGrid', reviews:'carousel', faq:'accordion', pricing:'pricingCards', contact:'centered', footer:'ctaHeavy' },
  },
  {
    id: 'education_warm_mentor', name: 'Warm Mentor', category: 'education', theme: 'warmNeutral',
    description: 'Personal mentorship brand',
    conversionStrategy: 'Personal resonance → apply',
    color: '#C17F59',
    sectionOrder: ['hero','about','services','testimonials','faq','schedule','contact','footer'],
    layouts: { hero:'split', about:'editorial', services:'minimalList', testimonials:'editorial', faq:'accordion', schedule:'minimalList', contact:'centered', footer:'standard' },
  },
  {
    id: 'education_academy_structured', name: 'Academy Structured', category: 'education', theme: 'clinicalClean',
    description: 'Multi-program academy presence',
    conversionStrategy: 'Program discovery → enroll',
    color: '#0284C7',
    sectionOrder: ['hero','services','schedule','about','team','reviews','faq','contact','footer'],
    layouts: { hero:'overlay', services:'cardGrid', schedule:'cardGrid', about:'split', team:'cardGrid', reviews:'grid', faq:'accordion', contact:'split', footer:'standard' },
  },
  {
    id: 'education_workshop_creator', name: 'Workshop Creator', category: 'education', theme: 'energeticBrand',
    description: 'Workshop and retreat leader',
    conversionStrategy: 'Event excitement → register',
    color: '#10B981',
    sectionOrder: ['hero','services','gallery','about','testimonials','pricing','contact','footer'],
    layouts: { hero:'fullBleed', services:'cardGrid', gallery:'carousel', about:'centered', testimonials:'carousel', pricing:'pricingCards', contact:'centered', footer:'ctaHeavy' },
  },
  {
    id: 'education_digital_expert', name: 'Digital Expert', category: 'education', theme: 'modernBold',
    description: 'Digital-first online educator',
    conversionStrategy: 'Free value → paid enrollment',
    color: '#6B21A8',
    sectionOrder: ['hero','about','services','testimonials','faq','pricing','contact','footer'],
    layouts: { hero:'centered', about:'split', services:'pricingCards', testimonials:'grid', faq:'accordion', pricing:'pricingCards', contact:'centered', footer:'standard' },
  },
];

export const HOME_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'home_urgent_action', name: 'Urgent Action', category: 'home_services', theme: 'utilitarian',
    description: 'Speed and urgency for emergency services',
    conversionStrategy: 'Problem → call NOW',
    color: '#DC2626',
    sectionOrder: ['hero','services','reviews','faq','contact','footer'],
    layouts: { hero:'centered', services:'cardGrid', reviews:'minimal', faq:'accordion', contact:'split', footer:'ctaHeavy' },
  },
  {
    id: 'home_trusted_professional', name: 'Trusted Professional', category: 'home_services', theme: 'warmNeutral',
    description: 'Trust-focused local professional',
    conversionStrategy: 'Trust → evidence → quote',
    color: '#C17F59',
    sectionOrder: ['hero','services','about','gallery','reviews','faq','contact','footer'],
    layouts: { hero:'split', services:'cardGrid', about:'centered', gallery:'masonryGrid', reviews:'grid', faq:'accordion', contact:'split', footer:'standard' },
  },
  {
    id: 'home_premium_specialist', name: 'Premium Specialist', category: 'home_services', theme: 'luxurySoft',
    description: 'Premium home service provider',
    conversionStrategy: 'Portfolio aspiration → consult',
    color: '#B8977E',
    sectionOrder: ['hero','gallery','services','about','reviews','contact','footer'],
    layouts: { hero:'fullBleed', gallery:'masonryGrid', services:'minimalList', about:'split', reviews:'editorial', contact:'centered', footer:'minimal' },
  },
  {
    id: 'home_neighborhood_friendly', name: 'Neighborhood Friendly', category: 'home_services', theme: 'playfulBright',
    description: 'Friendly approachable local service',
    conversionStrategy: 'Friendliness → book/call',
    color: '#F97316',
    sectionOrder: ['hero','services','reviews','about','faq','booking','footer'],
    layouts: { hero:'centered', services:'pricingCards', reviews:'carousel', about:'centered', faq:'accordion', booking:'centered', footer:'standard' },
  },
  {
    id: 'home_fleet_operations', name: 'Fleet Operations', category: 'home_services', theme: 'clinicalClean',
    description: 'Multi-van operations company',
    conversionStrategy: 'Coverage → service → book',
    color: '#0284C7',
    sectionOrder: ['hero','services','about','team','reviews','faq','contact','footer'],
    layouts: { hero:'overlay', services:'cardGrid', about:'split', team:'cardGrid', reviews:'grid', faq:'accordion', contact:'split', footer:'standard' },
  },
];

export const DIGITAL_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'digital_case_study_leader', name: 'Case Study Leader', category: 'digital', theme: 'modernBold',
    description: 'Results-driven digital agency',
    conversionStrategy: 'Results evidence → strategy call',
    color: '#6B21A8',
    sectionOrder: ['hero','case_studies','services','about','reviews','pricing','contact','footer'],
    layouts: { hero:'centered', case_studies:'cardGrid', services:'cardGrid', about:'split', reviews:'carousel', pricing:'pricingCards', contact:'centered', footer:'standard' },
  },
  {
    id: 'digital_creative_agency', name: 'Creative Agency', category: 'digital', theme: 'editorialMinimal',
    description: 'Design-led digital agency',
    conversionStrategy: 'Design quality → brief us',
    color: '#1A1A1A',
    sectionOrder: ['hero','portfolio','services','about','testimonials','contact','footer'],
    layouts: { hero:'fullBleed', portfolio:'masonryGrid', services:'minimalList', about:'editorial', testimonials:'editorial', contact:'centered', footer:'minimal' },
  },
  {
    id: 'digital_saas_builder', name: 'SaaS Builder', category: 'digital', theme: 'darkTech',
    description: 'Tech-forward product agency',
    conversionStrategy: 'Technical credibility → engage',
    color: '#06B6D4',
    sectionOrder: ['hero','services','case_studies','about','reviews','faq','contact','footer'],
    layouts: { hero:'overlay', services:'cardGrid', case_studies:'cardGrid', about:'centered', reviews:'grid', faq:'accordion', contact:'split', footer:'standard' },
  },
  {
    id: 'digital_growth_partner', name: 'Growth Partner', category: 'digital', theme: 'warmNeutral',
    description: 'Strategic growth partnership agency',
    conversionStrategy: 'Strategic framing → partner inquiry',
    color: '#C17F59',
    sectionOrder: ['hero','about','services','case_studies','testimonials','faq','contact','footer'],
    layouts: { hero:'split', about:'editorial', services:'cardGrid', case_studies:'minimalList', testimonials:'carousel', faq:'accordion', contact:'centered', footer:'standard' },
  },
  {
    id: 'digital_boutique_specialist', name: 'Boutique Specialist', category: 'digital', theme: 'clinicalClean',
    description: 'Niche specialist agency',
    conversionStrategy: 'Specialization depth → hire',
    color: '#0284C7',
    sectionOrder: ['hero','services','case_studies','about','reviews','pricing','contact','footer'],
    layouts: { hero:'centered', services:'minimalList', case_studies:'cardGrid', about:'split', reviews:'grid', pricing:'pricingCards', contact:'centered', footer:'minimal' },
  },
];
