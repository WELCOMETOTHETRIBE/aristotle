import { z } from 'zod';
import { getFrameworkBySlug, getAllFrameworks, type FrameworkConfig, type VirtueXP } from './frameworks.config';

// ===== WIDGET CONFORMANCE CONTRACT =====

export const WidgetKindSchema = z.enum([
  'TIMER', 'COUNTER', 'DRAG_BOARD', 'CHECKLIST', 'JOURNAL', 
  'AUDIO_NOTE', 'PHOTO', 'BREATH', 'BALANCE_GYRO', 'WHEEL', 'SLIDERS'
]);

export const VirtueXPSchema = z.object({
  wisdom: z.number().min(0).max(5).optional(),
  justice: z.number().min(0).max(5).optional(),
  courage: z.number().min(0).max(5).optional(),
  temperance: z.number().min(0).max(5).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one virtue must be specified"
});

// Widget-specific config schemas
export const TimerConfigSchema = z.object({
  targetSec: z.number().positive().optional(),
  allowRPE: z.boolean().optional(),
  teaching: z.string().max(140).optional(),
});

export const CounterConfigSchema = z.object({
  targetReps: z.number().positive().optional(),
  step: z.number().positive().optional(),
  teaching: z.string().max(140).optional(),
});

export const DragBoardConfigSchema = z.object({
  columns: z.array(z.object({
    key: z.string(),
    label: z.string(),
  })),
  items: z.array(z.object({
    id: z.string(),
    label: z.string(),
  })),
  teaching: z.string().max(140).optional(),
});

export const ChecklistConfigSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    label: z.string(),
    required: z.boolean().optional(),
  })),
  teaching: z.string().max(140).optional(),
});

export const JournalConfigSchema = z.object({
  minWords: z.number().positive().optional(),
  aiCoaching: z.boolean().optional(),
  prompt: z.string(),
  teaching: z.string().max(140).optional(),
});

export const AudioNoteConfigSchema = z.object({
  maxSec: z.number().positive(),
  transcribe: z.boolean().optional(),
  teaching: z.string().max(140).optional(),
});

export const PhotoConfigSchema = z.object({
  tags: z.array(z.string()).optional(),
  teaching: z.string().max(140).optional(),
});

export const BreathConfigSchema = z.object({
  pattern: z.enum(['wim_hof', 'box', 'coherent', 'ocean', 'alt_nostril', '4-7-8', 'triangle', 'mantra', 'heart', '6-2']),
  params: z.record(z.number()),
  teaching: z.string().max(140).optional(),
});

export const BalanceGyroConfigSchema = z.object({
  targetSec: z.number().positive().optional(),
  teaching: z.string().max(140).optional(),
});

export const WheelConfigSchema = z.object({
  options: z.array(z.string()),
  teaching: z.string().max(140).optional(),
});

export const SlidersConfigSchema = z.object({
  virtues: z.boolean().optional(),
  teaching: z.string().max(140).optional(),
});

// Union type for all widget configs
export const WidgetConfigSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('TIMER'), config: TimerConfigSchema }),
  z.object({ kind: z.literal('COUNTER'), config: CounterConfigSchema }),
  z.object({ kind: z.literal('DRAG_BOARD'), config: DragBoardConfigSchema }),
  z.object({ kind: z.literal('CHECKLIST'), config: ChecklistConfigSchema }),
  z.object({ kind: z.literal('JOURNAL'), config: JournalConfigSchema }),
  z.object({ kind: z.literal('AUDIO_NOTE'), config: AudioNoteConfigSchema }),
  z.object({ kind: z.literal('PHOTO'), config: PhotoConfigSchema }),
  z.object({ kind: z.literal('BREATH'), config: BreathConfigSchema }),
  z.object({ kind: z.literal('BALANCE_GYRO'), config: BalanceGyroConfigSchema }),
  z.object({ kind: z.literal('WHEEL'), config: WheelConfigSchema }),
  z.object({ kind: z.literal('SLIDERS'), config: SlidersConfigSchema }),
]);

// Main widget schema
export const WidgetSchema = z.object({
  id: z.string(),
  kind: WidgetKindSchema,
  title: z.string().min(1),
  config: z.record(z.any()), // Will be validated by specific config schema
  virtueGrantPerCompletion: VirtueXPSchema,
  teaching: z.string().max(140).optional(),
  kpis: z.array(z.string()).min(1).optional(),
});

