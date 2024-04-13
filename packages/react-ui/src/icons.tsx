import React, { type CSSProperties } from 'react';

export type IconProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
};

export function BackIcon({
  width = '1em',
  height = '1em',
  style,
  className,
}: IconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 512"
      width={width}
      height={height}
      style={style}
      className={className}
    >
      <path d="M238.475 475.535l7.071-7.07c4.686-4.686 4.686-12.284 0-16.971L50.053 256 245.546 60.506c4.686-4.686 4.686-12.284 0-16.971l-7.071-7.07c-4.686-4.686-12.284-4.686-16.97 0L10.454 247.515c-4.686 4.686-4.686 12.284 0 16.971l211.051 211.05c4.686 4.686 12.284 4.686 16.97-.001z" />
    </svg>
  );
}

export function SidebarLeftArrowIcon({
  width = '1em',
  height = '1em',
  style,
  className,
}: IconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      width={width}
      height={height}
      style={style}
      className={className}
    >
      <path d="M152 412.5L3.5 264.5c-4.7-4.7-4.7-12.3 0-17L152 99.5c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L60.1 239H372c6.6 0 12 5.4 12 12v10c0 6.6-5.4 12-12 12H60.1L176 388.4c4.7 4.7 4.7 12.3 0 17l-7.1 7.1c-4.6 4.7-12.2 4.7-16.9 0zM436 64h-8c-6.6 0-12 5.4-12 12v360c0 6.6 5.4 12 12 12h8c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12z" />
    </svg>
  );
}

export function SidebarRightArrowIcon({
  width = '1em',
  height = '1em',
  style,
  className,
}: IconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      width={width}
      height={height}
      style={style}
      className={className}
    >
      <path d="M296 99.5l148.5 148c4.7 4.7 4.7 12.3 0 17L296 412.5c-4.7 4.7-12.3 4.7-17 0l-7.1-7.1c-4.7-4.7-4.7-12.3 0-17l116-115.4H76c-6.6 0-12-5.4-12-12v-10c0-6.6 5.4-12 12-12h311.9L272 123.6c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.6-4.7 12.2-4.7 16.9 0zM12 448h8c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12h-8C5.4 64 0 69.4 0 76v360c0 6.6 5.4 12 12 12z" />
    </svg>
  );
}

export function CaretDownIcon({
  width = '1em',
  height = '1em',
  style,
  className,
}: IconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      width={width}
      height={height}
      style={style}
      className={className}
    >
      <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" />
    </svg>
  );
}

export function CaretUpIcon({
  width = '1em',
  height = '1em',
  style,
  className,
}: IconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      width={width}
      height={height}
      style={style}
      className={className}
    >
      <path d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z" />
    </svg>
  );
}
