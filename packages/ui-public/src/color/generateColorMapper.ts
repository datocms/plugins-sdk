export default function generateColorMapper<T extends string>(
  colors: readonly T[],
): (name: string) => T {
  return (name) =>
    colors[
      Array.from(name)
        .map((e) => e.charCodeAt(0))
        .reduce((acc, code) => acc + code, 0) % colors.length
    ];
}
