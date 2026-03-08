import { PLATFORMS } from './platforms';

export default function PlatformIcons({ platform }) {
  const meta = PLATFORMS[platform];
  const Icon = meta?.icon;
  return (
    <div className="h-9 w-9 flex items-center justify-center rounded-md bg-white/5 border border-white/10 text-lg">
      {Icon ? <Icon /> : <span>🔗</span>}
    </div>
  );
}
