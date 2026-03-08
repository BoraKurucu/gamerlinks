import { useEffect, useState, useRef, useCallback } from 'react';
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, storage } from '../shared/firebase';
import { getProfileByOwnerUid, updateUsername, isUsernameAvailable } from '../shared/profileService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../shared/firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../shared/ThemeContext';
import ParticleTrail from '../shared/ParticleTrail';
import { validateDisplayName, validateBio, validateAvatarUrl } from '../shared/security';
import { FaTimes } from 'react-icons/fa';
import PlatformIcons from '../shared/PlatformIcons';
import { PLATFORMS } from '../shared/platforms';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getSubscriptionStatus, redirectToCancelSubscription, PREMIUM_LINK_LIMIT, PREMIUM_EVENT_LIMIT } from '../shared/subscriptionService';
import UpgradeButton from '../shared/UpgradeButton';

// Color picker component
function ColorPicker({ currentColor, onColorChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-white/70">Color Theme:</label>
      <input
        type="color"
        value={currentColor}
        onChange={(e) => onColorChange(e.target.value)}
        className="h-12 w-24 rounded-md border-2 border-white/30 cursor-pointer hover:border-white/50 transition-colors"
      />
      <span className="text-sm text-white/50 font-mono">{currentColor}</span>
    </div>
  );
}

