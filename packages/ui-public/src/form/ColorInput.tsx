import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RgbaColor as PickerColor,
  RgbaColorPicker,
  RgbColorPicker,
} from 'react-colorful';
import { Generic, UI } from '../../icons/index';
import Button from '../actions/Button';
import { type ColorValue, type RgbaColor } from '../color/types';
import { colorAsHex, parseHexColor, toRgbCss } from '../color/utils';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import Popover from '../overlays/Popover';
import RawButton from '../semantic/RawButton';
import { isDefined } from '../utils/isDefined';
import { type FieldInputProps, useFieldInput } from './FieldWrapper';
import { getEditState } from './getEditState';
import { BaseInputComponentPropsFieldWithReadOnly } from './inputProps';

export type { ColorValue, RgbaColor } from '../color/types';

/**
 * The props of `ColorInput`. The value is an RGBA color, with each channel
 * an integer from 0 to 255, or `null` for no color.
 */
export type ColorInputProps =
  BaseInputComponentPropsFieldWithReadOnly<ColorValue> &
    Omit<FieldInputProps, 'id'> & {
      /**
       * Lets the user change the alpha (the opacity) of the color: the
       * picker shows an alpha slider, and the hex text of a color that is not
       * opaque has 8 digits. A value that is not opaque always shows its
       * alpha, even without this prop.
       * @default false
       */
      alpha?: boolean;
      /**
       * Shows a button that clears the value, when the input has a value. An
       * empty hex text then also clears the value.
       * @default true
       */
      clearable?: boolean;
      /**
       * Gives the field a fixed width that fits a hex value, not the width
       * of its container.
       * @default false
       */
      autosize?: boolean;
      /**
       * The colors that the picker shows under the color area, for one-click
       * picks. Each one is a hex color: `#RGB`, `#RGBA`, `#RRGGBB` or
       * `#RRGGBBAA`. The picker leaves out a text that is not a valid hex
       * color.
       * @example ['#FF5940', '#2F80ED', '#27AE60']
       */
      presetColors?: readonly string[];
      /**
       * The accessible name of the hex text. Give it when the input is not
       * in a `FieldWrapper` with a `label`.
       */
      ariaLabel?: TextMessage;
    };

// TypeScript does not have the types of the EyeDropper API, because only
// the Chromium browsers have it.
type EyeDropperConstructor = new () => {
  open: () => Promise<{ sRGBHex: string }>;
};

function getEyeDropper(): EyeDropperConstructor | undefined {
  return (window as unknown as { EyeDropper?: EyeDropperConstructor })
    .EyeDropper;
}

// The server render has no window. Thus the first render shows no eye
// dropper, and an effect reads the browser after the mount.
function useHasEyeDropper() {
  const [hasEyeDropper, setHasEyeDropper] = useState(false);

  useEffect(() => {
    setHasEyeDropper(Boolean(getEyeDropper()));
  }, []);

  return hasEyeDropper;
}

const BLACK: RgbaColor = { red: 0, green: 0, blue: 0, alpha: 255 };

function toPickerColor(color: RgbaColor): PickerColor {
  return {
    r: color.red,
    g: color.green,
    b: color.blue,
    a: color.alpha / 255,
  };
}

function fromPickerColor(color: Partial<PickerColor>): RgbaColor {
  return {
    red: color.r ?? 0,
    green: color.g ?? 0,
    blue: color.b ?? 0,
    alpha: Math.round((color.a ?? 1) * 255),
  };
}

// See .ColorInput__swatch__color
function swatchStyle(color: RgbaColor) {
  return {
    '--ColorInput-swatch': toRgbCss(color, color.alpha),
  } as React.CSSProperties;
}

function sameColor(a: ColorValue, b: ColorValue) {
  if (!a || !b) {
    return a === b;
  }

  return (
    a.red === b.red &&
    a.green === b.green &&
    a.blue === b.blue &&
    a.alpha === b.alpha
  );
}

