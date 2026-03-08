const profiles = [
	{
		username: 'shadowwolf',
		displayName: 'ShadowWolf',
		avatar: 'https://avatars.githubusercontent.com/u/9919?v=4',
		bio: 'FPS main. Night raids. Clips every Friday.',
		badges: ['Twitch Affiliate', 'Top 500 Overwatch'],
		links: [
			{ title: 'Twitch', url: 'https://twitch.tv/shadowwolf', platform: 'twitch' },
			{ title: 'YouTube Highlights', url: 'https://youtube.com/@shadowwolf', platform: 'youtube' },
			{ title: 'Discord Server', url: 'https://discord.gg/example', platform: 'discord' },
		],
	},
	{
		username: 'cyberkat',
		displayName: 'CyberKat',
		avatar: 'https://i.pravatar.cc/300?img=12',
		bio: 'RPG enjoyer. Mods. Cozy streams.',
		badges: ['Partnered Creator'],
		links: [
			{ title: 'TikTok', url: 'https://tiktok.com/@cyberkat', platform: 'tiktok' },
			{ title: 'My Website', url: 'https://cyberkat.gg', platform: 'website' },
		],
	},
];

export function getProfileByUsername(name) {
	return profiles.find((p) => p.username.toLowerCase() === name.toLowerCase());
}

export default profiles;
