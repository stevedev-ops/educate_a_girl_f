// Input validation and sanitization utilities

/**
 * Sanitize text to prevent XSS attacks
 * @param {string} text - The text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text) => {
    if (typeof text !== 'string') return '';

    // Remove HTML tags and dangerous characters
    return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Validate URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid
 */
export const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false;

    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate number is positive
 * @param {number|string} value - The value to validate
 * @returns {boolean} True if valid positive number
 */
export const isPositiveNumber = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
};

/**
 * Validate price format (positive number with at most 2 decimal places)
 * @param {number|string} price - The price to validate
 * @returns {boolean} True if valid
 */
export const isValidPrice = (price) => {
    const num = parseFloat(price);
    if (isNaN(num) || num < 0) return false;

    // Check decimal places
    const decimalPlaces = (price.toString().split('.')[1] || '').length;
    return decimalPlaces <= 2;
};

/**
 * Validate stock quantity (non-negative integer)
 * @param {number|string} stock - The stock quantity to validate
 * @returns {boolean} True if valid
 */
export const isValidStock = (stock) => {
    const num = parseInt(stock);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
};

/**
 * Sanitize and validate product data
 * @param {object} product - The product data to validate
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validateProduct = (product) => {
    const errors = [];

    // Required fields
    if (!product.name || product.name.trim().length === 0) {
        errors.push('Product name is required');
    } else if (product.name.length > 200) {
        errors.push('Product name is too long (max 200 characters)');
    }

    if (!product.price || !isValidPrice(product.price)) {
        errors.push('Valid price is required');
    }

    if (product.offerPrice && !isValidPrice(product.offerPrice)) {
        errors.push('Offer price must be a valid price');
    }

    if (product.stock !== undefined && !isValidStock(product.stock)) {
        errors.push('Stock must be a non-negative integer');
    }

    // Validate URLs in images array
    if (product.images && Array.isArray(product.images)) {
        product.images.forEach((url, idx) => {
            if (url && !isValidUrl(url)) {
                errors.push(`Image #${idx + 1} has an invalid URL`);
            }
        });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Sanitize review/message content
 * @param {object} content - The user-generated content
 * @returns {object} Sanitized content
 */
export const sanitizeUserContent = (content) => {
    const sanitized = { ...content };

    if (sanitized.name) sanitized.name = sanitizeText(sanitized.name);
    if (sanitized.email) sanitized.email = sanitizeText(sanitized.email);
    if (sanitized.message) sanitized.message = sanitizeText(sanitized.message);
    if (sanitized.comment) sanitized.comment = sanitizeText(sanitized.comment);
    if (sanitized.review) sanitized.review = sanitizeText(sanitized.review);

    return sanitized;
};

/**
 * Validate contact form data
 * @param {object} data - The contact form data
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validateContactForm = (data) => {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
        errors.push('Name is required');
    } else if (data.name.length > 100) {
        errors.push('Name is too long');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email is required');
    }

    if (!data.message || data.message.trim().length === 0) {
        errors.push('Message is required');
    } else if (data.message.length > 5000) {
        errors.push('Message is too long (max 5000 characters)');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
