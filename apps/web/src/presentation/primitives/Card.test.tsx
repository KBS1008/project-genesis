// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '@/presentation/primitives/Card';

describe('Card', () => {
  it('assigns unique heading ids for multiple cards', () => {
    render(
      <>
        <Card title="Erste Karte">Inhalt A</Card>
        <Card title="Zweite Karte">Inhalt B</Card>
      </>,
    );

    const headings = screen.getAllByRole('heading', { level: 2 });

    expect(headings).toHaveLength(2);
    expect(headings[0]?.id).not.toBe(headings[1]?.id);
  });
});
