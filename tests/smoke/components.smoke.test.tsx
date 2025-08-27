import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import your components
import BreathPage from '@/app/breath/page';
import CoachPage from '@/app/coach/page';

describe('Component Smoke Tests', () => {
  it('should render breathwork page without crashing', () => {
    render(<BreathPage />);
    
    // Check for essential elements
    expect(screen.getByText(/breathwork/i)).toBeInTheDocument();
    expect(screen.getByText(/start session/i)).toBeInTheDocument();
  });

  it('should render coach page without crashing', () => {
    render(<CoachPage />);
    
    // Check for essential elements
    expect(screen.getByText(/coach/i)).toBeInTheDocument();
    expect(screen.getByText(/send/i)).toBeInTheDocument();
  });

  it('should have clickable elements with data-test attributes', () => {
    render(<BreathPage />);
    
    // Check for clickable elements
    const clickables = document.querySelectorAll('[data-test="clickable"]');
    expect(clickables.length).toBeGreaterThan(0);
  });
});
