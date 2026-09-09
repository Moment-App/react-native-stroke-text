/**
 * Keep the Fabric host prop concrete across text-measurement state changes.
 * React Native represents a removed prop as null during native updates, while
 * Nitro's optional enum converter accepts undefined but rejects null.
 */
export function resolveNativeTextTransform(effectiveTextTransform, hasMeasuredNativeText) {
    return hasMeasuredNativeText ? 'none' : (effectiveTextTransform ?? 'none');
}
