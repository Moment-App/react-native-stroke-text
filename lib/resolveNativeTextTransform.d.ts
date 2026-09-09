import type { StrokeTextTransform } from './specs/StrokeTextView.nitro';
/**
 * Keep the Fabric host prop concrete across text-measurement state changes.
 * React Native represents a removed prop as null during native updates, while
 * Nitro's optional enum converter accepts undefined but rejects null.
 */
export declare function resolveNativeTextTransform(effectiveTextTransform: StrokeTextTransform | undefined, hasMeasuredNativeText: boolean): StrokeTextTransform;
