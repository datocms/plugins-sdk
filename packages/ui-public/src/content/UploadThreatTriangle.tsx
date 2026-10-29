import React from 'react';
import { Status } from '../../icons/index';
import { useTranslation } from '../i18n';
import Tooltip from '../overlays/Tooltip';
import { HintLine } from './ValidityTriangles';

// A threat shows only an icon, thus the title of the upload stays on one
// line. The tooltip gives the message.
function UploadThreatIcon() {
  return (
    <Status.TriangleExclamationSolidIcon className="ValidityTriangle--threat" />
  );
}

/**
 * The triangle of an upload that the antivirus found infected. Render it
 * only for an infected upload.
 */
const UploadThreatTriangle = React.memo(function UploadThreatTriangle() {
  const { t } = useTranslation();

  return (
    <Tooltip
      long
      label={
        <HintLine>
          <UploadThreatIcon />
          {t('upload.threatDetected')}
        </HintLine>
      }
    >
      <div className="ValidityTriangle__wrapper">
        <UploadThreatIcon />
      </div>
    </Tooltip>
  );
});

export default UploadThreatTriangle;
