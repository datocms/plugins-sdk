import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Status } from '../../icons/index';
import { useTranslation } from '../i18n';
import Tooltip from '../overlays/Tooltip';
/** The solid triangle of a published version that is not valid */
export function InvalidPublishedVersionIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <Status.TriangleExclamationSolidIcon
      className={classNames('ValidityTriangle--published', className)}
    />
  );
}

/** The outline triangle of a current version that is not valid */
export function InvalidCurrentVersionIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <Status.TriangleExclamationIcon
      className={classNames('ValidityTriangle--current', className)}
    />
  );
}

/** A line of the tooltip of a triangle: the icon and its text */
export function HintLine({ children }: { children: ReactNode }) {
  return <p className="ValidityTriangle__hint">{children}</p>;
}

export type ItemValidityTrianglesProps = {
  /** Is the published version valid? Only `false` shows a triangle. */
  publishedValid?: boolean | null | undefined;
  /** Is the current version valid? Only `false` shows a triangle. */
  currentValid?: boolean | null | undefined;
  /**
   * True when the model has a draft mode. Without it, the current version
   * is the published version, thus the current triangle does not show.
   */
  draftModeActive: boolean | null | undefined;
};

export type VersionValidityTriangleProps = {
  /** Is the version valid? Only `false` shows a triangle. */
  isVersionValid: boolean | null | undefined;
  /** True for the published version: the triangle is solid */
  isPublished: boolean;
};

/**
 * The triangles of a record: one for the published version and one for the
 * current version, when they are not valid.
 */
const ItemValidityTriangles = React.memo(
  ({
    publishedValid,
    currentValid,
    draftModeActive,
  }: ItemValidityTrianglesProps) => {
    const { t } = useTranslation();
    if (![publishedValid, currentValid].some((v) => v === false)) return null;

    const triangles = (
      <div className="ValidityTriangle__wrapper">
        {publishedValid === false && <InvalidPublishedVersionIcon />}
        {draftModeActive && currentValid === false && (
          <InvalidCurrentVersionIcon />
        )}
      </div>
    );

    return (
      <Tooltip
        long
        label={
          <>
            {publishedValid === false && (
              <HintLine>
                <InvalidPublishedVersionIcon />
                {t('validityTriangle.published')}
              </HintLine>
            )}
            {draftModeActive && currentValid === false && (
              <HintLine>
                <InvalidCurrentVersionIcon />
                {t('validityTriangle.current')}
              </HintLine>
            )}
          </>
        }
      >
        {triangles}
      </Tooltip>
    );
  },
);

/** The triangle of one version of a record, when it is not valid. */
const VersionValidityTriangle = React.memo(
  ({ isVersionValid, isPublished }: VersionValidityTriangleProps) => {
    const { t } = useTranslation();
    if (isVersionValid !== false) return null;

    const Icon = isPublished
      ? InvalidPublishedVersionIcon
      : InvalidCurrentVersionIcon;

    const content = (
      <div className="ValidityTriangle__wrapper">
        <Icon />
      </div>
    );

    return (
      <Tooltip
        long
        label={
          <HintLine>
            <Icon />
            {t('validityTriangle.invalidVersion')}
          </HintLine>
        }
      >
        {content}
      </Tooltip>
    );
  },
);

export { ItemValidityTriangles, VersionValidityTriangle };
