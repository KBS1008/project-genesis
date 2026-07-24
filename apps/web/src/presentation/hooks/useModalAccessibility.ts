'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): readonly HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  );
}

/** Traps focus and handles Escape for modal dialogs. */
export function useModalAccessibility({
  isOpen,
  onClose,
  containerRef,
}: {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly containerRef: RefObject<HTMLElement | null>;
}): void {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const container = containerRef.current;

    if (container === null) {
      return undefined;
    }

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableElements = getFocusableElements(container);
    focusableElements[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const elements = getFocusableElements(container);

      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = elements[0]!;
      const lastElement = elements.at(-1)!;
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [containerRef, isOpen, onClose]);
}
