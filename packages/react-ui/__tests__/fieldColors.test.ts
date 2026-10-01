// The repo's @types/node predates the `node:` specifiers
// biome-ignore lint/style/useNodejsImportProtocol: see above
import { readFileSync } from 'fs';
// biome-ignore lint/style/useNodejsImportProtocol: see above
import { fileURLToPath } from 'url';
import postcss, { type Rule } from 'postcss';
import postcssNested from 'postcss-nested';
import type { CSSObjectWithLabel, Theme } from 'react-select';
import { buildStyles, themeConfig } from '../src/SelectInput/theme';

const disabledFieldSurface =
  'var(--color--disabled-field--surface, var(--color--disabled--surface))';
const disabledFieldInk =
  'var(--color--disabled-field--ink, var(--color--disabled--ink))';
const disabledFieldInkPlaceholder =
  'var(--color--disabled-field--ink-placeholder, var(--color--ink-placeholder))';

/** react-select's own default theme, as passed to a `ThemeConfig` function. */
const reactSelectDefaultTheme: Theme = {
  borderRadius: 4,
  colors: {
    primary: '#2684FF',
    primary75: '#4C9AFF',
    primary50: '#B2D4FF',
    primary25: '#DEEBFF',
    danger: '#DE350B',
    dangerLight: '#FFBDAD',
    neutral0: 'hsl(0, 0%, 100%)',
    neutral5: 'hsl(0, 0%, 95%)',
    neutral10: 'hsl(0, 0%, 90%)',
    neutral20: 'hsl(0, 0%, 80%)',
    neutral30: 'hsl(0, 0%, 70%)',
    neutral40: 'hsl(0, 0%, 60%)',
    neutral50: 'hsl(0, 0%, 50%)',
    neutral60: 'hsl(0, 0%, 40%)',
    neutral70: 'hsl(0, 0%, 30%)',
    neutral80: 'hsl(0, 0%, 20%)',
    neutral90: 'hsl(0, 0%, 10%)',
  },
  spacing: { baseUnit: 4, controlHeight: 38, menuGutter: 8 },
};

// The style functions only read the state flags below; the rest of
// react-select's state object is irrelevant to the colors under test.
const callStyle = (key: string, state: Record<string, unknown>, styles: any) =>
  styles[key]({} as CSSObjectWithLabel, state) as Record<string, unknown>;

