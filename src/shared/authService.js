import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, applyActionCode, signOut, reload, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

function sanitizeUsername(input) {
	return (input || '')
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '')
		.replace(/^_+|_+$/g, '')
		.slice(0, 24);
}

export async function ensureProfileForUser(user) {
	// 1) If the user already owns a profile, use it
	const owned = await getDocs(query(collection(db, 'profiles'), where('ownerUid', '==', user.uid)));
	if (owned.docs[0]) {
		const d = owned.docs[0];
		const data = d.data();
		return { username: data.username || d.id };
	}

	// 2) Otherwise, create one, trying to claim the base username
	const base = sanitizeUsername(user.displayName || user.email?.split('@')[0] || user.uid);
	let candidate = base || `user${user.uid.slice(0, 6)}`;
	let i = 0;
	while (true) {
		const ref = doc(db, 'profiles', candidate);
		const snap = await getDoc(ref);
		if (!snap.exists()) {
			await setDoc(ref, {
				username: candidate,
				displayName: user.displayName || candidate,
				avatar: user.photoURL || '',
				bio: '',
				badges: [],
				links: [],
				events: [],
				ownerUid: user.uid,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
			return { username: candidate };
		}
		// If the existing doc belongs to this user, reuse it
		const data = snap.data();
		if (data?.ownerUid === user.uid) {
			return { username: data.username || candidate };
		}
		// Else, try next suffix
		i += 1;
		candidate = `${base}${i}`;
	}
}

export async function signInWithGoogleAndEnsureProfile() {
	const provider = new GoogleAuthProvider();
	try {
		const cred = await signInWithPopup(auth, provider);
		const user = cred.user;
		const { username } = await ensureProfileForUser(user);
		return { user, username };
	} catch (e) {
		if (e?.code === 'auth/popup-blocked' || e?.code === 'auth/popup-closed-by-user') {
			await signInWithRedirect(auth, provider);
		}
		throw e;
	}
}

export async function signInWithPhoneAndEnsureProfile(phoneNumber, verificationCode, containerId = 'recaptcha-container') {
	// Clean up existing verifier if it exists
	if (window.recaptchaVerifier) {
		try {
			window.recaptchaVerifier.clear();
		} catch (e) {
			// Ignore errors if verifier is already cleared
		}
		window.recaptchaVerifier = null;
	}

	// Wait a bit to ensure DOM is ready
	await new Promise(resolve => setTimeout(resolve, 100));

	// Check if container exists
	const container = document.getElementById(containerId);
	if (!container) {
		throw new Error(`reCAPTCHA container "${containerId}" not found. Please ensure the container exists in the DOM.`);
	}

	// Create new verifier
	window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
	
	try {
		const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
		if (!verificationCode) {
			return { confirmation, needsCode: true };
		}
		const cred = await confirmation.confirm(verificationCode);
		const user = cred.user;
		const { username } = await ensureProfileForUser(user);
		return { user, username };
	} catch (error) {
		// Clean up verifier on error
		if (window.recaptchaVerifier) {
			try {
				window.recaptchaVerifier.clear();
			} catch (e) {
				// Ignore cleanup errors
			}
			window.recaptchaVerifier = null;
		}
		throw error;
	}
}

export async function confirmPhoneVerification(confirmation, code) {
	const cred = await confirmation.confirm(code);
	const user = cred.user;
	const { username } = await ensureProfileForUser(user);
	return { user, username };
}

export async function signUpWithEmailAndPassword(email, password) {
	const cred = await createUserWithEmailAndPassword(auth, email, password);
	const user = cred.user;
	await sendEmailVerification(user);
	// Sign out the user immediately - they must verify email before accessing
	await signOut(auth);
	return { emailSent: true };
}

export async function verifyEmailWithCode(actionCode) {
	try {
		await applyActionCode(auth, actionCode);
		const user = auth.currentUser;
		if (user) {
			const username = await ensureProfileForUser(user);
			return { user, username };
		}
		return { verified: true };
	} catch (e) {
		throw e;
	}
}

export async function signInWithEmailAndPassword(email, password) {
	const cred = await firebaseSignInWithEmailAndPassword(auth, email, password);
	const user = cred.user;
	
	// Reload user to get latest emailVerified status
	await reload(user);
	
	// Check if email is verified
	if (!user.emailVerified) {
		// Sign out the user if email is not verified
		await signOut(auth);
		const error = new Error('Email not verified');
		error.code = 'auth/email-not-verified';
		throw error;
	}
	
	const { username } = await ensureProfileForUser(user);
	return { user, username };
}

export async function resendVerificationEmail(email, password) {
	try {
		// Sign in temporarily to resend verification email
		// Use the exact same pattern as signUpWithEmailAndPassword
		const cred = await firebaseSignInWithEmailAndPassword(auth, email, password);
		const user = cred.user;
		
		// Send the verification email (exact same as signup - no reload needed)
		await sendEmailVerification(user);
		
		// Sign out the user immediately (exact same as signup)
		await signOut(auth);
		
		return { emailSent: true };
	} catch (error) {
		// Make sure to sign out if we're signed in
		try {
			if (auth.currentUser) {
				await signOut(auth);
			}
		} catch (signOutError) {
			// Ignore sign out errors
		}
		throw error;
	}
}

export async function signInOrCreateWithEmailAndEnsureProfile(email, password) {
	try {
		const cred = await firebaseSignInWithEmailAndPassword(auth, email, password);
		const user = cred.user;
		const { username } = await ensureProfileForUser(user);
		return { user, username };
	} catch (e) {
		if (e?.code === 'auth/user-not-found') {
			const cred = await createUserWithEmailAndPassword(auth, email, password);
			const user = cred.user;
			await sendEmailVerification(user);
			const { username } = await ensureProfileForUser(user);
			return { user, username, emailSent: true };
		}
		throw e;
	}
}

export async function completeRedirectSignIn() {
	const result = await getRedirectResult(auth);
	if (result && result.user) {
		const { username } = await ensureProfileForUser(result.user);
		return { user: result.user, username };
	}
	return null;
}

export async function sendPasswordReset(email) {
	await sendPasswordResetEmail(auth, email);
	return { emailSent: true };
}
