import type { CSSProperties } from 'react';
import { BaseCtx } from '../Canvas';

function camelToDash(str: string) {
  if (str === str.toLowerCase()) {
    return str;
  }
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/**
 * Maps camelCase semantic token keys to their CSS custom property names
 * (without the `--` prefix). The CSS names preserve the double-dash
 * namespace separators used by the host application.
 */
const semanticTokenCssNames: Record<string, string> = {
  /* --- Standalone --- */
  colorSurface: 'color--surface',
  colorSurfaceHover: 'color--surface-hover',
  colorSurfaceMuted: 'color--surface-muted',
  colorInk: 'color--ink',
  colorInkSubtle: 'color--ink-subtle',
  colorInkHover: 'color--ink-hover',
  colorInkMuted: 'color--ink-muted',
  colorInkPlaceholder: 'color--ink-placeholder',
  colorInkPrimary: 'color--ink-primary',
  colorInkAccent: 'color--ink-accent',
  colorInkDisabled: 'color--ink-disabled',
  colorBorder: 'color--border',
  colorBorderHover: 'color--border-hover',

  /* --- Context: raised --- */
  colorRaisedSurface: 'color--raised--surface',
  colorRaisedSurfaceHover: 'color--raised--surface-hover',
  colorRaisedSurfaceActive: 'color--raised--surface-active',

  /* --- Context: primary --- */
  colorPrimarySurface: 'color--primary--surface',
  colorPrimarySurfaceHover: 'color--primary--surface-hover',
  colorPrimarySurfaceActive: 'color--primary--surface-active',
  colorPrimarySurfaceMuted: 'color--primary--surface-muted',
  colorPrimaryInk: 'color--primary--ink',
  colorPrimaryBorder: 'color--primary--border',

  /* --- Context: tinted --- */
  colorTintedSurface: 'color--tinted--surface',
  colorTintedSurfaceHover: 'color--tinted--surface-hover',
  colorTintedSurfaceActive: 'color--tinted--surface-active',
  colorTintedInk: 'color--tinted--ink',

  /* --- Context: accent --- */
  colorAccentSurface: 'color--accent--surface',
  colorAccentInk: 'color--accent--ink',

  /* --- Context: selected --- */
  colorSelectedSurface: 'color--selected--surface',
  colorSelectedInk: 'color--selected--ink',
  colorSelectedBorder: 'color--selected--border',

  /* --- Context: disabled --- */
  colorDisabledSurface: 'color--disabled--surface',
  colorDisabledInk: 'color--disabled--ink',

  /* --- Context: danger --- */
  colorDangerSurface: 'color--danger--surface',
  colorDangerInk: 'color--danger--ink',

  /* --- Context: enterprise --- */
  colorEnterpriseSurface: 'color--enterprise--surface',

  /* --- Context: focus --- */
  colorFocusBorder: 'color--focus--border',
  colorFocusOutline: 'color--focus--outline',

  /* --- Feedback --- */
  colorFeedbackFailInk: 'color--feedback-fail--ink',
  colorFeedbackFailBorder: 'color--feedback-fail--border',
  colorFeedbackFailOutline: 'color--feedback-fail--outline',
  colorFeedbackWarningInk: 'color--feedback-warning--ink',
  colorFeedbackWarningSurface: 'color--feedback-warning--surface',
  colorFeedbackSuccessInk: 'color--feedback-success--ink',
  colorFeedbackWarningBorder: 'color--feedback-warning--border',
  colorFeedbackSuccessBorder: 'color--feedback-success--border',

  /* --- Context: highlight --- */
  colorHighlightSurface: 'color--highlight--surface',

  /* --- Diffs --- */
  colorDiffAddedSurface: 'color--diff-added--surface',
  colorDiffRemovedSurface: 'color--diff-removed--surface',
  colorDiffChangedSurface: 'color--diff-changed--surface',
  colorDiffAddedSurfaceSubtle: 'color--diff-added--surface-subtle',
  colorDiffRemovedSurfaceSubtle: 'color--diff-removed--surface-subtle',
  colorDiffChangedSurfaceSubtle: 'color--diff-changed--surface-subtle',
  colorDiffAddedOutlineSubtle: 'color--diff-added--outline-subtle',
  colorDiffRemovedOutlineSubtle: 'color--diff-removed--outline-subtle',
  colorDiffChangedOutlineSubtle: 'color--diff-changed--outline-subtle',
  colorDiffChangedBorder: 'color--diff-changed--border',
  colorDiffChangedBorderNegative: 'color--diff-changed--border-negative',

  /* --- Status --- */
  colorStatusDraftInk: 'color--status-draft--ink',
  colorStatusOutdatedInk: 'color--status-outdated--ink',
  colorStatusPublishedInk: 'color--status-published--ink',

  /* --- Backdrop --- */
  colorBackdropSurface: 'color--backdrop--surface',
  colorBackdropInk: 'color--backdrop--ink',

  /* --- Overlay --- */
  colorOverlaySurface: 'color--overlay--surface',
  colorOverlaySurfaceSubtle: 'color--overlay--surface-subtle',
  colorOverlayInk: 'color--overlay--ink',

  /* --- Stacked --- */
  colorStackedSurfaceBase: 'color--stacked--surface-base',
  colorStackedSurface: 'color--stacked--surface',
  colorStackedSurfaceRaised: 'color--stacked--surface-raised',
  colorStackedInk: 'color--stacked--ink',
  colorStackedInkSubtle: 'color--stacked--ink-subtle',
  colorStackedBorder: 'color--stacked--border',
  colorStackedSurfaceHover: 'color--stacked--surface-hover',
  colorStackedSurfaceTranslucent: 'color--stacked--surface-translucent',
  colorStackedSurfaceButton: 'color--stacked--surface-button',
  colorStackedSurfaceButtonActive: 'color--stacked--surface-button-active',

  /* --- Progress --- */
  colorProgressTrack: 'color--progress--track',
  colorProgressFill: 'color--progress--fill',
  colorProgressFillHover: 'color--progress--fill-hover',

  /* --- Tooltip --- */
  colorTooltipSurface: 'color--tooltip--surface',
  colorTooltipSurfaceHover: 'color--tooltip--surface-hover',
  colorTooltipInk: 'color--tooltip--ink',
  colorTooltipInkSubtle: 'color--tooltip--ink-subtle',

  /* --- Code --- */
  colorCodeSurface: 'color--code--surface',
  colorCodeInk: 'color--code--ink',

  /* --- Shadows --- */
  colorShadowSubtle: 'color--shadow-subtle',
  colorShadow: 'color--shadow',
  colorShadowStrong: 'color--shadow-strong',

  /* --- Scrollbar --- */
  colorScrollbar: 'color--scrollbar',

  /* --- Shadow composites --- */
  shadowElevated: 'shadow--elevated',
  shadowFloat: 'shadow--float',
  shadowAmbient: 'shadow--ambient',
};

export function generateStyleFromCtx(
  ctx: BaseCtx,
  noBodyPadding = false,
): CSSProperties {
  return {
    padding: noBodyPadding
      ? undefined
      : ctx.bodyPadding.map((p) => `${p}px`).join(' '),
    ...Object.fromEntries(
      Object.entries(ctx.theme).flatMap(([k, v]) => [
        [`--${camelToDash(k)}`, v],
        [
          `--${camelToDash(`${k}RgbComponents`)}`,
          v.match(/rgb\((\d+, \d+, \d+)\)/)?.[1] || undefined,
        ],
      ]),
    ),
    ...(ctx.semanticColorTokensTheme
      ? Object.fromEntries(
          Object.entries(ctx.semanticColorTokensTheme).map(([k, v]) => [
            `--${semanticTokenCssNames[k] ?? camelToDash(k)}`,
            v,
          ]),
        )
      : undefined),
  };
}
