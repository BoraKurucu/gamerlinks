import { useEffect, useState, useRef, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, storage } from '../shared/firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getProfileByOwnerUid, setEventsForUsername } from '../shared/profileService';
import { PLATFORM_LIST, PLATFORMS } from '../shared/platforms';
import PlatformIcons from '../shared/PlatformIcons';
import SearchableDropdown from '../shared/SearchableDropdown';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaImage } from 'react-icons/fa';
import ParticleTrail from '../shared/ParticleTrail';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getSubscriptionStatus, FREE_EVENT_LIMIT, PREMIUM_EVENT_LIMIT } from '../shared/subscriptionService';
import UpgradeButton from '../shared/UpgradeButton';

const CONTENT_TYPES = [
	{ value: 'stream', label: 'Stream', icon: '🔴' },
	{ value: 'video', label: 'Video', icon: '▶️' },
	{ value: 'tournament', label: 'Tournament', icon: '🏆' },
	{ value: 'other', label: 'Other', icon: '📌' },
];

const STATUS_OPTIONS = [
	{ value: 'live', label: 'Live', icon: '🟢' },
	{ value: 'scheduled', label: 'Scheduled', icon: '🕒' },
	{ value: 'offline', label: 'Offline', icon: '⚫' },
];

// Get status options based on content type
function getStatusOptions(contentType) {
	if (contentType === 'video') {
		return [
			{ value: 'live', label: 'New', icon: '🟢' },
			{ value: 'scheduled', label: 'Scheduled', icon: '🕒' },
			{ value: 'offline', label: 'Offline', icon: '⚫' },
		];
	}
	// For streams and other content types, use default options
	return STATUS_OPTIONS;
}