describe('SelectInput themeConfig', () => {
  const { colors, borderRadius } = themeConfig(reactSelectDefaultTheme);

  it('maps every palette slot react-select reads to a DatoCMS token, like the CMS', () => {
    expect(borderRadius).toBe(0);
    expect(colors).toMatchObject({
      neutral0: 'var(--color--surface-raised)',
      neutral10: disabledFieldSurface,
      neutral20: 'var(--color--border)',
      neutral30: 'var(--color--border-hover)',
      neutral40: 'var(--color--ink-disabled)',
      neutral80: 'var(--color--ink)',
      primary: 'var(--color--focus--border)',
      primary25: 'var(--color--surface-raised-hover)',
    });
  });

  it('leaves no slot it maps on a hardcoded react-select grey', () => {
    for (const slot of [
      'neutral0',
      'neutral10',
      'neutral40',
      'neutral80',
    ] as const) {
      expect(colors[slot]).toMatch(/^var\(--color--/);
    }
  });
});

describe('SelectInput styles', () => {
  const permutations = [false, true].flatMap((isDisabled) =>
    [false, true].flatMap((error) =>
      [false, true].map((isFocused) => ({ isDisabled, error, isFocused })),
    ),
  );

  it.each(permutations)(
    'control: disabled=$isDisabled error=$error focused=$isFocused',
    ({ isDisabled, error, isFocused }) => {
      const control = callStyle(
        'control',
        { isFocused, isDisabled },
        buildStyles(isDisabled, error),
      );

      expect(control.backgroundColor).toBe(
        isDisabled ? disabledFieldSurface : 'var(--color--surface-raised)',
      );
      expect(control.borderColor).toBe(
        error
          ? 'var(--color--danger-soft--border)'
          : isFocused
            ? 'var(--color--focus--border)'
            : 'var(--color--border)',
      );
      expect(control.boxShadow).toBe(
        isFocused
          ? `0 0 0 4px var(--color--${
              error ? 'danger-soft' : 'focus'
            }--outline)`
          : undefined,
      );
      expect(control.minHeight).toBe(40);
    },
  );

  it.each([false, true])('placeholder: disabled=%s', (isDisabled) => {
    const placeholder = callStyle('placeholder', { isDisabled }, buildStyles());

    expect(placeholder.color).toBe(
      isDisabled
        ? disabledFieldInkPlaceholder
        : 'var(--color--ink-placeholder)',
    );
  });

  it.each([false, true])('singleValue: disabled=%s', (isDisabled) => {
    const singleValue = callStyle('singleValue', { isDisabled }, buildStyles());

    expect(singleValue.color).toBe(
      isDisabled ? disabledFieldInk : 'var(--color--ink)',
    );
  });

  it.each([
    { isSelected: false, isFocused: false, expected: undefined },
    {
      isSelected: false,
      isFocused: true,
      expected: 'var(--color--surface-raised-hover)',
    },
    {
      isSelected: true,
      isFocused: false,
      expected: 'var(--color--selected--surface)',
    },
    {
      isSelected: true,
      isFocused: true,
      expected: 'var(--color--selected--surface)',
    },
  ])(
    'option: selected=$isSelected focused=$isFocused',
    ({ isSelected, isFocused, expected }) => {
      const option = callStyle(
        'option',
        { isSelected, isFocused },
        buildStyles(),
      );

      expect(option.backgroundColor).toBe(expected);
      expect(option.color).toBe('var(--color--ink)');
    },
  );
});

/** Flattens a CSS module's nesting and returns its declarations by selector. */
const declarationsBySelector = (component: string) => {
  const source = readFileSync(
    fileURLToPath(
      new URL(`../src/${component}/styles.module.css`, import.meta.url).href,
    ),
    'utf8',
  );
  const root = postcss([postcssNested]).process(source, {
    from: undefined,
  }).root;
  const result: Record<string, Record<string, string>> = {};

  root.walkRules((rule: Rule) => {
    result[rule.selector] ??= {};
    rule.walkDecls((decl) => {
      result[rule.selector][decl.prop] = decl.value.replace(/\s+/g, ' ');
    });
  });

  return result;
};

/** Collapses `var( a, b )` whitespace the formatter adds across lines. */
const normalize = (value: string) =>
  value.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');

describe.each(['TextInput', 'TextareaInput'])('%s disabled colors', (name) => {
  const rules = declarationsBySelector(name);
  const disabled = rules[`.${name}--disabled`];

  it('uses the disabled-field surface and ink, with fallbacks', () => {
    expect(normalize(disabled.background)).toBe(disabledFieldSurface);
    expect(normalize(disabled.color)).toBe(disabledFieldInk);
    expect(disabled['border-color']).toBe('var(--color--border)');
  });

  it('dims the placeholder of an empty disabled field', () => {
    expect(normalize(rules[`.${name}--disabled::placeholder`].color)).toBe(
      disabledFieldInkPlaceholder,
    );
  });

  it('keeps the border static on hover, like the CMS', () => {
    expect(rules[`.${name}--disabled:hover`]['border-color']).toBe(
      'var(--color--border)',
    );
  });

  it('declares disabled overrides after the base rules, so they win the tie', () => {
    const selectors = Object.keys(rules);

    for (const pseudo of ['::placeholder', ':hover']) {
      expect(selectors.indexOf(`.${name}--disabled${pseudo}`)).toBeGreaterThan(
        selectors.indexOf(`.${name}${pseudo}`),
      );
    }
  });
});
