export default function times(n: number): number[] {
  return Array.from({ length: n }, (_, index) => index);
}
