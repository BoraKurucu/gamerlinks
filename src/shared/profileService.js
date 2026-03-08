import { collection, doc, getDoc, getDocs, query, where, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { getProfileByUsername as getMock } from './mockProfiles';
import { validateLinks, validateEvents, validateBio, validateDisplayName, validateBadges, validateAvatarUrl, validateUsername } from './security';

async function resolveProfileDocId(username) {
	const orig = String(username);
	const lower = orig.toLowerCase();
	let d = await getDoc(doc(db, 'profiles', orig));
	if (d.exists()) return d.id;
	if (lower !== orig) {
		d = await getDoc(doc(db, 'profiles', lower));
		if (d.exists()) return d.id;
	}
	let res = await getDocs(query(collection(db, 'profiles'), where('username', '==', orig)));
	if (res.docs[0]) return res.docs[0].id;
	if (lower !== orig) {
		res = await getDocs(query(collection(db, 'profiles'), where('username', '==', lower)));
		if (res.docs[0]) return res.docs[0].id;
	}
	return null;
}

export async function getProfileByUsername(username) {
	if (!username) return null;
	if (!isFirebaseConfigured()) {
		return getMock(username) || null;
	}
	const id = await resolveProfileDocId(username);
	if (!id) return null;
	const snap = await getDoc(doc(db, 'profiles', id));
	return snap.exists() ? normalizeProfile({ id: snap.id, ...snap.data() }) : null;
}

export function subscribeProfileByUsername(username, callback) {
	if (!isFirebaseConfigured()) {
		callback(getMock(username) || null);
		return () => {};
	}
	let activeUnsub = null;
	let cancelled = false;
	resolveProfileDocId(username).then((id) => {
		if (cancelled) return;
		if (!id) {
			callback(null);
			return;
		}
		activeUnsub = onSnapshot(doc(db, 'profiles', id), (snap) => {
			callback(snap.exists() ? normalizeProfile({ id: snap.id, ...snap.data() }) : null);
		});
	});
	return () => {
		cancelled = true;
		if (activeUnsub) activeUnsub();
	};
}

export async function getProfileByOwnerUid(uid) {
	if (!uid) return null;
	const q = query(collection(db, 'profiles'), where('ownerUid', '==', uid));
	const res = await getDocs(q);
	const first = res.docs[0];
	return first ? normalizeProfile({ id: first.id, ...first.data() }) : null;
}

export async function listLinksForUsername(username) {
	const profile = await getProfileByUsername(username);
	return profile?.links || [];
}

export async function setLinksForUsername(username, links) {
	// assumes username equals doc id in our creation flow; if not, resolve
	const id = await resolveProfileDocId(username);
	if (!id) throw new Error('profile-not-found');
	const validatedLinks = validateLinks(links);
	if (!validatedLinks) throw new Error('invalid-links');
	const ref = doc(db, 'profiles', id);
	await updateDoc(ref, { links: validatedLinks });
}

export async function setEventsForUsername(username, events) {
	const id = await resolveProfileDocId(username);
	if (!id) throw new Error('profile-not-found');
	const validatedEvents = validateEvents(events);
	if (!validatedEvents) throw new Error('invalid-events');
	const ref = doc(db, 'profiles', id);
	await updateDoc(ref, { events: validatedEvents });
}

export async function setShowQRCodeForUsername(username, showQRCode) {
	const id = await resolveProfileDocId(username);
	if (!id) throw new Error('profile-not-found');
	const ref = doc(db, 'profiles', id);
	await updateDoc(ref, { showQRCode: Boolean(showQRCode) });
}

export function upsertLink(links, link, index = -1) {
	const next = Array.isArray(links) ? [...links] : [];
	if (index >= 0) next[index] = link;
	else next.push(link);
	return next;
}

export function removeLink(links, index) {
	const next = Array.isArray(links) ? [...links] : [];
	next.splice(index, 1);
	return next;
}

/**
 * Checks if a username is available (not already taken by another user)
 * @param {string} username - Username to check
 * @param {string} currentOwnerUid - UID of current user (to exclude their own profile)
 * @returns {Promise<boolean>} - True if available, false if taken
 */
export async function isUsernameAvailable(username, currentOwnerUid) {
	if (!username || !isFirebaseConfigured()) return false;
	const validated = validateUsername(username);
	if (!validated) return false;
	
	// Check if username exists as document ID
	const docSnap = await getDoc(doc(db, 'profiles', validated));
	if (docSnap.exists()) {
		const data = docSnap.data();
		// If it's the current user's profile, it's available (they can keep it)
		if (data.ownerUid === currentOwnerUid) return true;
		// Otherwise it's taken
		return false;
	}
	
	// Check if username exists as a field in any document
	const q = query(collection(db, 'profiles'), where('username', '==', validated));
	const results = await getDocs(q);
	if (results.empty) return true;
	
	// Check if any result belongs to a different user
	for (const docSnap of results.docs) {
		const data = docSnap.data();
		if (data.ownerUid !== currentOwnerUid) {
			return false; // Username is taken by someone else
		}
	}
	
	// All results are from the current user, so it's available
	return true;
}

/**
 * Updates the username for a profile
 * @param {string} currentUsername - Current username
 * @param {string} newUsername - New username to set
 * @param {string} ownerUid - Owner UID to verify ownership
 * @returns {Promise<string>} - The validated new username
 */
export async function updateUsername(currentUsername, newUsername, ownerUid) {
	if (!currentUsername || !newUsername || !ownerUid) {
		throw new Error('Missing required parameters');
	}
	
	const validated = validateUsername(newUsername);
	if (!validated) {
		throw new Error('Invalid username format');
	}
	
	// Check if username is available
	const available = await isUsernameAvailable(validated, ownerUid);
	if (!available) {
		throw new Error('Username is already taken');
	}
	
	// Get current profile
	const currentId = await resolveProfileDocId(currentUsername);
	if (!currentId) {
		throw new Error('Profile not found');
	}
	
	const currentProfile = await getDoc(doc(db, 'profiles', currentId));
	if (!currentProfile.exists()) {
		throw new Error('Profile not found');
	}
	
	const profileData = currentProfile.data();
	if (profileData.ownerUid !== ownerUid) {
		throw new Error('Unauthorized');
	}
	
	// Update the username field
	await updateDoc(doc(db, 'profiles', currentId), {
		username: validated,
		updatedAt: serverTimestamp()
	});
	
	return validated;
}

function normalizeProfile(p) {
	return {
		username: p.username || p.id || '',
		displayName: validateDisplayName(p.displayName || p.username || '') || '',
		avatar: validateAvatarUrl(p.avatar),
		bio: validateBio(p.bio) || '',
		badges: validateBadges(Array.isArray(p.badges) ? p.badges : []),
		links: validateLinks(Array.isArray(p.links) ? p.links : []) || [],
		events: validateEvents(Array.isArray(p.events) ? p.events : []) || [],
		ownerUid: p.ownerUid || '',
		theme: p.theme || '#00E5FF', // Support hex colors or default to blue
		highlightedLinks: Array.isArray(p.highlightedLinks) ? p.highlightedLinks.filter((i) => typeof i === 'number' && i >= 0) : [],
		showQRCode: Boolean(p.showQRCode),
	};
}
