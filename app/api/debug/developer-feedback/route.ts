import { NextRequest, NextResponse } from 'next/server';
import { DeveloperFeedbackAPI } from '@/lib/developer-feedback';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';
  const clear = searchParams.get('clear') === 'true';

  try {
    if (clear) {
      DeveloperFeedbackAPI.clearAllFeedback();
      return NextResponse.json({ 
        message: 'All developer feedback cleared',
        count: 0 
      });
    }

    const feedback = DeveloperFeedbackAPI.getAllFeedback();
    
    if (format === 'text') {
      let output = '🔧 Developer Feedback Report\n';
      output += '='.repeat(50) + '\n\n';
      
      if (feedback.length === 0) {
        output += 'No feedback items found.\n';
      } else {
        feedback.forEach((item, index) => {
          output += `${index + 1}. ${item.category.toUpperCase()} (${item.priority.toUpperCase()})\n`;
          output += `   Type: ${item.type}\n`;
          output += `   Target: ${item.targetId}\n`;
          if (item.frameworkSlug) {
            output += `   Framework: ${item.frameworkSlug}\n`;
          }
          output += `   Location: ${item.location}\n`;
          output += `   Status: ${item.status}\n`;
          output += `   Time: ${item.timestamp.toLocaleString()}\n`;
          output += `   Comment: ${item.comment}\n`;
          output += '\n';
        });
      }
      
      return new NextResponse(output, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    return NextResponse.json({
      feedback,
      count: feedback.length,
      summary: {
        byType: {
          widget: feedback.filter(f => f.type === 'widget').length,
          section: feedback.filter(f => f.type === 'section').length,
          general: feedback.filter(f => f.type === 'general').length
        },
        byPriority: {
          critical: feedback.filter(f => f.priority === 'critical').length,
          high: feedback.filter(f => f.priority === 'high').length,
          medium: feedback.filter(f => f.priority === 'medium').length,
          low: feedback.filter(f => f.priority === 'low').length
        },
        byStatus: {
          open: feedback.filter(f => f.status === 'open').length,
          'in-progress': feedback.filter(f => f.status === 'in-progress').length,
          resolved: feedback.filter(f => f.status === 'resolved').length,
          'wont-fix': feedback.filter(f => f.status === 'wont-fix').length
        }
      }
    });

  } catch (error) {
    console.error('Error handling developer feedback request:', error);
    return NextResponse.json(
      { error: 'Failed to process developer feedback request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'clear':
        DeveloperFeedbackAPI.clearAllFeedback();
        return NextResponse.json({ message: 'All feedback cleared' });
      
      case 'import':
        if (data) {
          DeveloperFeedbackAPI.importFeedback(JSON.stringify(data));
          return NextResponse.json({ message: 'Feedback imported successfully' });
        }
        return NextResponse.json({ error: 'No data provided' }, { status: 400 });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling developer feedback POST request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 