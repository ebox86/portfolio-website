import type { PortableTextBlock } from '@portabletext/types';

const INLINE_CODE_PATTERN = /(`+)([^`]+?)\1/g;

export const addInlineCodeMarks = (value?: PortableTextBlock[]): PortableTextBlock[] | undefined => {
  if (!Array.isArray(value)) {
    return value;
  }

  let keyCounter = 0;

  const createChildKey = (baseKey?: string, suffix?: string) => {
    keyCounter += 1;
    const suffixPart = suffix ? `-${suffix}` : '';
    if (baseKey) {
      return `${baseKey}${suffixPart}-${keyCounter}`;
    }
    return `inline-span${suffixPart}-${keyCounter}`;
  };

  const cloneMarks = (marks?: string[]) => (marks ? [...marks] : undefined);

  const transformSpan = (span: any) => {
    const text = typeof span.text === 'string' ? span.text : '';
    if (!text || span.marks?.includes('code')) {
      return [span];
    }

    const regex = new RegExp(INLINE_CODE_PATTERN.source, INLINE_CODE_PATTERN.flags);
    const segments: any[] = [];
    let lastIndex = 0;
    let matchIndex = 0;
    let match: RegExpExecArray | null = null;

    while ((match = regex.exec(text)) !== null) {
      const matchStart = match.index ?? 0;
      const matchLength = match[0]?.length ?? 0;

      if (matchStart > lastIndex) {
        const leadingText = text.slice(lastIndex, matchStart);
        if (leadingText) {
          segments.push({
            ...span,
            _key: createChildKey(span._key, `text-${matchIndex}`),
            text: leadingText,
            marks: cloneMarks(span.marks),
          });
        }
      }

      const codeSegment = match[2] ?? '';
      if (codeSegment) {
        const codeMarks = cloneMarks(span.marks) ?? [];
        if (!codeMarks.includes('code')) {
          codeMarks.push('code');
        }
        segments.push({
          ...span,
          _key: createChildKey(span._key, `code-${matchIndex}`),
          text: codeSegment,
          marks: codeMarks,
        });
      }

      lastIndex = matchStart + matchLength;
      matchIndex += 1;
    }

    if (segments.length === 0) {
      return [span];
    }

    if (lastIndex < text.length) {
      const trailingText = text.slice(lastIndex);
      if (trailingText) {
        segments.push({
          ...span,
          _key: createChildKey(span._key, 'text-end'),
          text: trailingText,
          marks: cloneMarks(span.marks),
        });
      }
    }

    return segments;
  };

  return value.map((block: PortableTextBlock) => {
    if (!block || block._type !== 'block' || !Array.isArray(block.children)) {
      return block;
    }

    let mutated = false;
    const children: any[] = [];

    block.children.forEach((child: any) => {
      if (!child || child._type !== 'span') {
        children.push(child);
        return;
      }

      const transformed = transformSpan(child);
      if (transformed.length === 1 && transformed[0] === child) {
        children.push(child);
        return;
      }

      mutated = true;
      children.push(...transformed);
    });

    if (!mutated) {
      return block;
    }

    return { ...block, children };
  });
};
