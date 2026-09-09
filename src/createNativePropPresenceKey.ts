export function normalizeNativeOptionalProps<
  T extends Readonly<Record<string, unknown>>,
>(props: T): T {
  return Object.fromEntries(
    Object.entries(props).map(([propName, value]) => [
      propName,
      value ?? undefined,
    ])
  ) as T
}

export function createNativePropPresenceKey(
  props: Readonly<Record<string, unknown>>
): string {
  return Object.keys(props)
    .sort()
    .map((propName) => (props[propName] == null ? '0' : '1'))
    .join('')
}