function PasswordChangeModal({ isOpen, onClose, user, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      onSuccess?.();
      onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      console.error(e);
      if (e?.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else if (e?.code === 'auth/weak-password') {
        setError('New password is too weak');
      } else {
        setError(e?.message || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-md bg-bg-darker rounded-lg border border-white/10 p-4 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold">Change Password</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px] text-sm sm:text-base"
              placeholder="Enter current password"
              required
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px] text-sm sm:text-base"
              placeholder="Enter new password (min 6 chars)"
              required
              minLength={6}
              autoComplete="new-password"
            />
            <p className="text-xs text-white/50 mt-1">Must be at least 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px] text-sm sm:text-base"
              placeholder="Confirm new password"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-500/20 border border-red-500/50 px-4 py-2 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-white/10 bg-black/30 px-4 py-2.5 sm:py-2 hover:bg-black/50 transition-colors min-h-[44px]"
              disabled={loading}
            >
              Cancel
            </button>
            <ParticleTrail>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 neon-btn rounded-md bg-theme-primary px-4 py-2.5 sm:py-2 text-black font-semibold min-h-[44px] disabled:opacity-60"
              >
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </ParticleTrail>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Settings() {
  const { theme, changeTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [highlightedLinks, setHighlightedLinks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameError, setUsernameError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  
  // Crop modal state for avatar
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 90, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setSubscription(null);
        return;
      }
      const p = await getProfileByOwnerUid(u.uid);
      setProfile(p);
      setDisplayName(p?.displayName || '');
      setBio(p?.bio || '');
      setHighlightedLinks(p?.highlightedLinks || []);
      const sub = await getSubscriptionStatus(u.uid);
      setSubscription(sub);
    });
    return () => unsub();
  }, []);

  // Convert cropped image to blob (for avatar)
  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return null;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  }, [completedCrop]);

  // Update preview canvas when crop completes
  useEffect(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  async function handleSave() {
    if (!profile?.username) return;
    
    // Validate inputs
    const validatedDisplayName = validateDisplayName(displayName);
    const validatedBio = validateBio(bio);
    
    if (!validatedDisplayName) {
      setError('Display name must be between 1 and 50 characters');
      return;
    }
    
    // Validate highlightedLinks indices are within bounds
    const maxIndex = (profile?.links?.length || 0) - 1;
    const validatedHighlightedLinks = highlightedLinks.filter((idx) => 
      typeof idx === 'number' && idx >= 0 && idx <= maxIndex
    );
    
    setSaving(true);
    setError('');
    try {
      const ref = doc(db, 'profiles', profile.username);
      await updateDoc(ref, { 
        displayName: validatedDisplayName, 
        bio: validatedBio || '',
        highlightedLinks: validatedHighlightedLinks
      });
      showToast('Profile updated');
    } catch (e) {
      console.error(e);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  function toggleHighlightedLink(index) {
    setHighlightedLinks((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index].sort((a, b) => a - b);
      }
    });
  }

  function handleChangePassword() {
    if (!isEmailUser) {
      showToast('Password change is only available for email accounts');
      return;
    }
    setShowPasswordModal(true);
  }

  function handleChangeUsername() {
    setNewUsername('');
    setUsernameAvailable(null);
    setUsernameError('');
    setShowUsernameModal(true);
  }

  async function handleCheckUsername() {
    if (!newUsername || !user?.uid) return;
    
    setCheckingUsername(true);
    setUsernameError('');
    setUsernameAvailable(null);
    
    try {
      const available = await isUsernameAvailable(newUsername, user.uid);
      setUsernameAvailable(available);
      if (!available) {
        setUsernameError('This username is already taken');
      } else if (newUsername.toLowerCase() === profile?.username?.toLowerCase()) {
        setUsernameError('This is your current username');
        setUsernameAvailable(false);
      } else {
        setUsernameError('');
      }
    } catch (e) {
      console.error(e);
      setUsernameError('Failed to check username availability');
      setUsernameAvailable(false);
    } finally {
      setCheckingUsername(false);
    }
  }

  async function handleSaveUsername() {
    if (!profile?.username || !user?.uid || !newUsername) return;
    
    if (!usernameAvailable) {
      setUsernameError('Please check that the username is available first');
      return;
    }
    
    setSaving(true);
    setUsernameError('');
    
    try {
      const updatedUsername = await updateUsername(profile.username, newUsername, user.uid);
      showToast('Username updated successfully');
      setShowUsernameModal(false);
      setNewUsername('');
      setUsernameAvailable(null);
      
      // Navigate to new profile URL
      navigate(`/profile/${updatedUsername}`, { replace: true });
      
      // Refresh profile data
      const updatedProfile = await getProfileByOwnerUid(user.uid);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (e) {
      console.error(e);
      if (e.message === 'Username is already taken') {
        setUsernameError('This username is no longer available');
      } else if (e.message === 'Invalid username format') {
        setUsernameError('Invalid username format. Only letters, numbers, and underscores are allowed (1-24 characters)');
      } else {
        setUsernameError(e.message || 'Failed to update username');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handlePickAvatar() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file || !profile?.username || !user?.uid) return;
    
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      setError('Only image files are allowed (JPEG, PNG, GIF, WebP)');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    // Read file and show crop modal
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result);
      setShowCropModal(true);
      setImageLoaded(false);
      setError('');
      // Reset crop to default (will be set properly on image load)
      setCrop({ unit: '%', width: 90, aspect: 1 });
      setCompletedCrop(null);
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // Handle crop completion and upload
  async function handleCropComplete() {
    const croppedBlob = await getCroppedImg();
    if (!croppedBlob || !user?.uid || !profile?.username) {
      setError('Failed to process image');
      return;
    }
    
    setShowCropModal(false);
    setUploading(true);
    setUploadPct(0);
    setError('');
    
    try {
      const ref = storageRef(storage, `avatars/${user.uid}`);
      const task = uploadBytesResumable(ref, croppedBlob, { contentType: 'image/jpeg' });
      
      task.on('state_changed', (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        setUploadPct(pct);
      }, (err) => {
        console.error(err);
        setError('Failed to upload profile picture');
        setUploading(false);
      }, async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        const validatedUrl = validateAvatarUrl(url);
        await updateDoc(doc(db, 'profiles', profile.username), { avatar: validatedUrl });
        showToast('Profile picture updated');
        setUploading(false);
        setUploadPct(0);
        // Reset crop state
        setCropSrc(null);
        setCompletedCrop(null);
        setImageLoaded(false);
      });
    } catch (e) {
      console.error(e);
      setError('Failed to upload profile picture');
      setUploading(false);
      setCropSrc(null);
      setCompletedCrop(null);
      setImageLoaded(false);
    }
  }

  function handleCancelCrop() {
    setShowCropModal(false);
    setCropSrc(null);
    setCompletedCrop(null);
    setImageLoaded(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white/80">Loading…</div>
      </div>
    );
  }

  // Check if user is authenticated with email (not Google or phone)
  const isEmailUser = user.providerData?.some(provider => provider.providerId === 'password') || false;

  return (
    <div className="min-h-screen px-3 sm:px-4 py-6 sm:py-10 flex justify-center">
      <div className="w-full max-w-xl">
        <div className="mb-4">
          <Link className="text-theme-primary underline text-sm sm:text-base min-h-[44px] inline-flex items-center" to={`/profile/${profile.username}`}>← <span className="hidden sm:inline">Back to profile</span><span className="sm:hidden">Back</span></Link>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Settings</h1>

        <div className="space-y-4 sm:space-y-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Username</label>
            <div className="flex items-center gap-2">
              <span className="flex-1 rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px] text-sm sm:text-base flex items-center">@{profile.username}</span>
              <ParticleTrail>
                <button onClick={handleChangeUsername} className="neon-btn rounded-md border border-white/10 bg-black/30 px-4 py-2.5 sm:py-2 min-h-[44px] text-sm sm:text-base whitespace-nowrap">Change</button>
              </ParticleTrail>
            </div>
            <p className="text-xs text-white/50 mt-1">Your profile URL: /view/{profile.username}</p>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Display name</label>
            <input className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px] text-sm sm:text-base" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Bio</label>
            <textarea className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[100px] text-sm sm:text-base" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-2">Color Theme</label>
            <ColorPicker currentColor={theme} onColorChange={changeTheme} />
          </div>
          {profile?.links && profile.links.length > 0 && (
            <div>
              <label className="block text-sm text-white/70 mb-2">Highlighted Links</label>
              <p className="text-xs text-white/50 mb-3">Select links to display as quick access icons under your bio</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {profile.links.map((link, index) => {
                  const isHighlighted = highlightedLinks.includes(index);
                  const platformMeta = PLATFORMS[link.platform];
                  return (
                    <label
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-md border border-white/10 bg-black/20 hover:bg-black/30 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isHighlighted}
                        onChange={() => toggleHighlightedLink(index)}
                        className="w-5 h-5 rounded border-white/20 bg-black/30 text-theme-primary focus:ring-theme-primary-50 cursor-pointer"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <PlatformIcons platform={link.platform} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{link.title}</div>
                          <div className="text-xs text-white/60 truncate">{platformMeta?.label || link.platform}</div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subscription Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <label className="block text-sm font-bold text-white/90 mb-3">My Plans</label>
            {subscription?.isActive ? (
              <div className="space-y-3">
                <div className="rounded-md border border-green-500/50 bg-green-500/10 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚀</span>
                      <span className="font-bold text-white">Premium Plan</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">Active</span>
                  </div>
                  <p className="text-white/70 text-sm mb-3">
                    You have access to up to {PREMIUM_LINK_LIMIT} links and {PREMIUM_EVENT_LIMIT} content, plus all premium features
                  </p>
                  {subscription.lemonSqueezySubscriptionId && (
                    <ParticleTrail>
                      <button
                        onClick={() => redirectToCancelSubscription(subscription.lemonSqueezySubscriptionId)}
                        className="w-full rounded-md border border-red-500/50 bg-red-500/10 px-4 py-2 text-red-400 hover:bg-red-500/20 transition-colors font-medium text-sm"
                      >
                        Cancel Subscription
                      </button>
                    </ParticleTrail>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <UpgradeButton 
                  user={user} 
                  currentLinkCount={profile?.links?.length || 0} 
                  currentEventCount={profile?.events?.length || 0}
                  variant="default"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
          <ParticleTrail>
            <button onClick={handleSave} disabled={saving} className="neon-btn rounded-md bg-theme-primary px-4 sm:px-5 py-2.5 sm:py-2 text-black hover:opacity-95 disabled:opacity-60 min-h-[44px] text-sm sm:text-base">{saving ? 'Saving…' : 'Save changes'}</button>
          </ParticleTrail>
          {isEmailUser && (
            <ParticleTrail>
              <button onClick={handleChangePassword} className="neon-btn rounded-md border border-white/10 bg-black/30 px-4 py-2.5 sm:py-2 min-h-[44px] text-sm sm:text-base">Change password</button>
            </ParticleTrail>
          )}
          <ParticleTrail>
            <button onClick={handlePickAvatar} disabled={uploading} className="neon-btn rounded-md border border-white/10 bg-black/30 px-4 py-2.5 sm:py-2 min-h-[44px] text-sm sm:text-base whitespace-nowrap">{uploading ? `Uploading… ${uploadPct}%` : 'Change profile picture'}</button>
          </ParticleTrail>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {error ? <span className="text-red-400 text-xs sm:text-sm flex items-center w-full sm:w-auto">{error}</span> : null}
        </div>

        <PasswordChangeModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          user={user}
          onSuccess={() => showToast('Password updated successfully')}
        />

        {/* Username Change Modal */}
        {showUsernameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
            <div className="w-full max-w-md bg-bg-darker rounded-lg border border-white/10 p-4 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold">Change Username</h3>
                <button
                  onClick={() => {
                    setShowUsernameModal(false);
                    setNewUsername('');
                    setUsernameAvailable(null);
                    setUsernameError('');
                  }}
                  className="text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Username</label>
                  <div className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px] text-sm sm:text-base flex items-center">
                    @{profile.username}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">New Username</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => {
                        setNewUsername(e.target.value);
                        setUsernameAvailable(null);
                        setUsernameError('');
                      }}
                      className="flex-1 rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px] text-sm sm:text-base"
                      placeholder="username"
                      disabled={saving || checkingUsername}
                      autoComplete="off"
                    />
                    <ParticleTrail>
                      <button
                        type="button"
                        onClick={handleCheckUsername}
                        disabled={!newUsername || saving || checkingUsername || newUsername.toLowerCase() === profile?.username?.toLowerCase()}
                        className="neon-btn rounded-md border border-white/10 bg-black/30 px-4 py-2.5 sm:py-2 min-h-[44px] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {checkingUsername ? 'Checking…' : 'Check'}
                      </button>
                    </ParticleTrail>
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    Only letters, numbers, and underscores. 1-24 characters.
                  </p>
                  {usernameAvailable === true && (
                    <p className="text-xs text-green-400 mt-1">✓ Username is available</p>
                  )}
                  {usernameAvailable === false && !usernameError && (
                    <p className="text-xs text-yellow-400 mt-1">Checking availability…</p>
                  )}
                </div>

                {usernameError && (
                  <div className="rounded-md bg-red-500/20 border border-red-500/50 px-4 py-2 text-red-400 text-sm">
                    {usernameError}
                  </div>
                )}

                <div className="rounded-md bg-blue-500/20 border border-blue-500/50 px-4 py-3 text-blue-300 text-sm">
                  <p className="mb-1">⚠️ Important:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Changing your username will update your profile URL</li>
                    <li>Old links to your profile will no longer work</li>
                    <li>Share your new profile URL after changing</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUsernameModal(false);
                      setNewUsername('');
                      setUsernameAvailable(null);
                      setUsernameError('');
                    }}
                    className="flex-1 rounded-md border border-white/10 bg-black/30 px-4 py-2.5 sm:py-2 hover:bg-black/50 transition-colors min-h-[44px]"
                    disabled={saving || checkingUsername}
                  >
                    Cancel
                  </button>
                  <ParticleTrail>
                    <button
                      type="button"
                      onClick={handleSaveUsername}
                      disabled={!usernameAvailable || saving || checkingUsername || !newUsername}
                      className="flex-1 neon-btn rounded-md bg-theme-primary px-4 py-2.5 sm:py-2 text-black font-semibold min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Updating…' : 'Update Username'}
                    </button>
                  </ParticleTrail>
                </div>
              </div>
            </div>
          </div>
        )}

        {toast ? (<div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-black/80 border border-white/10 px-4 py-2 text-white/90 z-50">{toast}</div>) : null}
      </div>

      {/* Image Crop Modal for Avatar */}
      {showCropModal && cropSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-3xl bg-bg-darker rounded-lg border border-white/10 p-4 sm:p-6 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Crop Profile Picture</h3>
              <button
                onClick={handleCancelCrop}
                className="text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <ReactCrop
                src={cropSrc}
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  src={cropSrc}
                  alt="Crop"
                  style={{ maxWidth: '100%', maxHeight: '70vh' }}
                  onLoad={() => {
                    // Auto-center crop on load
                    if (imgRef.current && !imageLoaded) {
                      setImageLoaded(true);
                      const { width, height } = imgRef.current;
                      const aspect = 1; // Square for profile picture
                      let cropWidth = Math.min(width, height) * 0.9;
                      let cropHeight = cropWidth; // Square crop
                      
                      const cropX = (width - cropWidth) / 2;
                      const cropY = (height - cropHeight) / 2;
                      
                      const initialCrop = {
                        unit: 'px',
                        x: cropX,
                        y: cropY,
                        width: cropWidth,
                        height: cropHeight,
                        aspect: aspect
                      };
                      
                      setCrop(initialCrop);
                      // Set completedCrop immediately so button is enabled with default crop
                      setCompletedCrop(initialCrop);
                    }
                  }}
                />
              </ReactCrop>
            </div>
            
            {/* Preview canvas (hidden) */}
            <canvas
              ref={previewCanvasRef}
              style={{ display: 'none' }}
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCancelCrop}
                className="flex-1 rounded-md border border-white/10 bg-black/30 px-4 py-2.5 sm:py-2 hover:bg-black/50 transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <ParticleTrail>
                <button
                  type="button"
                  onClick={handleCropComplete}
                  disabled={!completedCrop}
                  className="flex-1 neon-btn rounded-md bg-theme-primary px-4 py-2.5 sm:py-2 text-black font-semibold min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Use This Picture
                </button>
              </ParticleTrail>
            </div>
            
            <p className="text-xs text-white/50 mt-4 text-center">
              Drag the corners or edges to adjust the crop area. The image will be cropped to a square (1:1 aspect ratio).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
