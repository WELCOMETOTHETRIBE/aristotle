import { NextRequest, NextResponse } from 'next/server';
import { runSelfTest, normalizeFramework, type SelfTestResult } from '@/lib/widget-integrity';
import { getAllFrameworks } from '@/lib/frameworks.config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const frameworkSlug = searchParams.get('framework');
    const format = searchParams.get('format') || 'json';

    if (frameworkSlug) {
      // Test specific framework
      const frameworks = getAllFrameworks();
      const framework = frameworks.find(f => f.slug === frameworkSlug);
      
      if (!framework) {
        return NextResponse.json(
          { error: `Framework "${frameworkSlug}" not found` },
          { status: 404 }
        );
      }

      const normalization = normalizeFramework(framework);
      
      if (format === 'pretty') {
        return formatFrameworkResults(framework.slug, normalization);
      }

      return NextResponse.json({
        success: true,
        framework: frameworkSlug,
        result: normalization
      });
    }

    // Run full self-test
    const results = runSelfTest();
    
    if (format === 'pretty') {
      return formatFullResults(results);
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        totalFrameworks: results.length,
        passedFrameworks: results.filter(r => r.ok).length,
        failedFrameworks: results.filter(r => !r.ok).length,
        totalWidgets: results.reduce((sum, r) => sum + r.summary.totalWidgets, 0),
        passedWidgets: results.reduce((sum, r) => sum + r.summary.passedWidgets, 0),
        failedWidgets: results.reduce((sum, r) => sum + r.summary.failedWidgets, 0),
        totalFixes: results.reduce((sum, r) => sum + r.summary.totalFixes, 0)
      }
    });

  } catch (error) {
    console.error('Error running widget integrity test:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function formatFrameworkResults(frameworkSlug: string, normalization: any): NextResponse {
  const { ok, framework, warnings, fixes, widgetResults } = normalization;
  
  const status = ok ? '✅ PASS' : '❌ FAIL';
  const widgetStatuses = widgetResults.map(({ widgetId, result }: { widgetId: string; result: any }) => {
    const widget = framework.widgets.find((w: any) => w.id === widgetId);
    return `${result.ok ? '✅' : '❌'} ${widget?.title || widgetId}`;
  }).join('\n');

  const fixesList = fixes.length > 0 ? fixes.map((f: string) => `  • ${f}`).join('\n') : '  None';
  const warningsList = warnings.length > 0 ? warnings.map((w: string) => `  • ${w}`).join('\n') : '  None';

  const prettyOutput = `
🧪 WIDGET INTEGRITY TEST - ${framework.name.toUpperCase()}
${'='.repeat(50)}

Status: ${status}
Framework: ${framework.name} (${frameworkSlug})

WIDGETS:
${widgetStatuses}

FIXES APPLIED:
${fixesList}

WARNINGS:
${warningsList}

SUMMARY:
• Total Widgets: ${framework.widgets.length}
• Passed: ${widgetResults.filter((r: any) => r.result.ok).length}
• Failed: ${widgetResults.filter((r: any) => !r.result.ok).length}
• Fixes: ${fixes.length}
`;

  return new NextResponse(prettyOutput, {
    headers: { 'Content-Type': 'text/plain' }
  });
}

function formatFullResults(results: SelfTestResult[]): NextResponse {
  const totalFrameworks = results.length;
  const passedFrameworks = results.filter((r: SelfTestResult) => r.ok).length;
  const failedFrameworks = results.filter((r: SelfTestResult) => !r.ok).length;
  const totalWidgets = results.reduce((sum, r: SelfTestResult) => sum + r.summary.totalWidgets, 0);
  const passedWidgets = results.reduce((sum, r: SelfTestResult) => sum + r.summary.passedWidgets, 0);
  const failedWidgets = results.reduce((sum, r: SelfTestResult) => sum + r.summary.failedWidgets, 0);
  const totalFixes = results.reduce((sum, r: SelfTestResult) => sum + r.summary.totalFixes, 0);

  let output = `
🧪 WIDGET INTEGRITY TEST - FULL REPORT
${'='.repeat(60)}

OVERALL SUMMARY:
• Frameworks: ${passedFrameworks}/${totalFrameworks} passed
• Widgets: ${passedWidgets}/${totalWidgets} passed
• Total Fixes Applied: ${totalFixes}

${'='.repeat(60)}

`;

  results.forEach(result => {
    const status = result.ok ? '✅ PASS' : '❌ FAIL';
    output += `${status} ${result.frameworkName} (${result.frameworkSlug})\n`;
    
    if (!result.ok || result.summary.totalFixes > 0) {
      output += `  Widgets: ${result.summary.passedWidgets}/${result.summary.totalWidgets} passed\n`;
      if (result.summary.totalFixes > 0) {
        output += `  Fixes: ${result.summary.totalFixes}\n`;
      }
      
      // Show failed widgets
      const failedWidgets = result.widgetResults.filter(w => !w.ok);
      if (failedWidgets.length > 0) {
        output += `  Failed Widgets:\n`;
        failedWidgets.forEach(w => {
          output += `    ❌ ${w.widgetTitle} (${w.widgetKind})\n`;
          w.errors.forEach(error => {
            output += `      - ${error}\n`;
          });
        });
      }
    }
    output += '\n';
  });

  if (failedFrameworks === 0 && totalFixes === 0) {
    output += '🎉 ALL TESTS PASSED! No issues found.\n';
  } else if (failedFrameworks === 0) {
    output += '✅ All frameworks pass with auto-fixes applied.\n';
  } else {
    output += `⚠️  ${failedFrameworks} frameworks have issues that need manual attention.\n`;
  }

  return new NextResponse(output, {
    headers: { 'Content-Type': 'text/plain' }
  });
} 