// Common timezones for user-friendly selection
const TIMEZONES = [
	{ value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
	{ value: 'America/New_York', label: 'EST/EDT (Eastern Time)' },
	{ value: 'America/Chicago', label: 'CST/CDT (Central Time)' },
	{ value: 'America/Denver', label: 'MST/MDT (Mountain Time)' },
	{ value: 'America/Los_Angeles', label: 'PST/PDT (Pacific Time)' },
	{ value: 'America/Phoenix', label: 'MST (Arizona)' },
	{ value: 'Europe/London', label: 'GMT/BST (London)' },
	{ value: 'Europe/Paris', label: 'CET/CEST (Paris)' },
	{ value: 'Europe/Berlin', label: 'CET/CEST (Berlin)' },
	{ value: 'Europe/Rome', label: 'CET/CEST (Rome)' },
	{ value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
	{ value: 'Asia/Shanghai', label: 'CST (Shanghai)' },
	{ value: 'Asia/Dubai', label: 'GST (Dubai)' },
	{ value: 'Asia/Kolkata', label: 'IST (India)' },
	{ value: 'Australia/Sydney', label: 'AEST/AEDT (Sydney)' },
	{ value: 'America/Sao_Paulo', label: 'BRT (São Paulo)' },
	{ value: 'America/Mexico_City', label: 'CST (Mexico City)' },
	{ value: 'America/Toronto', label: 'EST/EDT (Toronto)' },
	{ value: 'Europe/Madrid', label: 'CET/CEST (Madrid)' },
	{ value: 'Europe/Amsterdam', label: 'CET/CEST (Amsterdam)' },
];

// Get user's timezone or default to UTC
function getDefaultTimezone() {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	} catch {
		return 'UTC';
	}
}

function EventModal({ isOpen, onClose, event, onSave, profile }) {
	const [formData, setFormData] = useState({
		contentType: 'stream',
		platform: 'twitch',
		title: '',
		scheduleStart: '',
		scheduleEnd: '',
		link: '',
		status: 'scheduled',
		image: '',
	});
	const [timezone, setTimezone] = useState(getDefaultTimezone());
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [imagePreview, setImagePreview] = useState('');
	const fileInputRef = useRef(null);
	
	// Crop modal state
	const [showCropModal, setShowCropModal] = useState(false);
	const [cropSrc, setCropSrc] = useState(null);
	const [crop, setCrop] = useState({ unit: '%', width: 90, aspect: 16 / 9 });
	const [completedCrop, setCompletedCrop] = useState(null);
	const imgRef = useRef(null);
	const previewCanvasRef = useRef(null);
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		if (event) {
			const eventStatus = event.status || 'scheduled';
			setFormData({
				contentType: event.contentType || 'stream',
				platform: event.platform || 'twitch',
				title: event.title || '',
				scheduleStart: eventStatus === 'live' ? '' : (event.scheduleStart || ''),
				scheduleEnd: eventStatus === 'live' ? '' : (event.scheduleEnd || ''),
				link: event.link || '',
				status: eventStatus,
				image: event.image || event.thumbnail || '',
				_index: event._index, // Preserve the index for editing
			});
			setImagePreview(event.image || event.thumbnail || '');
			// Set timezone from event if available, otherwise use default
			setTimezone(event.timezone || getDefaultTimezone());
		} else {
			setFormData({
				contentType: 'stream',
				platform: 'twitch',
				title: '',
				scheduleStart: '',
				scheduleEnd: '',
				link: '',
				status: 'scheduled',
				image: '',
				_index: undefined,
			});
			setImagePreview('');
			setTimezone(getDefaultTimezone());
		}
	}, [event, isOpen]);

	// Convert cropped image to blob
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

	if (!isOpen) return null;

	const handleSubmit = (e) => {
		e.preventDefault();
		// Clear dates if status is not 'scheduled'
		const dataToSave = { ...formData, timezone };
		if (dataToSave.status !== 'scheduled') {
			dataToSave.scheduleStart = '';
			dataToSave.scheduleEnd = '';
		}
		onSave(dataToSave);
	};

	// Format datetime-local value from a date string/timezone (for input field)
	const formatDateTimeLocal = (dateString, tz) => {
		if (!dateString) return '';
		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) return '';
			
			// Convert UTC date to the selected timezone
			const formatter = new Intl.DateTimeFormat('en-CA', {
				timeZone: tz,
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			});
			
			const parts = formatter.formatToParts(date);
			const year = parts.find(p => p.type === 'year').value;
			const month = parts.find(p => p.type === 'month').value;
			const day = parts.find(p => p.type === 'day').value;
			const hour = parts.find(p => p.type === 'hour').value;
			const minute = parts.find(p => p.type === 'minute').value;
			
			return `${year}-${month}-${day}T${hour}:${minute}`;
		} catch {
			return '';
		}
	};

	// Format date for display (dd.mm.yyyy, HH:MM)
	const formatDateDisplay = (dateString, tz) => {
		if (!dateString) return '';
		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) return '';
			
			// Convert UTC date to the selected timezone
			const formatter = new Intl.DateTimeFormat('en-GB', {
				timeZone: tz,
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			});
			
			const parts = formatter.formatToParts(date);
			const day = parts.find(p => p.type === 'day').value;
			const month = parts.find(p => p.type === 'month').value;
			const year = parts.find(p => p.type === 'year').value;
			const hour = parts.find(p => p.type === 'hour').value;
			const minute = parts.find(p => p.type === 'minute').value;
			
			return `${day}.${month}.${year}, ${hour}:${minute}`;
		} catch {
			return '';
		}
	};

	// Convert datetime-local + timezone to ISO string
	const convertToISO = (dateTimeLocal, tz) => {
		if (!dateTimeLocal) return '';
		try {
			// datetime-local format is YYYY-MM-DDTHH:MM
			// We interpret this as being in the selected timezone and convert to UTC
			
			const [datePart, timePart] = dateTimeLocal.split('T');
			const [year, month, day] = datePart.split('-').map(Number);
			const [hour, minute] = timePart.split(':').map(Number);
			
			// Method: Find what UTC timestamp corresponds to the input time in the selected timezone
			// We'll use a binary search approach: try different UTC timestamps until we find one
			// that formats to the input time in the selected timezone
			
			// Create a UTC date as a starting point (treating input as if it were UTC)
			let testUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
			
			// Format this UTC date in the selected timezone
			const formatter = new Intl.DateTimeFormat('en-CA', {
				timeZone: tz,
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			});
			
			// Iterate to find the correct UTC time
			// Calculate the difference between what we want and what we have
			const targetParts = formatter.formatToParts(testUtc);
			const targetDay = parseInt(targetParts.find(p => p.type === 'day').value);
			const targetHour = parseInt(targetParts.find(p => p.type === 'hour').value);
			
			// Calculate differences
			let diffHours = hour - targetHour;
			let diffDays = day - targetDay;
			
			// Handle day rollover
			if (Math.abs(diffDays) > 15) {
				diffDays = diffDays > 0 ? diffDays - 31 : diffDays + 31;
			}
			
			// Adjust the UTC date
			testUtc = new Date(testUtc.getTime() + diffDays * 24 * 60 * 60 * 1000 + diffHours * 60 * 60 * 1000);
			
			// Verify and fine-tune (one more iteration for accuracy)
			const verifyParts = formatter.formatToParts(testUtc);
			const verifyHour = parseInt(verifyParts.find(p => p.type === 'hour').value);
			const verifyDay = parseInt(verifyParts.find(p => p.type === 'day').value);
			
			let finalDiff = hour - verifyHour;
			if (day !== verifyDay) {
				finalDiff += (day - verifyDay) * 24;
			}
			
			testUtc = new Date(testUtc.getTime() + finalDiff * 60 * 60 * 1000);
			
			return testUtc.toISOString();
		} catch (e) {
			console.error('Error converting datetime:', e);
			// Fallback: treat as local time
			try {
				return new Date(dateTimeLocal).toISOString();
			} catch {
				return '';
			}
		}
	};

	const handleChange = (field, value) => {
		setFormData({ ...formData, [field]: value });
	};

	async function handleImageUpload(e) {
		const file = e.target.files?.[0];
		if (!file || !auth.currentUser?.uid) return;
		
		// Validate file
		const maxSize = 5 * 1024 * 1024; // 5MB
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		
		if (file.size > maxSize) {
			alert('File size must be less than 5MB');
			if (fileInputRef.current) fileInputRef.current.value = '';
			return;
		}
		
		if (!allowedTypes.includes(file.type)) {
			alert('Only image files are allowed (JPEG, PNG, GIF, WebP)');
			if (fileInputRef.current) fileInputRef.current.value = '';
			return;
		}
		
		// Read file and show crop modal
		const reader = new FileReader();
		reader.onload = () => {
			setCropSrc(reader.result);
			setShowCropModal(true);
			setImageLoaded(false);
			// Reset crop to default (will be set properly on image load)
			setCrop({ unit: '%', width: 90, aspect: 16 / 9 });
			setCompletedCrop(null);
		};
		reader.readAsDataURL(file);
		
		// Reset file input
		if (fileInputRef.current) fileInputRef.current.value = '';
	}
	
	// Handle crop completion and upload
	async function handleCropComplete() {
		const croppedBlob = await getCroppedImg();
		if (!croppedBlob || !auth.currentUser?.uid) {
			alert('Failed to process image');
			return;
		}
		
		setShowCropModal(false);
		setUploading(true);
		setUploadProgress(0);
		
		try {
			const fileName = `events/${auth.currentUser.uid}/${Date.now()}_cropped.jpg`;
			const ref = storageRef(storage, fileName);
			const task = uploadBytesResumable(ref, croppedBlob, { contentType: 'image/jpeg' });
			
			task.on('state_changed', (snap) => {
				const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
				setUploadProgress(pct);
			}, (err) => {
				console.error(err);
				alert('Failed to upload image');
				setUploading(false);
				setUploadProgress(0);
			}, async () => {
				const url = await getDownloadURL(task.snapshot.ref);
				setFormData({ ...formData, image: url });
				setImagePreview(url);
				setUploading(false);
				setUploadProgress(0);
				// Reset crop state
				setCropSrc(null);
				setCompletedCrop(null);
				setImageLoaded(false);
			});
		} catch (e) {
			console.error(e);
			alert('Failed to upload image');
			setUploading(false);
			setUploadProgress(0);
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

	function handleRemoveImage() {
		setFormData({ ...formData, image: '' });
		setImagePreview('');
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
			<div className="w-full max-w-2xl bg-bg-darker rounded-lg border border-white/10 p-4 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between mb-4 sm:mb-6">
					<h2 className="text-xl sm:text-2xl font-bold">{event ? 'Edit Item' : 'Add New Item'}</h2>
					<button
						onClick={onClose}
						className="text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
					>
						<FaTimes size={24} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-2">Content Type</label>
						<select
							value={formData.contentType}
							onChange={(e) => handleChange('contentType', e.target.value)}
							className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px]"
							required
						>
							{CONTENT_TYPES.map((type) => (
								<option key={type.value} value={type.value}>
									{type.icon} {type.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Platform</label>
						<SearchableDropdown
							options={PLATFORM_LIST.map(p => ({ value: p.key, label: p.label, icon: p.icon }))}
							value={formData.platform}
							onChange={(val) => handleChange('platform', val)}
							placeholder="Select platform"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Title</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) => handleChange('title', e.target.value)}
							className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px]"
							placeholder="e.g., Valorant Ranked Grind"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Image (Optional)</label>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
							onChange={handleImageUpload}
							className="hidden"
						/>
						
						{imagePreview ? (
							<div className="space-y-2">
								<div className="relative rounded-md overflow-hidden border border-white/10 bg-black/20">
									<img 
										src={imagePreview} 
										alt="Preview" 
										className="w-full h-48 object-cover"
										onError={() => {
											// If image fails to load, show error
											setImagePreview('');
											setFormData({ ...formData, image: '' });
										}}
									/>
									<button
										type="button"
										onClick={handleRemoveImage}
										className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center"
									>
										Remove
									</button>
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="flex-1 rounded-md border border-white/10 bg-black/30 px-3 py-2.5 sm:py-2 text-white hover:bg-black/50 transition-colors min-h-[44px] flex items-center justify-center gap-2"
										disabled={uploading}
									>
										<FaImage />
										<span>Change Image</span>
									</button>
								</div>
							</div>
						) : (
							<div className="space-y-2">
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									disabled={uploading}
									className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2.5 sm:py-2 text-white hover:bg-black/50 transition-colors min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<FaImage />
									<span>{uploading ? `Uploading... ${uploadProgress}%` : 'Upload Image'}</span>
								</button>
								{uploading && (
									<div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
										<div 
											className="bg-theme-primary h-2 rounded-full transition-all duration-300"
											style={{ width: `${uploadProgress}%` }}
										/>
									</div>
								)}
								<div className="text-xs text-white/50 text-center mb-2">OR</div>
								<input
									type="url"
									value={formData.image}
									onChange={(e) => {
										const url = e.target.value;
										setFormData({ ...formData, image: url });
										if (url) {
											setImagePreview(url);
										} else {
											setImagePreview('');
										}
									}}
									className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px]"
									placeholder="Or paste image URL here"
								/>
								<p className="text-xs text-white/50">Upload an image file or paste an image URL to display on the card</p>
							</div>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Status</label>
						<select
							value={formData.status}
							onChange={(e) => {
								const newStatus = e.target.value;
								setFormData((prev) => ({
									...prev,
									status: newStatus,
									scheduleStart: newStatus !== 'scheduled' ? '' : prev.scheduleStart,
									scheduleEnd: newStatus !== 'scheduled' ? '' : prev.scheduleEnd,
								}));
							}}
							className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px]"
							required
						>
							{getStatusOptions(formData.contentType).map((status) => (
								<option key={status.value} value={status.value}>
									{status.icon} {status.label}
								</option>
							))}
						</select>
					</div>

					{formData.status === 'scheduled' && (
						<div className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2 flex items-center gap-2">
										<FaCalendarAlt className="text-theme-primary" />
										Start Date & Time
									</label>
									<div className="relative">
										<input
											type="datetime-local"
											value={formatDateTimeLocal(formData.scheduleStart, timezone)}
											onChange={(e) => {
												const isoValue = convertToISO(e.target.value, timezone);
												handleChange('scheduleStart', isoValue);
											}}
											className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 pr-10 text-white cursor-pointer hover:border-theme-primary-50 transition-colors min-h-[44px]"
											required
											style={{
												colorScheme: 'dark',
												WebkitAppearance: 'none',
												MozAppearance: 'textfield'
											}}
										/>
										<FaClock className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
									</div>
									<p className="text-xs text-white/50 mt-1">
										{formatDateDisplay(formData.scheduleStart, timezone) || 'dd.mm.yyyy, --:--'} - Click to open calendar picker
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2 flex items-center gap-2">
										<FaCalendarAlt className="text-theme-primary" />
										End Date & Time
									</label>
									<div className="relative">
										<input
											type="datetime-local"
											value={formatDateTimeLocal(formData.scheduleEnd, timezone)}
											onChange={(e) => {
												const isoValue = convertToISO(e.target.value, timezone);
												handleChange('scheduleEnd', isoValue);
											}}
											className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 pr-10 text-white cursor-pointer hover:border-theme-primary-50 transition-colors min-h-[44px]"
											style={{
												colorScheme: 'dark',
												WebkitAppearance: 'none',
												MozAppearance: 'textfield'
											}}
										/>
										<FaClock className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
									</div>
									<p className="text-xs text-white/50 mt-1">
										{formatDateDisplay(formData.scheduleEnd, timezone) || 'dd.mm.yyyy, --:--'} - Click to open calendar picker
									</p>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2 flex items-center gap-2">
									<FaClock className="text-theme-primary" />
									Time Zone
								</label>
								<SearchableDropdown
									options={TIMEZONES}
									value={timezone}
									onChange={(val) => setTimezone(val)}
									placeholder="Select timezone"
									required
								/>
								<p className="text-xs text-white/50 mt-1">
									Selected timezone will be used for all date & time selections above
								</p>
							</div>
						</div>
					)}

					{formData.status === 'live' && (
						<div className={`rounded-md border px-4 py-3 text-sm font-medium ${
							formData.contentType === 'video' 
								? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
								: 'bg-green-500/20 border-green-500/50 text-green-400'
						}`}>
							{formData.contentType === 'video' ? (
								<>🟢 New - This video will be displayed at the top of your profile</>
							) : (
								<>🟢 Live - This stream will be displayed at the top of your profile</>
							)}
						</div>
					)}

					<div>
						<label className="block text-sm font-medium mb-2">Link</label>
						<input
							type="url"
							value={formData.link}
							onChange={(e) => handleChange('link', e.target.value)}
							className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2.5 sm:py-2 text-white min-h-[44px]"
							placeholder="https://twitch.tv/yourchannel"
						/>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-md border border-white/10 bg-black/30 px-4 py-2.5 sm:py-2 hover:bg-black/50 transition-colors min-h-[44px]"
						>
							Cancel
						</button>
						<ParticleTrail>
							<button
								type="submit"
								className="flex-1 neon-btn rounded-md bg-theme-primary px-4 py-2.5 sm:py-2 text-black font-semibold min-h-[44px]"
							>
								{event ? 'Save Changes' : 'Add Item'}
							</button>
						</ParticleTrail>
					</div>
				</form>
			</div>
			
			{/* Image Crop Modal */}
			{showCropModal && cropSrc && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-3 sm:p-4">
					<div className="w-full max-w-3xl bg-bg-darker rounded-lg border border-white/10 p-4 sm:p-6 max-h-[95vh] overflow-y-auto">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold">Crop Image</h3>
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
								aspect={16 / 9}
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
											const aspect = 16 / 9;
											let cropWidth = width * 0.9;
											let cropHeight = cropWidth / aspect;
											
											if (cropHeight > height * 0.9) {
												cropHeight = height * 0.9;
												cropWidth = cropHeight * aspect;
											}
											
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
									Use This Image
								</button>
							</ParticleTrail>
						</div>
						
						<p className="text-xs text-white/50 mt-4 text-center">
							Drag the corners or edges to adjust the crop area. The image will be cropped to a 16:9 aspect ratio.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
			<div className="w-full max-w-md bg-bg-darker rounded-lg border border-white/10 p-4 sm:p-6">
				<h3 className="text-lg sm:text-xl font-bold mb-4">Delete Item</h3>
				<p className="text-white/70 mb-6 text-sm sm:text-base">
					Are you sure you want to delete &quot;{title}&quot;? This action cannot be undone.
				</p>
				<div className="flex flex-col sm:flex-row gap-3">
					<button
						onClick={onClose}
						className="flex-1 rounded-md border border-white/10 bg-black/30 px-4 py-2.5 sm:py-2 hover:bg-black/50 transition-colors min-h-[44px]"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="flex-1 rounded-md bg-red-600 px-4 py-2.5 sm:py-2 hover:bg-red-700 transition-colors font-semibold min-h-[44px]"
					>
						Yes, Delete
					</button>
				</div>
			</div>
		</div>
	);
}

export default function ContentManager() {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [events, setEvents] = useState([]);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [toast, setToast] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState(null);
	const [deleteConfirm, setDeleteConfirm] = useState(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [subscription, setSubscription] = useState(null);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async (u) => {
			setUser(u);
			setError('');
			if (!u) {
				setProfile(null);
				setEvents([]);
				setSubscription(null);
				return;
			}
			const p = await getProfileByOwnerUid(u.uid);
			setProfile(p);
			setEvents(p?.events || []);
			setHasUnsavedChanges(false);
			const sub = await getSubscriptionStatus(u.uid);
			setSubscription(sub);
		});
		return () => unsub();
	}, []);

	useEffect(() => {
		const handleBeforeUnload = (e) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = '';
			}
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [hasUnsavedChanges]);

	function showToast(msg) {
		setToast(msg);
		setTimeout(() => setToast(''), 2000);
	}

	async function handleSave() {
		if (!profile?.username) return;
		try {
			setSaving(true);
			setError('');
			await setEventsForUsername(profile.username, events);
			setHasUnsavedChanges(false);
			showToast('All changes saved.');
		} catch (e) {
			console.error(e);
			setError('Failed to save changes');
			showToast('Failed to save changes');
		} finally {
			setSaving(false);
		}
	}

	function handleAdd() {
		const isPremium = subscription?.isActive;
		const limit = isPremium ? PREMIUM_EVENT_LIMIT : FREE_EVENT_LIMIT;
		const canAddMore = events.length < limit;
		
		if (!canAddMore) {
			setError(isPremium 
				? `Premium users can add up to ${PREMIUM_EVENT_LIMIT} content/streams. You've reached the limit.`
				: `Free users can only add up to ${FREE_EVENT_LIMIT} content/stream. Upgrade to premium for up to ${PREMIUM_EVENT_LIMIT} content.`);
			return;
		}
		
		setEditingEvent(null);
		setIsModalOpen(true);
		setError('');
	}

	function handleEdit(idx) {
		setEditingEvent({ ...events[idx], _index: idx });
		setIsModalOpen(true);
	}

	function handleModalSave(formData) {
		const { _index, ...eventData } = formData;
		const newEvents = [...events];

		if (_index !== undefined && _index >= 0 && _index < events.length) {
			// Preserve the original id when updating
			const originalEvent = events[_index];
			newEvents[_index] = { 
				...originalEvent, 
				...eventData,
				id: originalEvent.id || Date.now().toString() // Preserve existing id or create new one
			};
			showToast('Item updated successfully.');
		} else {
			// Create new event
			const id = Date.now().toString();
			newEvents.push({ ...eventData, id });
			showToast('Item added successfully.');
		}

		setEvents(newEvents);
		setHasUnsavedChanges(true);
		setIsModalOpen(false);
		setEditingEvent(null);
	}

	function handleDelete(idx) {
		setDeleteConfirm({ index: idx, title: events[idx]?.title || 'Untitled' });
	}

	function confirmDelete() {
		if (deleteConfirm === null) return;
		const newEvents = events.filter((_, idx) => idx !== deleteConfirm.index);
		setEvents(newEvents);
		setHasUnsavedChanges(true);
		setDeleteConfirm(null);
		showToast('Item deleted.');
	}

	function getContentTypeIcon(type) {
		return CONTENT_TYPES.find((t) => t.value === type)?.icon || '📌';
	}

	function getStatusIcon(status, contentType) {
		const options = getStatusOptions(contentType);
		return options.find((s) => s.value === status)?.icon || '⚫';
	}

	function getStatusLabel(status, contentType) {
		const options = getStatusOptions(contentType);
		return options.find((s) => s.value === status)?.label || 'Offline';
	}

	function formatSchedule(start, end, timezone) {
		if (!start && !end) return 'No schedule';
		
		// Get timezone from event or use user's timezone as fallback
		const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
		
		const formatOptions = {
			timeZone: tz,
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		};
		
		// Get timezone abbreviation
		const tzFormatter = new Intl.DateTimeFormat('en-US', {
			timeZone: tz,
			timeZoneName: 'short',
		});
		
		if (!start) {
			const endDate = new Date(end);
			const tzParts = tzFormatter.formatToParts(endDate);
			const tzAbbr = tzParts.find(p => p.type === 'timeZoneName')?.value || '';
			const endStr = endDate.toLocaleString([], { ...formatOptions, timeZone: tz });
			return `📅 Until ${endStr} ${tzAbbr}`;
		}
		
		if (!end) {
			const startDate = new Date(start);
			const tzParts = tzFormatter.formatToParts(startDate);
			const tzAbbr = tzParts.find(p => p.type === 'timeZoneName')?.value || '';
			const startStr = startDate.toLocaleString([], { ...formatOptions, timeZone: tz });
			return `📅 From ${startStr} ${tzAbbr}`;
		}
		
		const startDate = new Date(start);
		const endDate = new Date(end);
		
		const tzParts = tzFormatter.formatToParts(startDate);
		const tzAbbr = tzParts.find(p => p.type === 'timeZoneName')?.value || '';
		
		if (startDate.toDateString() === endDate.toDateString()) {
			const startStr = startDate.toLocaleDateString([], { ...formatOptions, timeZone: tz });
			const endTimeStr = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: tz });
			return `📅 ${startStr} - ${endTimeStr} ${tzAbbr}`;
		}
		
		const startStr = startDate.toLocaleString([], { ...formatOptions, timeZone: tz });
		const endStr = endDate.toLocaleString([], { ...formatOptions, timeZone: tz });
		return `📅 ${startStr} - ${endStr} ${tzAbbr}`;
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<div className="text-center text-white/80">Please sign in to manage your profile.</div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<div className="text-center text-white/80">Loading your profile…</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen px-3 sm:px-4 py-6 sm:py-10 flex justify-center">
			<div className="w-full max-w-4xl">
				<div className="mb-4 flex items-center gap-3">
					<Link to={`/profile/${profile.username}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm sm:text-base min-h-[44px]">
						<FaArrowLeft /> <span className="hidden sm:inline">Back to profile</span><span className="sm:hidden">Back</span>
					</Link>
				</div>

				<div className="mb-6">
					<h1 className="text-2xl sm:text-3xl font-bold mb-2">🎥 Stream & Content Manager</h1>
					<p className="text-white/70 text-sm sm:text-base mb-2">Manage your streams, videos, and tournament dates easily.</p>
					<p className="text-white/70 text-sm">
						{subscription?.isActive ? (
							<span className="text-green-400">🎉 Premium Member - {events.length}/{PREMIUM_EVENT_LIMIT} content used</span>
						) : (
							`Free Tier - ${events.length}/${FREE_EVENT_LIMIT} content used`
						)}
					</p>
				</div>

				<div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
					<ParticleTrail>
						<button
							onClick={handleAdd}
							className="neon-btn rounded-md border border-white/10 bg-black/30 px-4 py-2.5 sm:py-2 flex items-center justify-center gap-2 min-h-[44px] text-sm sm:text-base"
						>
							+ Add Item
						</button>
					</ParticleTrail>
					<ParticleTrail>
						<button
							onClick={handleSave}
							disabled={saving}
							className="neon-btn rounded-md bg-theme-primary px-4 sm:px-5 py-2.5 sm:py-2 text-black disabled:opacity-60 font-semibold min-h-[44px] text-sm sm:text-base"
						>
							{saving ? 'Saving…' : 'Save Changes'}
						</button>
					</ParticleTrail>
				</div>

				{error && (
					<div className="mb-4 rounded-md bg-red-500/20 border border-red-500/50 px-4 py-2 text-red-400 text-sm">
						{error}
					</div>
				)}

				{events.some((e) => e.status === 'live') && (
					<div className="mb-4 rounded-md bg-blue-500/20 border border-blue-500/50 px-4 py-3 flex items-center gap-3">
						<span className="text-2xl">🟢</span>
						<div>
							<div className="text-blue-400 font-semibold">Now Available</div>
							<div className="text-blue-300/80 text-sm">
								{events.filter((e) => e.status === 'live').length} item{events.filter((e) => e.status === 'live').length > 1 ? 's' : ''} currently active
							</div>
						</div>
					</div>
				)}

				<div className="space-y-3">
					{events.length === 0 ? (
						<div className="rounded-md border border-white/10 bg-bg-darker p-8 text-center text-white/60">
							You haven't added any content yet.
						</div>
					) : (
						events.map((event, idx) => (
							<div
								key={event.id || idx}
								className="rounded-md border border-white/10 bg-bg-darker p-3 sm:p-4 hover:border-white/20 transition-colors"
							>
								<div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
									<div className="flex-1 min-w-0">
										<div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
											<span className="text-xl sm:text-2xl">{getContentTypeIcon(event.contentType)}</span>
											<span className="font-semibold text-base sm:text-lg break-words">{event.title || 'Untitled'}</span>
											<span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
												event.status === 'live' ? (event.contentType === 'video' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400') :
												event.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-400' :
												'bg-gray-500/20 text-gray-400'
											}`}>
												{getStatusIcon(event.status, event.contentType)} <span className="hidden xs:inline">{getStatusLabel(event.status, event.contentType)}</span>
											</span>
										</div>
										<div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/70 mb-2">
											<span className="flex items-center gap-2">
												<PlatformIcons platform={event.platform} />
												<span className="whitespace-nowrap">{PLATFORMS[event.platform]?.label || event.platform}</span>
											</span>
											{event.scheduleStart && (
												<span className="whitespace-nowrap">{formatSchedule(event.scheduleStart, event.scheduleEnd, event.timezone)}</span>
											)}
										</div>
										{event.link && (
											<a
												href={event.link}
												target="_blank"
												rel="noreferrer"
												className="text-theme-primary hover:underline text-xs sm:text-sm inline-flex items-center gap-1 break-all"
											>
												{event.link}
											</a>
										)}
									</div>
									<div className="flex items-center gap-2 flex-shrink-0">
										<button
											onClick={() => handleEdit(idx)}
											className="p-2.5 sm:p-2 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
											title="Edit"
										>
											<FaEdit />
										</button>
										<button
											onClick={() => handleDelete(idx)}
											className="p-2.5 sm:p-2 rounded hover:bg-red-500/20 transition-colors text-white/70 hover:text-red-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
											title="Delete"
										>
											<FaTrash />
										</button>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{!subscription?.isActive && events.length >= FREE_EVENT_LIMIT && (
					<div className="mt-6">
						<UpgradeButton 
							user={user} 
							currentLinkCount={0} 
							currentEventCount={events.length}
							variant="banner"
						/>
					</div>
				)}
			</div>

			<EventModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setEditingEvent(null);
				}}
				event={editingEvent}
				onSave={handleModalSave}
				profile={profile}
			/>

			<DeleteConfirmModal
				isOpen={deleteConfirm !== null}
				onClose={() => setDeleteConfirm(null)}
				onConfirm={confirmDelete}
				title={deleteConfirm?.title || ''}
			/>

			{toast && (
				<div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-black/80 border border-white/10 px-4 py-2 text-white/90 z-50">
					{toast}
				</div>
			)}
		</div>
	);
}

