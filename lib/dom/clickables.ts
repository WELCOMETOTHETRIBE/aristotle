export function markClickable(element: HTMLElement, name: string) {
  element.setAttribute('data-test', 'clickable');
  element.setAttribute('data-clickable-name', name);
}

export function getAllClickables(): HTMLElement[] {
  return Array.from(document.querySelectorAll('[data-test="clickable"]'));
}

export function getClickableByName(name: string): HTMLElement | null {
  return document.querySelector(`[data-clickable-name="${name}"]`);
}

export function addClickableListeners() {
  const clickables = getAllClickables();
  
  clickables.forEach(element => {
    element.addEventListener('click', (event) => {
      const name = element.getAttribute('data-clickable-name') || 'unknown';
      console.log(`Clickable clicked: ${name}`, event);
      
      // Log to doctor if available
      if (typeof window !== 'undefined' && window.__doctorErrors) {
        window.__doctorErrors.push({
          timestamp: new Date().toISOString(),
          type: 'clickable-clicked',
          error: `Clickable "${name}" was clicked`,
          metadata: {
            element: element.tagName,
            className: element.className,
            id: element.id
          }
        });
      }
    });
  });
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addClickableListeners);
  } else {
    addClickableListeners();
  }
}
