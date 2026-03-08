/**
 * Client-side rate limiting utility to prevent abuse and bot attacks
 * Uses in-memory storage with automatic cleanup
 */

const requestHistory = new Map();
const CLEANUP_INTERVAL = 60000; // Clean up old entries every minute
const MAX_AGE = 300000; // 5 minutes

// Cleanup old entries periodically
setInterval(() => {
	const now = Date.now();
	for (const [key, history] of requestHistory.entries()) {
		if (history.lastRequestTime < now - MAX_AGE) {
			requestHistory.delete(key);
		}
	}
}, CLEANUP_INTERVAL);

/**
 * Rate limiter configuration
 */
export const RATE_LIMITS = {
	// Authentication attempts
	auth: {
		maxAttempts: 5,
		windowMs: 15 * 60 * 1000, // 15 minutes
		lockoutMs: 30 * 60 * 1000, // 30 minutes lockout after max attempts
	},
	// Password reset requests
	passwordReset: {
		maxAttempts: 3,
		windowMs: 60 * 60 * 1000, // 1 hour
		lockoutMs: 60 * 60 * 1000, // 1 hour lockout
	},
	// Email verification resends
	emailVerification: {
		maxAttempts: 3,
		windowMs: 60 * 60 * 1000, // 1 hour
		lockoutMs: 60 * 60 * 1000, // 1 hour lockout
	},
	// General API requests
	api: {
		maxAttempts: 30,
		windowMs: 60 * 1000, // 1 minute
		lockoutMs: 5 * 60 * 1000, // 5 minutes lockout
	},
	// Form submissions
	formSubmit: {
		maxAttempts: 10,
		windowMs: 60 * 1000, // 1 minute
		lockoutMs: 5 * 60 * 1000, // 5 minutes lockout
	},
};

/**
 * Checks if an action is rate limited
 * @param {string} key - Unique identifier (e.g., email, IP, user ID)
 * @param {string} type - Type of rate limit (auth, passwordReset, etc.)
 * @returns {Object} - { allowed: boolean, retryAfter?: number, message?: string }
 */
export function checkRateLimit(key, type = 'api') {
	const config = RATE_LIMITS[type] || RATE_LIMITS.api;
	const now = Date.now();
	const historyKey = `${type}:${key}`;
	
	let history = requestHistory.get(historyKey);
	
	// Check if locked out
	if (history?.lockedUntil && history.lockedUntil > now) {
		const retryAfter = Math.ceil((history.lockedUntil - now) / 1000);
		return {
			allowed: false,
			retryAfter,
			message: `Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minute(s).`,
		};
	}
	
	// Initialize or get existing history
	if (!history) {
		history = {
			attempts: [],
			lockoutUntil: null,
		};
	}
	
	// Remove old attempts outside the window
	history.attempts = history.attempts.filter(
		timestamp => timestamp > now - config.windowMs
	);
	
	// Check if limit exceeded
	if (history.attempts.length >= config.maxAttempts) {
		// Set lockout
		const lockedUntil = now + config.lockoutMs;
		history.lockedUntil = lockedUntil;
		history.attempts.push(now);
		requestHistory.set(historyKey, history);
		
		const retryAfter = Math.ceil(config.lockoutMs / 1000);
		return {
			allowed: false,
			retryAfter,
			message: `Rate limit exceeded. Please try again in ${Math.ceil(retryAfter / 60)} minute(s).`,
		};
	}
	
	// Record this attempt
	history.attempts.push(now);
	history.lastRequestTime = now;
	requestHistory.set(historyKey, history);
	
	return { allowed: true };
}

/**
 * Resets rate limit for a key (useful for successful auth)
 * @param {string} key - Unique identifier
 * @param {string} type - Type of rate limit
 */
export function resetRateLimit(key, type = 'api') {
	const historyKey = `${type}:${key}`;
	requestHistory.delete(historyKey);
}

/**
 * Gets remaining attempts before rate limit
 * @param {string} key - Unique identifier
 * @param {string} type - Type of rate limit
 * @returns {number} - Remaining attempts
 */
export function getRemainingAttempts(key, type = 'api') {
	const config = RATE_LIMITS[type] || RATE_LIMITS.api;
	const historyKey = `${type}:${key}`;
	const history = requestHistory.get(historyKey);
	
	if (!history) {
		return config.maxAttempts;
	}
	
	const now = Date.now();
	const recentAttempts = history.attempts.filter(
		timestamp => timestamp > now - config.windowMs
	);
	
	return Math.max(0, config.maxAttempts - recentAttempts.length);
}

/**
 * Creates a unique key from request context
 * @param {string} identifier - Email, user ID, or other identifier
 * @param {string} type - Type of request
 * @returns {string} - Combined key
 */
export function createRateLimitKey(identifier, type = 'api') {
	// In a real app, you might combine with IP address
	// For now, we use identifier + type
	return `${type}:${identifier?.toLowerCase() || 'anonymous'}`;
}

