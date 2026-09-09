export function normalizeNativeOptionalProps(props) {
    return Object.fromEntries(Object.entries(props).map(([propName, value]) => [
        propName,
        value ?? undefined,
    ]));
}
export function createNativePropPresenceKey(props) {
    return Object.keys(props)
        .sort()
        .map((propName) => (props[propName] == null ? '0' : '1'))
        .join('');
}