export type WidgetConfig = z.infer<typeof WidgetSchema>;
export type WidgetKind = z.infer<typeof WidgetKindSchema>;

// ===== DEFAULT TABLES =====

export const WIDGET_DEFAULTS: Record<WidgetKind, any> = {
  TIMER: {
    targetSec: 300,
    allowRPE: true,
    teaching: 'Focus on the present moment',
    kpis: ['duration_sec', 'rpe', 'mood_pre', 'mood_post']
  },
  COUNTER: {
    targetReps: 10,
    step: 1,
    teaching: 'Build strength through repetition',
    kpis: ['reps_completed', 'target_reached', 'percentage']
  },
  DRAG_BOARD: {
    teaching: 'Organize your thoughts and priorities',
    kpis: ['items_moved', 'columns_used']
  },
  CHECKLIST: {
    teaching: 'Complete tasks systematically',
    kpis: ['items_completed', 'total_items', 'completion_rate']
  },
  JOURNAL: {
    minWords: 60,
    aiCoaching: true,
    prompt: 'Reflect on your experience',
    teaching: 'Writing clarifies thinking',
    kpis: ['word_count', 'ai_coaching_used']
  },
  AUDIO_NOTE: {
    maxSec: 60,
    transcribe: false,
    teaching: 'Capture your thoughts in voice',
    kpis: ['duration_sec', 'transcribed']
  },
  PHOTO: {
    tags: ['practice', 'progress'],
    teaching: 'Visual documentation of your journey',
    kpis: ['photos_taken', 'tags_used']
  },
  BREATH: {
    pattern: 'box',
    params: { in: 4, hold: 4, out: 4, hold2: 4, cycles: 10 },
    teaching: 'Master your breath to master your mind',
    kpis: ['cycles_completed', 'duration_sec', 'pattern_used']
  },
  BALANCE_GYRO: {
    targetSec: 30,
    teaching: 'Find your center and balance',
    kpis: ['balance_sec', 'attempts']
  },
  WHEEL: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    teaching: 'Choose your focus for today',
    kpis: ['selection_made', 'options_available']
  },
  SLIDERS: {
    virtues: true,
    teaching: 'Assess your current state',
    kpis: ['virtues_assessed', 'slider_values']
  }
};

// ===== CONFIG NORMALIZER & AUTO-HEALING =====

export interface NormalizationResult {
  ok: boolean;
  widget: WidgetConfig;
  warnings: string[];
  fixes: string[];
}

export interface ValidationResult {
  ok: boolean;
  widget?: WidgetConfig;
  errors: string[];
  warnings: string[];
}

export function validateAndNormalizeWidget(widget: any, framework?: FrameworkConfig): NormalizationResult {
  const warnings: string[] = [];
  const fixes: string[] = [];
  
  try {
    // Basic validation
    const validation = WidgetSchema.safeParse(widget);
    if (!validation.success) {
      return {
        ok: false,
        widget: widget as WidgetConfig,
        warnings: validation.error.errors.map(e => e.message),
        fixes: []
      };
    }

    let normalizedWidget = { ...validation.data };

    // Auto-heal missing fields
    if (!normalizedWidget.teaching) {
      const defaultTeaching = WIDGET_DEFAULTS[normalizedWidget.kind].teaching;
      normalizedWidget.teaching = defaultTeaching;
      fixes.push(`Added missing teaching: "${defaultTeaching}"`);
    }

    if (!normalizedWidget.kpis || normalizedWidget.kpis.length === 0) {
      const defaultKpis = WIDGET_DEFAULTS[normalizedWidget.kind].kpis;
      normalizedWidget.kpis = defaultKpis;
      fixes.push(`Added missing KPIs: ${defaultKpis.join(', ')}`);
    }

    // Validate virtue grants
    const virtueKeys = Object.keys(normalizedWidget.virtueGrantPerCompletion);
    if (virtueKeys.length === 0) {
      // Infer from framework virtues
      if (framework) {
        const primaryVirtue = framework.virtuePrimary.toLowerCase() as keyof VirtueXP;
        const secondaryVirtue = framework.virtueSecondary?.toLowerCase() as keyof VirtueXP;
        
        normalizedWidget.virtueGrantPerCompletion = {
          [primaryVirtue]: 2,
          ...(secondaryVirtue && { [secondaryVirtue]: 1 })
        };
        fixes.push(`Inferred virtue grants from framework: ${primaryVirtue} +2, ${secondaryVirtue || 'none'} +1`);
      } else {
        normalizedWidget.virtueGrantPerCompletion = { wisdom: 1 };
        fixes.push('Added default virtue grant: wisdom +1');
      }
    }

    // Validate config based on widget kind
    const configValidation = WidgetConfigSchema.safeParse(normalizedWidget);
    if (!configValidation.success) {
      warnings.push(`Config validation warnings: ${configValidation.error.errors.map(e => e.message).join(', ')}`);
    }

    // Apply defaults for missing config values
    const defaults = WIDGET_DEFAULTS[normalizedWidget.kind];
    const currentConfig = normalizedWidget.config || {};
    
    Object.entries(defaults).forEach(([key, defaultValue]) => {
      if (key !== 'teaching' && key !== 'kpis' && currentConfig[key] === undefined) {
        currentConfig[key] = defaultValue;
        fixes.push(`Added missing config.${key}: ${JSON.stringify(defaultValue)}`);
      }
    });

    normalizedWidget.config = currentConfig;

    return {
      ok: true,
      widget: normalizedWidget,
      warnings,
      fixes
    };

  } catch (error) {
    return {
      ok: false,
      widget: widget as WidgetConfig,
      warnings: [`Validation error: ${error}`],
      fixes: []
    };
  }
}

