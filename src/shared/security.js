/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitizes a string to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeString(input) {
	if (typeof input !== 'string') return '';
	return input
		.replace(/[<>]/g, '') // Remove potential HTML tags
		.trim()
		.slice(0, 10000); // Limit length to prevent DoS
}

/**
 * Validates and sanitizes a username
 * @param {string} username - Username to validate
 * @returns {string|null} - Sanitized username or null if invalid
 */
export function validateUsername(username) {
	if (!username || typeof username !== 'string') return null;
	const sanitized = username
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '')
		.replace(/^_+|_+$/g, '')
		.slice(0, 24);
	return sanitized.length >= 1 && sanitized.length <= 24 ? sanitized : null;
}

/**
 * Validates a URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export function validateUrl(url) {
	if (!url || typeof url !== 'string') return false;
	try {
		const parsed = new URL(url);
		// Only allow http and https protocols
		return ['http:', 'https:'].includes(parsed.protocol);
	} catch {
		return false;
	}
}

/**
 * Sanitizes a URL (validates and returns cleaned URL)
 * @param {string} url - URL to sanitize
 * @returns {string|null} - Sanitized URL or null if invalid
 */
export function sanitizeUrl(url) {
	if (!validateUrl(url)) return null;
	try {
		const parsed = new URL(url);
		return `${parsed.protocol}//${parsed.host}${parsed.pathname}${parsed.search}`;
	} catch {
		return null;
	}
}

/**
 * Validates display name
 * @param {string} name - Display name to validate
 * @returns {string|null} - Sanitized name or null if invalid
 */
export function validateDisplayName(name) {
	if (!name || typeof name !== 'string') return null;
	const sanitized = sanitizeString(name).slice(0, 50);
	return sanitized.length >= 1 && sanitized.length <= 50 ? sanitized : null;
}

/**
 * Validates bio text
 * @param {string} bio - Bio text to validate
 * @returns {string|null} - Sanitized bio or null if invalid
 */
export function validateBio(bio) {
	if (!bio || typeof bio !== 'string') return null;
	const sanitized = sanitizeString(bio).slice(0, 500);
	return sanitized.length <= 500 ? sanitized : null;
}

/**
 * Validates title text
 * @param {string} title - Title to validate
 * @returns {string|null} - Sanitized title or null if invalid
 */
export function validateTitle(title) {
	if (!title || typeof title !== 'string') return null;
	const sanitized = sanitizeString(title).slice(0, 100);
	return sanitized.length >= 1 && sanitized.length <= 100 ? sanitized : null;
}

/**
 * Validates description text
 * @param {string} description - Description to validate
 * @returns {string|null} - Sanitized description or null if invalid
 */
export function validateDescription(description) {
	if (!description || typeof description !== 'string') return null;
	const sanitized = sanitizeString(description).slice(0, 1000);
	return sanitized.length <= 1000 ? sanitized : null;
}

/**
 * Validates an array of links
 * @param {Array} links - Array of link objects
 * @returns {Array|null} - Validated links or null if invalid
 */
export function validateLinks(links) {
	if (!Array.isArray(links)) return null;
	if (links.length > 50) return null; // Limit to prevent DoS
	
	const validated = [];
	for (const link of links) {
		if (typeof link !== 'object' || link === null) continue;
		
		const title = validateTitle(link.title);
		const url = sanitizeUrl(link.url);
		const platform = typeof link.platform === 'string' ? link.platform.slice(0, 50) : null;
		
		if (title && url && platform) {
			validated.push({ title, url, platform });
		}
	}
	
	return validated;
}

/**
 * Validates an array of events
 * @param {Array} events - Array of event objects
 * @returns {Array|null} - Validated events or null if invalid
 */
export function validateEvents(events) {
	if (!Array.isArray(events)) return null;
	if (events.length > 100) return null; // Limit to prevent DoS
	
	const validTypes = ['stream', 'video', 'tournament', 'other'];
	const validStatuses = ['live', 'scheduled', 'offline'];
	
	const validated = [];
	for (const event of events) {
		if (typeof event !== 'object' || event === null) continue;
		
		const title = validateTitle(event.title);
		const contentType = validTypes.includes(event.contentType) ? event.contentType : 'other';
		const platform = typeof event.platform === 'string' ? event.platform.slice(0, 50) : 'twitch';
		const status = validStatuses.includes(event.status) ? event.status : 'offline';
		const link = event.link ? sanitizeUrl(event.link) : '';
		const description = event.description ? validateDescription(event.description) : '';
		
		// Validate dates if scheduled
		let scheduleStart = '';
		let scheduleEnd = '';
		if (status === 'scheduled') {
			if (event.scheduleStart) {
				const startDate = new Date(event.scheduleStart);
				if (!isNaN(startDate.getTime())) {
					scheduleStart = startDate.toISOString();
				}
			}
			if (event.scheduleEnd) {
				const endDate = new Date(event.scheduleEnd);
				if (!isNaN(endDate.getTime())) {
					scheduleEnd = endDate.toISOString();
				}
			}
		}
		
		// Validate image URL if provided
		const image = event.image ? sanitizeUrl(event.image) : '';
		const thumbnail = event.thumbnail ? sanitizeUrl(event.thumbnail) : '';
		
		if (title) {
			validated.push({
				id: typeof event.id === 'string' ? event.id.slice(0, 100) : Date.now().toString(),
				title,
				contentType,
				platform,
				status,
				link,
				description,
				scheduleStart,
				scheduleEnd,
				image,
				thumbnail,
			});
		}
	}
	
	return validated;
}