function ColorInput({
  value,
  onChange,
  onBlur,
  alpha: alphaProp,
  presetColors,
  clearable = true,
  autosize = false,
  ariaLabel,
  disabled: disabledProp,
  readOnly,
  name,
  ...ariaProps
}: ColorInputProps) {
  const { t, tm } = useTranslation();
  const fieldProps = useFieldInput(ariaProps);
  const { locked, disabled, showsReadOnly, stateClass } = getEditState({
    disabled: disabledProp,
    readOnly,
  });
  const [isOpen, setOpen] = useState(false);
  // The color while the user drags in the picker. The field gets the color
  // only at the end of the drag.
  const [draft, setDraft] = useState<RgbaColor | null>(null);

  // A color that is not opaque keeps its alpha, even when the field does not
  // let the user change the alpha.
  const enableAlpha = Boolean((value && value.alpha !== 255) || alphaProp);

  const formatValue = useCallback(
    (color: ColorValue) => (color ? colorAsHex(color, enableAlpha) : ''),
    [enableAlpha],
  );

  const [hexText, setHexText] = useState(() => formatValue(value));

  useEffect(() => {
    setHexText(formatValue(value));
  }, [value, formatValue]);

  const presets = useMemo(
    () =>
      (presetColors || [])
        .filter((hex) => hex)
        .map((hex) => {
          const color = parseHexColor(hex);
          return color ? { hex, color } : null;
        })
        .filter(isDefined),
    [presetColors],
  );

  const hasEyeDropper = useHasEyeDropper();

  const commit = useCallback(
    (color: ColorValue) => {
      const normalized =
        color && !enableAlpha ? { ...color, alpha: 255 } : color;

      setDraft(null);
      setHexText(formatValue(normalized));

      if (!sameColor(normalized, value)) {
        onChange?.(normalized);
        onBlur?.(normalized);
      }
    },
    [enableAlpha, formatValue, onChange, onBlur, value],
  );

  const close = useCallback(() => {
    if (draft) {
      commit(draft);
    }
    setOpen(false);
  }, [commit, draft]);

  const [fieldElement, setFieldElement] = useState<HTMLDivElement | null>(null);

  function handleToggle() {
    if (isOpen) {
      close();
    } else {
      setOpen(true);
    }
  }

  function handleHexKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
      setOpen(false);
    }
  }

  function handleHexBlur() {
    if (hexText.trim() === '') {
      if (clearable) {
        commit(null);
      } else {
        setHexText(formatValue(value));
      }
      return;
    }

    const color = parseHexColor(hexText);

    if (!color) {
      setHexText(formatValue(value));
      return;
    }

    commit(color);
  }

  function handlePickerChange(color: PickerColor | Omit<PickerColor, 'a'>) {
    const next = fromPickerColor(color);
    setDraft(next);
    setHexText(formatValue(next));
  }

  function handlePickerChangeEnd(color: PickerColor | Omit<PickerColor, 'a'>) {
    commit(fromPickerColor(color));
  }

  async function handleEyeDropper() {
    const EyeDropper = getEyeDropper();

    if (!EyeDropper) {
      return;
    }

    try {
      const result = await new EyeDropper().open();
      const color = parseHexColor(result.sRGBHex);

      if (color) {
        commit(color);
      }
    } catch {
      // The user canceled the pick
    }
  }

  const shownColor = draft || value;
  const { red, green, blue, alpha } = shownColor || BLACK;
  // The picker compares the color that it gets with the last color that it
  // sent, key by key, after each render. Thus the object keeps its identity
  // while the channels do not change, and the picker without alpha gets no
  // alpha key. If not, a render of the parent makes the picker set its state
  // again, and React stops the loop with "Maximum update depth exceeded".
  const pickerColor = useMemo(
    () => toPickerColor({ red, green, blue, alpha }),
    [red, green, blue, alpha],
  );
  const opaquePickerColor = useMemo(
    () => ({ r: red, g: green, b: blue }),
    [red, green, blue],
  );

  return (
    <div
      className={classNames('ColorInput', stateClass, {
        'is-open': isOpen,
        'ColorInput--autosize': autosize,
      })}
    >
      <div
        className={classNames('InputFrame ColorInput__field', stateClass, {
          'is-open': isOpen,
        })}
        ref={setFieldElement}
      >
        <RawButton
          className="InputFrame__control ColorInput__swatch"
          onClick={handleToggle}
          disabled={locked}
          ariaLabel={{ id: 'colorInput.openPicker' }}
          expandable={{ open: isOpen }}
        >
          <span
            className={classNames('ColorInput__swatch__color', {
              'is-empty': !shownColor,
            })}
            style={shownColor ? swatchStyle(shownColor) : undefined}
          />
        </RawButton>
        <input
          {...fieldProps}
          name={name}
          aria-label={ariaLabel ? tm(ariaLabel) : undefined}
          type="text"
          className="InputFrame__input ColorInput__hex"
          value={hexText}
          placeholder={t('colorInput.noColorSet')}
          onChange={(event) => setHexText(event.target.value)}
          onBlur={handleHexBlur}
          onKeyDown={handleHexKeyDown}
          disabled={disabled}
          readOnly={showsReadOnly}
          spellCheck={false}
          autoComplete="off"
        />
        {value && !locked && clearable && (
          <Button
            tone="ghost"
            size="micro"
            iconOnly
            icon={Generic.CloseIcon}
            label={{ id: 'field.clearValue' }}
            className="ColorInput__clear"
            onClick={() => commit(null)}
          />
        )}
      </div>
      {isOpen && !locked && fieldElement && (
        <Popover
          anchorElement={fieldElement}
          placement="bottom-start"
          offset={4}
          onClose={close}
          ariaLabel={{ id: 'colorInput.openPicker' }}
          autoFocus
        >
          <div className="ColorInput__pane">
            <div
              className={classNames('ColorInput__picker-area', {
                'has-alpha': enableAlpha,
                'has-eye-dropper': hasEyeDropper,
              })}
            >
              {enableAlpha ? (
                <RgbaColorPicker
                  className="ColorInput__picker"
                  color={pickerColor}
                  onChange={handlePickerChange}
                  onChangeEnd={handlePickerChangeEnd}
                />
              ) : (
                <RgbColorPicker
                  className="ColorInput__picker"
                  color={opaquePickerColor}
                  onChange={handlePickerChange}
                  onChangeEnd={handlePickerChangeEnd}
                />
              )}
              {hasEyeDropper && (
                <Button
                  tone="ghost"
                  size="micro"
                  iconOnly
                  icon={UI.EyeDropperIcon}
                  label={{ id: 'colorInput.pickFromScreen' }}
                  className="ColorInput__eye-dropper"
                  onClick={handleEyeDropper}
                />
              )}
            </div>
            {presets.length > 0 && (
              <div className="ColorInput__pane__footer">
                {presets.map(({ hex, color }) => (
                  <RawButton
                    key={hex}
                    className={classNames('ColorInput__preset', {
                      'is-selected': sameColor(color, value),
                    })}
                    title={hex}
                    ariaLabel={hex}
                    onClick={() => commit(color)}
                  >
                    <span
                      className="ColorInput__swatch__color"
                      style={swatchStyle(color)}
                    />
                  </RawButton>
                ))}
              </div>
            )}
          </div>
        </Popover>
      )}
    </div>
  );
}

export default React.memo(ColorInput);
