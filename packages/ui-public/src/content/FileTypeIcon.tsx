import React from 'react';
import generateColorMapper from '../color/generateColorMapper';

const extensionColorFor = generateColorMapper([
  '#e8573b',
  '#62beeb',
  '#88bd51',
  '#9d65ac',
  '#f1b83e',
  '#596c7f',
]);

export type FileTypeIconProps = {
  /** The extension of the file, for example "vtt". Without it, the icon is blank. */
  extension?: string;
  style?: React.CSSProperties;
  className?: string;
};

/**
 * The icon of a file, with its extension on a color of the extension. It is
 * hidden from screen readers: put the name of the file near it.
 */
const FileTypeIcon = ({ extension, style, className }: FileTypeIconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    style={style}
    width="448"
    height="512"
    viewBox="0 0 448 512"
  >
    <g id="Page-1" fill="none" fillRule="evenodd">
      <g id="337946" fillRule="nonzero">
        <path
          d="M96,0 C78.4,0 64,14.4 64,32 L64,480 C64,497.6 78.4,512 96,512 L416,512 C433.6,512 448,497.6 448,480 L448,128 L320,0 L96,0 Z"
          fill="#E2E5E7"
        />
        <path
          d="M352,128 L448,128 L320,0 L320,96 C320,113.6 334.4,128 352,128 Z"
          fill="#B0B7BD"
        />
        {extension && (
          <>
            <polygon fill="#CAD1D8" points="448 224 352 128 448 128" />
            <path
              d="M384,416 C384,424.8 376.8,432 368,432 L16,432 C7.2,432 0,424.8 0,416 L0,256 C0,247.2 7.2,240 16,240 L368,240 C376.8,240 384,247.2 384,256 L384,416 Z"
              fill={extensionColorFor(extension.toUpperCase())}
            />
            <path
              d="M368,432 L64,432 L64,448 L368,448 C376.8,448 384,440.8 384,432 L384,416 C384,424.8 376.8,432 368,432 Z"
              fill="#CAD1D8"
            />
          </>
        )}
        {extension && (
          <text
            fontSize="100"
            style={{
              fontFamily: 'var(--base-font-family)',
              fontWeight: 'var(--font-weight-strong)',
            }}
            letterSpacing="2.14285779"
            fill="#FFFFFF"
          >
            <tspan x="48.0088157" y="361">
              {extension.slice(0, 4).toUpperCase()}
            </tspan>
          </text>
        )}
      </g>
    </g>
  </svg>
);

export default FileTypeIcon;
