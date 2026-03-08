import { FaTwitch, FaYoutube, FaDiscord, FaInstagram, FaSteam, FaTiktok, FaFacebook, FaReddit, FaSpotify, FaXbox, FaPlaystation } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiKick, SiPatreon, SiEpicgames, SiBattledotnet, SiRumble } from 'react-icons/si';

function isSafeUrl(url) {
	try {
		const u = new URL(url);
		return ['http:', 'https:'].includes(u.protocol);
	} catch {
		return false;
	}
}

function hostIn(url, hosts) {
	try {
		const u = new URL(url);
		return hosts.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`));
	} catch {
		return false;
	}
}

export const PLATFORMS = {
	battlenet: { key: 'battlenet', label: 'Battle.net', icon: SiBattledotnet, buildUrl: (h) => h, validate: (url) => isSafeUrl(url) && hostIn(url, ['battle.net', 'blizzard.com']) },
	discord: { key: 'discord', label: 'Discord', icon: FaDiscord, buildUrl: (h) => h.startsWith('http') ? h : `https://discord.gg/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['discord.com', 'discord.gg']) },
	epic: { key: 'epic', label: 'Epic Games', icon: SiEpicgames, buildUrl: (h) => `https://store.epicgames.com/u/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['store.epicgames.com']) },
	facebook: { key: 'facebook', label: 'Facebook', icon: FaFacebook, buildUrl: (h) => `https://facebook.com/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['facebook.com']) },
	instagram: { key: 'instagram', label: 'Instagram', icon: FaInstagram, buildUrl: (h) => `https://instagram.com/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['instagram.com']) },
	kick: { key: 'kick', label: 'Kick', icon: SiKick, buildUrl: (h) => `https://kick.com/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['kick.com']) },
	patreon: { key: 'patreon', label: 'Patreon', icon: SiPatreon, buildUrl: (h) => `https://patreon.com/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['patreon.com']) },
	playstation: { key: 'playstation', label: 'PlayStation', icon: FaPlaystation, buildUrl: (h) => h, validate: (url) => isSafeUrl(url) && hostIn(url, ['playstation.com', 'my.playstation.com']) },
	reddit: { key: 'reddit', label: 'Reddit', icon: FaReddit, buildUrl: (h) => `https://reddit.com/u/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['reddit.com']) },
	rumble: { key: 'rumble', label: 'Rumble', icon: SiRumble, buildUrl: (h) => `https://rumble.com/user/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['rumble.com']) },
	spotify: { key: 'spotify', label: 'Spotify', icon: FaSpotify, buildUrl: (h) => isSafeUrl(h) ? h : `https://open.spotify.com/user/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['open.spotify.com']) },
	steam: { key: 'steam', label: 'Steam', icon: FaSteam, buildUrl: (h) => h.startsWith('http') ? h : `https://steamcommunity.com/id/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['steamcommunity.com', 'store.steampowered.com']) },
	tiktok: { key: 'tiktok', label: 'TikTok', icon: FaTiktok, buildUrl: (h) => `https://tiktok.com/@${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['tiktok.com']) },
	twitch: { key: 'twitch', label: 'Twitch', icon: FaTwitch, buildUrl: (h) => `https://twitch.tv/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['twitch.tv']) },
	x: { key: 'x', label: 'X (Twitter)', icon: FaXTwitter, buildUrl: (h) => `https://x.com/${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['twitter.com', 'x.com']) },
	xbox: { key: 'xbox', label: 'Xbox', icon: FaXbox, buildUrl: (h) => `https://account.xbox.com/en-us/profile?gamertag=${encodeURIComponent(h)}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['xbox.com']) },
	youtube: { key: 'youtube', label: 'YouTube', icon: FaYoutube, buildUrl: (h) => `https://youtube.com/@${h}`, validate: (url) => isSafeUrl(url) && hostIn(url, ['youtube.com', 'youtu.be']) },
};

export const PLATFORM_LIST = Object.values(PLATFORMS).sort((a, b) => a.label.localeCompare(b.label));
export { isSafeUrl };
