import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { callback, getHostComponent } from 'react-native-nitro-modules';
import StrokeTextViewConfig from '../nitrogen/generated/shared/json/StrokeTextViewConfig.json';
import { createNativePropPresenceKey, normalizeNativeOptionalProps, } from './createNativePropPresenceKey';
import { resolveNativeTextTransform } from './resolveNativeTextTransform';
const NativeStrokeTextView = getHostComponent('StrokeTextView', () => StrokeTextViewConfig);
function resolveText(text, children) {
    if (typeof text === 'string')
        return text;
    if (typeof children === 'string')
        return children;
    return '';
}
function toNumber(value) {
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
function firstNumber(...values) {
    for (const value of values) {
        const n = toNumber(value);
        if (n != null)
            return n;
    }
    return undefined;
}
function toNativeMeasuredLineText(line) {
    return line.text.replace(/ /g, '\u00a0');
}
function toNativeMeasuredText(lines) {
    if (lines.length === 0)
        return undefined;
    let result = '';
    lines.forEach((line, index) => {
        const lineText = toNativeMeasuredLineText(line);
        result += lineText;
        if (index < lines.length - 1 && !lineText.endsWith('\n')) {
            result += '\n';
        }
    });
    return result;
}
function toFontWeightString(value) {
    if (typeof value === 'string')
        return value;
    if (typeof value === 'number')
        return `${value}`;
    return undefined;
}
function toColorString(value) {
    if (typeof value === 'string')
        return value;
    if (typeof value === 'number') {
        const c = value >>> 0;
        const a = ((c >>> 24) & 0xff) / 255;
        const r = (c >>> 16) & 0xff;
        const g = (c >>> 8) & 0xff;
        const b = c & 0xff;
        return `rgba(${r},${g},${b},${a})`;
    }
    return undefined;
}
function toTextAlignVertical(value) {
    return value === 'auto' ||
        value === 'top' ||
        value === 'bottom' ||
        value === 'center'
        ? value
        : undefined;
}
function warnOnInvalidChildren(children) {
    if (!__DEV__)
        return;
    if (children == null)
        return;
    if (typeof children === 'string')
        return;
    // eslint-disable-next-line no-console
    console.warn('[StrokeText] Children must be a string. Use the `text` prop instead.');
}
export function StrokeText({ text, children, style, hybridRef, ...rest }) {
    warnOnInvalidChildren(children);
    const resolvedText = resolveText(text, children);
    const flattened = StyleSheet.flatten(style);
    const { padding, paddingVertical, paddingHorizontal, paddingTop, paddingRight, paddingBottom, paddingLeft, ...nativeProps } = rest;
    const { color: styleColor, fontSize: styleFontSize, fontWeight: styleFontWeight, fontFamily: styleFontFamily, fontStyle: styleFontStyle, lineHeight: styleLineHeight, letterSpacing: styleLetterSpacing, textAlign: styleTextAlign, textAlignVertical: styleTextAlignVertical, verticalAlign: styleVerticalAlign, textDecorationLine: styleTextDecorationLine, textTransform: styleTextTransform, opacity: styleOpacity, includeFontPadding: styleIncludeFontPadding, padding: stylePadding, paddingVertical: stylePaddingVertical, paddingHorizontal: stylePaddingHorizontal, paddingTop: stylePaddingTop, paddingRight: stylePaddingRight, paddingBottom: stylePaddingBottom, paddingLeft: stylePaddingLeft, ...containerStyle } = flattened ?? {};
    const strokeWidth = Math.max(0, nativeProps.strokeWidth ?? 0);
    const strokeInset = Math.ceil(strokeWidth) / 2;
    const baseTop = firstNumber(paddingTop, stylePaddingTop, paddingVertical, stylePaddingVertical, padding, stylePadding) ?? 0;
    const baseRight = firstNumber(paddingRight, stylePaddingRight, paddingHorizontal, stylePaddingHorizontal, padding, stylePadding) ?? 0;
    const baseBottom = firstNumber(paddingBottom, stylePaddingBottom, paddingVertical, stylePaddingVertical, padding, stylePadding) ?? 0;
    const baseLeft = firstNumber(paddingLeft, stylePaddingLeft, paddingHorizontal, stylePaddingHorizontal, padding, stylePadding) ?? 0;
    const effectiveNumberOfLines = nativeProps.numberOfLines != null && nativeProps.numberOfLines > 0
        ? nativeProps.numberOfLines
        : undefined;
    const effectiveEllipsizeMode = effectiveNumberOfLines == null
        ? undefined
        : nativeProps.ellipsizeMode ?? 'tail';
    const mappedTextAlignVerticalFromVerticalAlign = styleVerticalAlign === 'middle'
        ? 'center'
        : toTextAlignVertical(styleVerticalAlign);
    const effectiveTextAlignVertical = nativeProps.textAlignVertical ??
        toTextAlignVertical(styleTextAlignVertical) ??
        mappedTextAlignVerticalFromVerticalAlign;
    const effectiveIncludeFontPadding = nativeProps.includeFontPadding ?? styleIncludeFontPadding ?? true;
    const effectiveFontWeight = nativeProps.fontWeight ?? toFontWeightString(styleFontWeight);
    const effectiveFontSize = nativeProps.fontSize ?? toNumber(styleFontSize);
    const effectiveFontFamily = nativeProps.fontFamily ?? styleFontFamily;
    const effectiveFontStyle = nativeProps.fontStyle ?? styleFontStyle;
    const effectiveLineHeight = nativeProps.lineHeight ?? toNumber(styleLineHeight);
    const effectiveLetterSpacing = nativeProps.letterSpacing ?? toNumber(styleLetterSpacing);
    const effectiveTextAlign = nativeProps.textAlign ?? styleTextAlign;
    const effectiveTextDecorationLine = nativeProps.textDecorationLine ?? styleTextDecorationLine;
    const effectiveTextTransform = nativeProps.textTransform ?? styleTextTransform;
    const effectiveColor = nativeProps.color ?? toColorString(styleColor);
    const shouldSyncMeasuredLineBreaks = Platform.OS === 'android' && effectiveNumberOfLines == null;
    const [measuredNativeText, setMeasuredNativeText] = React.useState(undefined);
    const nativeText = measuredNativeText ?? resolvedText;
    const nativeTextTransform = resolveNativeTextTransform(effectiveTextTransform, measuredNativeText != null);
    // RN's hidden Text owns measurement, but Android TextView gets its own layout pass.
    // Compensate for the native stroke inset on every edge, then give that native
    // pass extra right-side room so one-pixel/font-metric drift cannot turn an RN
    // single line into a native soft wrap.
    const nativeOverlayInset = Platform.OS === 'android' && strokeInset > 0 ? strokeInset : 0;
    const nativeOverlayRightInset = nativeOverlayInset > 0 ? nativeOverlayInset * 2 : 0;
    const wrappedHybridRef = React.useMemo(() => (hybridRef ? callback(hybridRef) : undefined), [hybridRef]);
    const nativeOptionalProps = normalizeNativeOptionalProps({
        color: effectiveColor,
        strokeColor: nativeProps.strokeColor,
        strokeWidth,
        fontSize: effectiveFontSize,
        fontWeight: effectiveFontWeight,
        fontFamily: effectiveFontFamily,
        fontStyle: effectiveFontStyle,
        lineHeight: effectiveLineHeight,
        letterSpacing: effectiveLetterSpacing,
        textAlign: effectiveTextAlign,
        textAlignVertical: effectiveTextAlignVertical,
        textDecorationLine: effectiveTextDecorationLine,
        textTransform: nativeTextTransform,
        opacity: nativeProps.opacity ?? toNumber(styleOpacity),
        allowFontScaling: nativeProps.allowFontScaling,
        maxFontSizeMultiplier: nativeProps.maxFontSizeMultiplier,
        includeFontPadding: effectiveIncludeFontPadding,
        numberOfLines: effectiveNumberOfLines ?? 0,
        ellipsizeMode: effectiveEllipsizeMode ?? 'tail',
        padding: undefined,
        paddingVertical: undefined,
        paddingHorizontal: undefined,
        paddingTop: baseTop,
        paddingRight: baseRight,
        paddingBottom: baseBottom,
        paddingLeft: baseLeft,
        hybridRef: wrappedHybridRef,
    });
    // Fabric encodes a removed view prop as null, but Nitro's optional converter
    // accepts only undefined. Remount the native host when any optional
    // prop changes definedness so Fabric never sends a value-to-null update.
    const nativePropPresenceKey = createNativePropPresenceKey(nativeOptionalProps);
    React.useEffect(() => {
        setMeasuredNativeText(undefined);
    }, [
        resolvedText,
        effectiveNumberOfLines,
        effectiveEllipsizeMode,
        effectiveFontSize,
        effectiveFontWeight,
        effectiveFontFamily,
        effectiveFontStyle,
        effectiveLineHeight,
        effectiveLetterSpacing,
        effectiveTextAlign,
        effectiveTextAlignVertical,
        effectiveTextDecorationLine,
        effectiveTextTransform,
        effectiveIncludeFontPadding,
        baseTop,
        baseRight,
        baseBottom,
        baseLeft,
        strokeInset,
    ]);
    const handleTextLayout = React.useCallback((event) => {
        if (!shouldSyncMeasuredLineBreaks)
            return;
        const lineCount = event.nativeEvent.lines.length;
        if (lineCount <= 1) {
            setMeasuredNativeText((currentText) => currentText == null ? currentText : undefined);
            return;
        }
        const nextText = toNativeMeasuredText(event.nativeEvent.lines);
        if (nextText == null)
            return;
        const nextMeasuredNativeText = nextText === resolvedText ? undefined : nextText;
        setMeasuredNativeText((currentText) => currentText === nextMeasuredNativeText
            ? currentText
            : nextMeasuredNativeText);
    }, [resolvedText, shouldSyncMeasuredLineBreaks]);
    const measurerTextStyle = React.useMemo(() => ({
        color: effectiveColor,
        fontSize: effectiveFontSize,
        fontWeight: effectiveFontWeight,
        fontFamily: effectiveFontFamily,
        fontStyle: effectiveFontStyle,
        lineHeight: effectiveLineHeight,
        letterSpacing: effectiveLetterSpacing,
        textAlign: effectiveTextAlign,
        textAlignVertical: effectiveTextAlignVertical,
        textDecorationLine: effectiveTextDecorationLine,
        textTransform: effectiveTextTransform,
        includeFontPadding: effectiveIncludeFontPadding,
    }), [
        effectiveColor,
        effectiveFontSize,
        effectiveFontWeight,
        effectiveFontFamily,
        effectiveFontStyle,
        effectiveLineHeight,
        effectiveLetterSpacing,
        effectiveTextAlign,
        effectiveTextAlignVertical,
        effectiveTextDecorationLine,
        effectiveTextTransform,
        effectiveIncludeFontPadding,
    ]);
    return (React.createElement(View, { style: [styles.container, containerStyle] },
        React.createElement(Text, { accessible: false, pointerEvents: "none", numberOfLines: effectiveNumberOfLines, ellipsizeMode: effectiveEllipsizeMode, onTextLayout: handleTextLayout, allowFontScaling: nativeProps.allowFontScaling, maxFontSizeMultiplier: nativeProps.maxFontSizeMultiplier, style: [
                measurerTextStyle,
                // The hidden RN Text is the layout source of truth, so reserve the same
                // inset that the native TextView uses to keep the outline inside bounds.
                {
                    paddingTop: baseTop + strokeInset,
                    paddingRight: baseRight + strokeInset,
                    paddingBottom: baseBottom + strokeInset,
                    paddingLeft: baseLeft + strokeInset,
                },
                styles.hiddenText,
            ] }, resolvedText),
        React.createElement(NativeStrokeTextView, { key: nativePropPresenceKey, text: nativeText, ...nativeOptionalProps, pointerEvents: "none", style: [
                styles.overlay,
                nativeOverlayInset > 0
                    ? {
                        top: -nativeOverlayInset,
                        right: -nativeOverlayRightInset,
                        bottom: -nativeOverlayInset,
                        left: -nativeOverlayInset,
                    }
                    : null,
            ] })));
}
const styles = StyleSheet.create({
    container: {},
    overlay: {
        ...StyleSheet.absoluteFill,
    },
    hiddenText: {
        opacity: 0,
    },
});
