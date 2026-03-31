const parseJsonArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }
    return [];
};

export const parseTags = (value) => parseJsonArray(value)
    .map((tag) => String(tag).trim())
    .filter(Boolean);

export const parseContentBlocks = (value) => parseJsonArray(value)
    .filter((block) => block && typeof block === 'object' && block.type);

export const blocksFromLegacyContent = (content) => {
    if (!content || !String(content).trim()) return [];

    return String(content)
        .split(/\n\s*\n/)
        .map((chunk) => chunk.trim())
        .filter(Boolean)
        .map((text) => ({ type: 'paragraph', text }));
};

export const normalizeBlogPost = (post) => {
    if (!post) return post;

    const normalized = { ...post };
    normalized.tags = parseTags(post.tags);
    normalized.content_blocks = parseContentBlocks(post.content_blocks);
    normalized.category = post.category || '';
    normalized.featured = !!post.featured;
    return normalized;
};

export const getRenderableBlocks = (post) => {
    const normalized = normalizeBlogPost(post);
    if (normalized.content_blocks.length > 0) {
        return normalized.content_blocks;
    }
    return blocksFromLegacyContent(normalized.content);
};
