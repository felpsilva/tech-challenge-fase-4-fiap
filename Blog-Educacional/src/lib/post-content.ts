const dangerousBlocks = /<(?:script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\/(?:script|style|iframe|object|embed|form)>/gi;
const dangerousTags = /<\/?(?:input|button)[^>]*>/gi;
const eventAttributes = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const dangerousUrls = /\s+(?:href|src)\s*=\s*(['"])\s*(?:javascript|data):[^'"]*\1/gi;

export function sanitizePostHtml(value: string) {
  return value
    .replace(dangerousBlocks, '')
    .replace(dangerousTags, '')
    .replace(eventAttributes, '')
    .replace(dangerousUrls, '');
}

export function postHtmlToText(value: string) {
  return sanitizePostHtml(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>|<\/div>|<\/li>|<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
