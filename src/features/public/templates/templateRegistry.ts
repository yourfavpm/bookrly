// ═══════════════════════════════════════════════════════════
// SKEDULEY TEMPLATE SYSTEM — Registry & Renderer
// ═══════════════════════════════════════════════════════════
//
// This replaces the old system of individual layout files.
// Templates are now DATA (definitions) rendered by a single
// universal TemplateRenderer component.
//
import type { TemplateDefinition, TemplateInfo } from './types';
import { BEAUTY_TEMPLATES, FITNESS_TEMPLATES, HEALTH_TEMPLATES } from './definitions/group1';
import { PROFESSIONAL_TEMPLATES, CREATIVE_TEMPLATES, EVENTS_TEMPLATES } from './definitions/group2';
import { EDUCATION_TEMPLATES, HOME_TEMPLATES, DIGITAL_TEMPLATES } from './definitions/group3';

// ── Master Template List ─────────────────────────────────
export const ALL_TEMPLATES: TemplateDefinition[] = [
  ...BEAUTY_TEMPLATES,
  ...FITNESS_TEMPLATES,
  ...HEALTH_TEMPLATES,
  ...PROFESSIONAL_TEMPLATES,
  ...CREATIVE_TEMPLATES,
  ...EVENTS_TEMPLATES,
  ...EDUCATION_TEMPLATES,
  ...HOME_TEMPLATES,
  ...DIGITAL_TEMPLATES,
];

// ── Lookup Helpers ───────────────────────────────────────

/** Get a template definition by ID, fallback to beauty_editorial_luxe */
export const getTemplate = (id: string): TemplateDefinition => {
  return ALL_TEMPLATES.find(t => t.id === id) || ALL_TEMPLATES[0];
};

/** Get all templates for a specific category */
export const getTemplatesByCategory = (category: string): TemplateDefinition[] => {
  return ALL_TEMPLATES.filter(t => t.category === category);
};

/** Get template info for the switcher UI */
export const getTemplateInfo = (id: string): TemplateInfo | undefined => {
  const t = ALL_TEMPLATES.find(tpl => tpl.id === id);
  if (!t) return undefined;
  return { key: t.id, name: t.name, category: t.category, description: t.description, color: t.color };
};

/** Get all unique categories */
export const getCategories = (): string[] => {
  return [...new Set(ALL_TEMPLATES.map(t => t.category))];
};

// ── TEMPLATES array (backward-compatible with old TemplateSelector) ──
export const TEMPLATES: (TemplateInfo & { component?: never })[] = ALL_TEMPLATES.map(t => ({
  key: t.id,
  name: t.name,
  category: t.category,
  description: t.description,
  color: t.color,
}));

// ── Legacy adapter: getTemplateComponent ─────────────────
// Returns null — the old per-file layout system is replaced by TemplateRenderer.
// PublicWebsite.tsx will be updated to use TemplateRenderer instead.
export const getTemplateComponent = (_key: string) => null;
