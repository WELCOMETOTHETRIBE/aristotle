import { render, screen, fireEvent } from '@testing-library/react';
import { FrameworkSelector } from './FrameworkSelector';

// Mock the frameworks API response
const mockFrameworks = [
  {
    id: 'stoic',
    name: 'Stoicism',
    nav: {
      tone: 'calm',
      badge: 'Clarity',
      emoji: '🧱'
    }
  },
  {
    id: 'spartan',
    name: 'Spartan Agōgē',
    nav: {
      tone: 'gritty',
      badge: 'Discipline',
      emoji: '🛡️'
    }
  }
];

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ frameworks: mockFrameworks }),
  })
) as jest.Mock;

describe('FrameworkSelector', () => {
  const mockOnFrameworksChange = jest.fn();

  beforeEach(() => {
    mockOnFrameworksChange.mockClear();
  });

  it('renders framework selector with selected frameworks', () => {
    render(
      <FrameworkSelector
        selectedFrameworks={['stoic']}
        onFrameworksChange={mockOnFrameworksChange}
      />
    );

    expect(screen.getByText('Selected Frameworks')).toBeInTheDocument();
    expect(screen.getByText('1 framework selected')).toBeInTheDocument();
  });

  it('shows no frameworks selected message when empty', () => {
    render(
      <FrameworkSelector
        selectedFrameworks={[]}
        onFrameworksChange={mockOnFrameworksChange}
      />
    );

    expect(screen.getByText('No frameworks selected')).toBeInTheDocument();
  });

  it('expands to show framework list when clicked', async () => {
    render(
      <FrameworkSelector
        selectedFrameworks={[]}
        onFrameworksChange={mockOnFrameworksChange}
      />
    );

    const header = screen.getByText('Selected Frameworks');
    fireEvent.click(header);

    // Wait for frameworks to load
    await screen.findByText('Stoicism');
    expect(screen.getByText('Spartan Agōgē')).toBeInTheDocument();
  });
});