/**
 * Validates avatar URL
 * @param {string} url - Avatar URL to validate
 * @returns {string|null} - Validated URL or empty string if invalid
 */
export function validateAvatarUrl(url) {
	if (!url || typeof url !== 'string') return '';
	const sanitized = sanitizeUrl(url);
	return sanitized || '';
}

/**
 * Validates array of badges
 * @param {Array} badges - Array of badge strings
 * @returns {Array} - Validated badges
 */
export function validateBadges(badges) {
	if (!Array.isArray(badges)) return [];
	const validated = [];
	for (const badge of badges) {
		if (typeof badge === 'string') {
			const sanitized = sanitizeString(badge).slice(0, 30);
			if (sanitized.length > 0 && validated.length < 10) {
				validated.push(sanitized);
			}
		}
	}
	return validated;
}

/**
 * Enhanced XSS protection - removes script tags and dangerous patterns
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeHtml(input) {
	if (typeof input !== 'string') return '';
	return input
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
		.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframes
		.replace(/javascript:/gi, '') // Remove javascript: protocol
		.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
		.replace(/[<>]/g, '') // Remove remaining angle brackets
		.trim()
		.slice(0, 10000);
}

/**
 * Validates email format (basic validation)
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export function validateEmail(email) {
	if (!email || typeof email !== 'string') return false;
	// Basic email regex - Firebase will do stricter validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) return false;
	// Check length limits
	if (email.length > 254) return false; // RFC 5321 limit
	return true;
}

/**
 * Detects suspicious patterns that might indicate bot behavior
 * @param {Object} formData - Form data to check
 * @returns {Object} - { isSuspicious: boolean, reasons: string[] }
 */
export function detectBotBehavior(formData) {
	const reasons = [];
	
	// Check for honeypot fields (should be empty)
	if (formData.website || formData.url || formData.website_url) {
		reasons.push('honeypot_field_filled');
	}
	
	// Check for suspiciously fast submission (less than 1 second)
	if (formData.submitTime && Date.now() - formData.submitTime < 1000) {
		reasons.push('suspiciously_fast_submission');
	}
	
	// Check for suspicious patterns in text
	if (formData.text || formData.message || formData.comment) {
		const text = (formData.text || formData.message || formData.comment).toLowerCase();
		// Check for common spam patterns
		const spamPatterns = [
			/http:\/\//g,
			/https:\/\//g,
			/bit\.ly/g,
			/tinyurl/g,
			/buy now/gi,
			/click here/gi,
			/free money/gi,
		];
		
		for (const pattern of spamPatterns) {
			if (pattern.test(text) && (text.match(pattern) || []).length > 2) {
				reasons.push('spam_pattern_detected');
				break;
			}
		}
	}
	
	return {
		isSuspicious: reasons.length > 0,
		reasons,
	};
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, strength: string, issues: string[] }
 */
export function validatePasswordStrength(password) {
	if (!password || typeof password !== 'string') {
		return { isValid: false, strength: 'weak', issues: ['Password is required'] };
	}
	
	const issues = [];
	let strength = 'weak';
	
	if (password.length < 8) {
		issues.push('Password must be at least 8 characters');
	}
	if (password.length < 6) {
		issues.push('Password must be at least 6 characters (minimum)');
	}
	if (!/[a-z]/.test(password)) {
		issues.push('Password should contain at least one lowercase letter');
	}
	if (!/[A-Z]/.test(password)) {
		issues.push('Password should contain at least one uppercase letter');
	}
	if (!/[0-9]/.test(password)) {
		issues.push('Password should contain at least one number');
	}
	if (!/[^a-zA-Z0-9]/.test(password)) {
		issues.push('Password should contain at least one special character');
	}
	
	// Determine strength
	if (issues.length === 0 && password.length >= 12) {
		strength = 'strong';
	} else if (issues.length <= 1 && password.length >= 8) {
		strength = 'medium';
	} else {
		strength = 'weak';
	}
	
	// Firebase minimum is 6 characters
	const isValid = password.length >= 6;
	
	return { isValid, strength, issues };
}

/**
 * Sanitizes and validates phone number (basic)
 * @param {string} phone - Phone number to validate
 * @returns {string|null} - Sanitized phone or null if invalid
 */
export function validatePhoneNumber(phone) {
	if (!phone || typeof phone !== 'string') return null;
	// Remove all non-digit characters except +
	const cleaned = phone.replace(/[^\d+]/g, '');
	// Basic validation - must start with + and have 10-15 digits
	if (!cleaned.startsWith('+')) return null;
	const digits = cleaned.slice(1);
	if (digits.length < 10 || digits.length > 15) return null;
	return cleaned;
}