// ===== FRAMEWORK NORMALIZER =====

export interface FrameworkNormalizationResult {
  ok: boolean;
  framework: FrameworkConfig;
  warnings: string[];
  fixes: string[];
  widgetResults: Array<{ widgetId: string; result: NormalizationResult }>;
}

export function normalizeFramework(framework: FrameworkConfig): FrameworkNormalizationResult {
  const warnings: string[] = [];
  const fixes: string[] = [];
  const widgetResults: Array<{ widgetId: string; result: NormalizationResult }> = [];

  const normalizedFramework = { ...framework };

  // Ensure breath widget exists and is last
  const breathWidget = normalizedFramework.widgets.find(w => w.kind === 'BREATH');
  const nonBreathWidgets = normalizedFramework.widgets.filter(w => w.kind !== 'BREATH');

  if (!breathWidget) {
    // Create default breath widget
    const defaultBreathWidget = {
      id: `${framework.slug}_breath`,
      kind: 'BREATH' as const,
      title: `${framework.name} Breath`,
      config: {
        pattern: 'box',
        params: { in: 4, hold: 4, out: 4, hold2: 4, cycles: 10 },
        teaching: 'Master your breath to master your mind'
      },
      virtueGrantPerCompletion: {
        [framework.virtuePrimary.toLowerCase() as keyof VirtueXP]: 1,
        [framework.virtueSecondary?.toLowerCase() as keyof VirtueXP]: 1
      }
    };
    
    normalizedFramework.widgets = [...nonBreathWidgets, defaultBreathWidget];
    fixes.push(`Added missing breath widget: ${defaultBreathWidget.title}`);
  } else {
    // Ensure breath widget is last
    normalizedFramework.widgets = [...nonBreathWidgets, breathWidget];
    if (normalizedFramework.widgets[normalizedFramework.widgets.length - 1].id !== breathWidget.id) {
      fixes.push('Moved breath widget to last position');
    }
  }

  // Validate and normalize each widget
  normalizedFramework.widgets = normalizedFramework.widgets.map(widget => {
    const result = validateAndNormalizeWidget(widget, framework);
    widgetResults.push({ widgetId: widget.id, result });
    
    if (!result.ok) {
      warnings.push(`Widget ${widget.id} has validation errors: ${result.warnings.join(', ')}`);
    }
    
    if (result.fixes.length > 0) {
      fixes.push(`Widget ${widget.id}: ${result.fixes.join(', ')}`);
    }
    
    return result.widget;
  });

  return {
    ok: widgetResults.every(r => r.result.ok),
    framework: normalizedFramework,
    warnings,
    fixes,
    widgetResults
  };
}

// ===== SELF-TEST HARNESS =====

export interface SelfTestResult {
  frameworkSlug: string;
  frameworkName: string;
  ok: boolean;
  widgetResults: Array<{
    widgetId: string;
    widgetTitle: string;
    widgetKind: WidgetKind;
    ok: boolean;
    errors: string[];
    warnings: string[];
    fixes: string[];
    kpis: string[];
    virtueGrants: VirtueXP;
  }>;
  summary: {
    totalWidgets: number;
    passedWidgets: number;
    failedWidgets: number;
    totalFixes: number;
  };
}

