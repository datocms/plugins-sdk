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

  it('applies semantic color tokens verbatim, keyed by their CSS variable name', () => {
    const ctx = {
      ...baseCtx,
      semanticColorTokensTheme: {
        '--color--surface': 'rgb(255, 255, 255)',
        '--color--ink': 'rgb(52, 54, 58)',
        '--color--ink-danger': 'rgb(255, 94, 73)',
        '--shadow--raised': '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
    };

    const style = generateStyleFromCtx(ctx as any) as any;

    expect(style['--color--surface']).toBe('rgb(255, 255, 255)');
    expect(style['--color--ink']).toBe('rgb(52, 54, 58)');
    expect(style['--color--ink-danger']).toBe('rgb(255, 94, 73)');
    expect(style['--shadow--raised']).toBe('0 1px 2px rgba(0, 0, 0, 0.1)');

    // Semantic tokens are passed through as-is — no RGB-component derivation.
    expect(style['--color--surface-rgb-components']).toBeUndefined();
    expect(style['--color--ink-rgb-components']).toBeUndefined();
  });

  it('works when semanticColorTokensTheme is undefined', () => {
    const { semanticColorTokensTheme, ...ctx } = baseCtx;
    const style = generateStyleFromCtx(ctx as any) as any;

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
    const semanticKeys = Object.keys(style).filter((k: string) =>
      k.startsWith('--color--'),
    );
    expect(semanticKeys).toHaveLength(0);
  });

  it('forwards arbitrary host tokens the SDK has never heard of', () => {
    const ctx = {
      ...baseCtx,
      semanticColorTokensTheme: {
        '--color--brand-new--surface': 'rgb(100, 200, 50)',
      },
    };

    const style = generateStyleFromCtx(ctx as any) as any;

    // The SDK keeps no token list: whatever the host sends is applied as-is.
    expect(style['--color--brand-new--surface']).toBe('rgb(100, 200, 50)');
  });
});
