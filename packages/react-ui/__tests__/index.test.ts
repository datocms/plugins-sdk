import { generateStyleFromCtx } from '../src/generateStyleFromCtx';

const baseCtx = {
  bodyPadding: [10, 20, 10, 20] as [number, number, number, number],
  theme: {
    primaryColor: 'rgb(0, 76, 209)',
    accentColor: 'rgb(0, 76, 209)',
    semiTransparentAccentColor: 'rgb(0, 76, 209)',
    lightColor: 'rgb(219, 234, 254)',
    darkColor: 'rgb(0, 33, 90)',
  },
  semanticColorTokensTheme: {},
};

describe('generateStyleFromCtx', () => {
  it('generates existing theme CSS variables with RGB components', () => {
    const style = generateStyleFromCtx(baseCtx as any) as any;

    expect(style['--primary-color']).toBe('rgb(0, 76, 209)');
    expect(style['--primary-color-rgb-components']).toBe('0, 76, 209');
    expect(style['--accent-color']).toBe('rgb(0, 76, 209)');
    expect(style['--semi-transparent-accent-color']).toBe('rgb(0, 76, 209)');
    expect(style.padding).toBe('10px 20px 10px 20px');
  });

  it('respects noBodyPadding flag', () => {
    const style = generateStyleFromCtx(baseCtx as any, true) as any;

    expect(style.padding).toBeUndefined();
    expect(style['--primary-color']).toBe('rgb(0, 76, 209)');
  });

  it('generates semantic color token CSS variables without RGB components', () => {
    const ctx = {
      ...baseCtx,
      semanticColorTokensTheme: {
        colorSurface: 'rgb(255, 255, 255)',
        colorInk: 'rgb(52, 54, 58)',
        colorFeedbackFailInk: 'rgb(255, 94, 73)',
      },
    };

    const style = generateStyleFromCtx(ctx as any) as any;

    expect(style['--color--surface']).toBe('rgb(255, 255, 255)');
    expect(style['--color--ink']).toBe('rgb(52, 54, 58)');
    expect(style['--color--feedback-fail--ink']).toBe('rgb(255, 94, 73)');

    // No RGB components for semantic tokens
    expect(style['--color--surface-rgb-components']).toBeUndefined();
    expect(style['--color--ink-rgb-components']).toBeUndefined();
  });

  it('works when semanticColorTokensTheme is undefined', () => {
    const style = generateStyleFromCtx(baseCtx as any) as any;

    expect(style['--primary-color']).toBe('rgb(0, 76, 209)');
    // Should not throw, no semantic token variables present
    expect(style['--color--surface']).toBeUndefined();
  });

  it('works when semanticColorTokensTheme is an empty object', () => {
    const ctx = {
      ...baseCtx,
      semanticColorTokensTheme: {},
    };

    const style = generateStyleFromCtx(ctx as any) as any;

    expect(style['--primary-color']).toBe('rgb(0, 76, 209)');
    const semanticKeys = Object.keys(style).filter((k: string) => k.startsWith('--color--'));
    expect(semanticKeys).toHaveLength(0);
  });

  it('handles unknown future tokens via the Record<string, string> signature', () => {
    const ctx = {
      ...baseCtx,
      semanticColorTokensTheme: {
        colorSomeFutureToken: 'rgb(100, 200, 50)',
      },
    };

    const style = generateStyleFromCtx(ctx as any) as any;

    // Unknown tokens fall back to camelToDash (single-dash)
    expect(style['--color-some-future-token']).toBe('rgb(100, 200, 50)');
  });
});
