'use client';

import React, { useState, useEffect } from 'react';
import { validateAndNormalizeWidget, createQuarantineCard, emitIntegrityEvent, type WidgetConfig } from '@/lib/widget-integrity';
import QuarantineCard from './QuarantineCard';
import type { FrameworkConfig } from '@/lib/frameworks.config';

interface WidgetGuardProps {
  widget: any;
  framework: FrameworkConfig;
  onComplete: (payload: any) => void;
  children: (normalizedWidget: WidgetConfig, onComplete: (payload: any) => void) => React.ReactNode;
}

export default function WidgetGuard({ widget, framework, onComplete, children }: WidgetGuardProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [normalizedWidget, setNormalizedWidget] = useState<WidgetConfig | null>(null);
  const [quarantineData, setQuarantineData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    validateWidget();
  }, [widget, framework]);

  const validateWidget = () => {
    try {
      const result = validateAndNormalizeWidget(widget, framework);
      
      if (result.ok) {
        setIsValid(true);
        setNormalizedWidget(result.widget);
        setQuarantineData(null);
        setValidationErrors([]);
        
        emitIntegrityEvent({
          type: 'widget_validated',
          frameworkSlug: framework.slug,
          widgetId: widget.id,
          widgetKind: widget.kind,
          details: { fixes: result.fixes, warnings: result.warnings }
        });
      } else {
        setIsValid(false);
        setNormalizedWidget(null);
        setValidationErrors(result.warnings);
        
        const quarantine = createQuarantineCard(widget, result.warnings.join(', '));
        setQuarantineData(quarantine);
        
        emitIntegrityEvent({
          type: 'widget_quarantined',
          frameworkSlug: framework.slug,
          widgetId: widget.id,
          widgetKind: widget.kind,
          details: { errors: result.warnings }
        });
      }
    } catch (error) {
      setIsValid(false);
      setValidationErrors([`Validation error: ${error}`]);
      
      const quarantine = createQuarantineCard(widget, `Validation error: ${error}`);
      setQuarantineData(quarantine);
    }
  };

  const handleUseSafeDefaults = (safeWidget: WidgetConfig) => {
    setIsValid(true);
    setNormalizedWidget(safeWidget);
    setQuarantineData(null);
    
    emitIntegrityEvent({
      type: 'widget_normalized',
      frameworkSlug: framework.slug,
      widgetId: widget.id,
      widgetKind: widget.kind,
      details: { usedSafeDefaults: true }
    });
  };

  const handleRetry = () => {
    validateWidget();
  };

  const handleComplete = (payload: any) => {
    if (normalizedWidget) {
      // Validate that payload contains required KPIs
      const hasKpis = normalizedWidget.kpis?.some(kpi => payload[kpi] !== undefined);
      
      if (!hasKpis) {
        emitIntegrityEvent({
          type: 'kpi_missing',
          frameworkSlug: framework.slug,
          widgetId: widget.id,
          widgetKind: widget.kind,
          details: { requiredKpis: normalizedWidget.kpis, actualPayload: payload }
        });
      }
      
      // Ensure virtue grants are present
      const hasVirtues = Object.keys(normalizedWidget.virtueGrantPerCompletion).length > 0;
      if (!hasVirtues) {
        emitIntegrityEvent({
          type: 'virtue_missing',
          frameworkSlug: framework.slug,
          widgetId: widget.id,
          widgetKind: widget.kind,
          details: { payload }
        });
      }
      
      emitIntegrityEvent({
        type: 'checkin_posted',
        frameworkSlug: framework.slug,
        widgetId: widget.id,
        widgetKind: widget.kind,
        details: { payload, hasKpis, hasVirtues }
      });
    }
    
    onComplete(payload);
  };

  // Show loading state while validating
  if (isValid === null) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Validating widget...</p>
        </div>
      </div>
    );
  }

  // Show quarantine card if validation failed
  if (!isValid && quarantineData) {
    return (
      <QuarantineCard
        quarantineData={quarantineData}
        onUseSafeDefaults={handleUseSafeDefaults}
        onRetry={handleRetry}
      />
    );
  }

  // Show normalized widget if validation passed
  if (isValid && normalizedWidget) {
    return (
      <div className="widget-guard">
        {children(normalizedWidget, handleComplete)}
      </div>
    );
  }

  // Fallback error state
  return (
    <div className="p-6 bg-red-50 rounded-lg border border-red-200">
      <div className="text-center">
        <p className="text-red-800 font-medium">Widget validation failed</p>
        <p className="text-red-600 text-sm mt-1">
          {validationErrors.join(', ')}
        </p>
        <button
          onClick={handleRetry}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry Validation
        </button>
      </div>
    </div>
  );
} 