export function runSelfTest(): SelfTestResult[] {
  const frameworks = getAllFrameworks();
  const results: SelfTestResult[] = [];

  for (const framework of frameworks) {
    const normalization = normalizeFramework(framework);
    
    const widgetResults = normalization.widgetResults.map(({ widgetId, result }) => {
      const widget = framework.widgets.find(w => w.id === widgetId)!;
      return {
        widgetId,
        widgetTitle: widget.title,
        widgetKind: widget.kind,
        ok: result.ok,
        errors: result.warnings.filter(w => w.includes('error')),
        warnings: result.warnings.filter(w => !w.includes('error')),
        fixes: result.fixes,
        kpis: result.widget.kpis || [],
        virtueGrants: result.widget.virtueGrantPerCompletion
      };
    });

    const passedWidgets = widgetResults.filter(r => r.ok).length;
    const failedWidgets = widgetResults.filter(r => !r.ok).length;
    const totalFixes = widgetResults.reduce((sum, r) => sum + r.fixes.length, 0);

    results.push({
      frameworkSlug: framework.slug,
      frameworkName: framework.name,
      ok: normalization.ok,
      widgetResults,
      summary: {
        totalWidgets: widgetResults.length,
        passedWidgets,
        failedWidgets,
        totalFixes
      }
    });
  }

  return results;
}

// ===== RUNTIME GUARDRAILS =====

export interface QuarantineCard {
  widgetId: string;
  title: string;
  error: string;
  suggestedFixes: string[];
  safeDefaults: WidgetConfig;
}

export function createQuarantineCard(widget: any, error: string): QuarantineCard {
  const widgetKind = (widget.kind as WidgetKind) || 'TIMER';
  const safeDefaults: WidgetConfig = {
    id: widget.id || 'quarantine_widget',
    kind: widgetKind,
    title: widget.title || 'Safe Default Widget',
    config: WIDGET_DEFAULTS[widgetKind],
    virtueGrantPerCompletion: { wisdom: 1 },
    teaching: 'This is a safe default widget',
    kpis: ['completion']
  };

  return {
    widgetId: widget.id,
    title: widget.title || 'Broken Widget',
    error,
    suggestedFixes: [
      'Check widget configuration',
      'Verify all required fields are present',
      'Ensure virtue grants are specified',
      'Validate widget-specific config'
    ],
    safeDefaults
  };
}

// ===== TELEMETRY =====

export interface IntegrityEvent {
  type: 'widget_validated' | 'widget_normalized' | 'widget_quarantined' | 'checkin_posted' | 'kpi_missing' | 'virtue_missing';
  frameworkSlug: string;
  widgetId: string;
  widgetKind: WidgetKind;
  timestamp: Date;
  details: Record<string, any>;
}

export const integrityEvents: IntegrityEvent[] = [];

export function emitIntegrityEvent(event: Omit<IntegrityEvent, 'timestamp'>) {
  const fullEvent: IntegrityEvent = {
    ...event,
    timestamp: new Date()
  };
  
  integrityEvents.push(fullEvent);
  
  // In production, send to telemetry service
  console.log('Integrity Event:', fullEvent);
}

// ===== UTILITY FUNCTIONS =====

export function getWidgetKpis(widgetKind: WidgetKind): string[] {
  return WIDGET_DEFAULTS[widgetKind].kpis || [];
}

export function getWidgetDefaults(widgetKind: WidgetKind): any {
  return WIDGET_DEFAULTS[widgetKind];
}

export function validateCheckinPayload(widget: WidgetConfig, payload: any): boolean {
  const requiredKpis = widget.kpis || getWidgetKpis(widget.kind);
  
  // Basic validation - ensure at least one KPI is present
  const hasKpis = requiredKpis.some(kpi => payload[kpi] !== undefined);
  
  if (!hasKpis) {
    emitIntegrityEvent({
      type: 'kpi_missing',
      frameworkSlug: '', // Will be filled by caller
      widgetId: widget.id,
      widgetKind: widget.kind,
      details: { requiredKpis, actualPayload: payload }
    });
  }
  
  return hasKpis;
} 