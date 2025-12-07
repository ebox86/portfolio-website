import Image from "next/image";
import { useMemo, useState } from "react";

interface AvatarProps {
  src: string;
  blurDataURL?: string;
}

const colorChoices = [
  "#f59e0b", // amber
  "#22d3ee", // cyan
  "#a855f7", // violet
  "#10b981", // emerald
  "#ef4444", // red
  "#f472b6", // pink
  "#3b82f6", // blue
  "#f97316", // orange
  "#84cc16", // lime
  "#eab308", // yellow
];

const Avatar: React.FC<AvatarProps> = ({ src, blurDataURL }) => {
  const [colorIndex, setColorIndex] = useState(0);
  const backgroundColor = useMemo(
    () => colorChoices[colorIndex % colorChoices.length],
    [colorIndex]
  );

  const handleClick = () => {
    setColorIndex((prev) => (prev + 1) % colorChoices.length);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative inline-block group focus:outline-none transition-transform duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] active:scale-95"
      aria-label="Change avatar background"
    >
      <span className="absolute inset-0 block scale-[1.15] rounded-full bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70] blur-2xl opacity-70 -z-10 transition-transform duration-500 group-hover:scale-[1.25]" />
      <span className="relative block p-[8px] rounded-full bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70] transition-transform duration-500 group-hover:scale-105">
        <span
          className="relative block w-48 h-48 rounded-full overflow-hidden shadow-xl bg-black transition-colors duration-500 ease-out"
          style={{ backgroundColor }}
        >
          <Image
            src={src}
            alt="Avatar"
            width={200}
            height={200}
            priority={true}
            placeholder={blurDataURL ? 'blur' : undefined}
            blurDataURL={blurDataURL}
            className="w-full h-full object-cover"
          />
        </span>
        <span
          className="absolute z-10"
          style={{ bottom: '23px', right: '23px' }}
        >
          <span className="relative block">
            <span className="peer block w-5 h-5 rounded-full bg-green-400 border-2 border-white shadow-md" />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gray-900 text-white text-xs px-3 py-1 opacity-0 translate-y-1 transition duration-200 ease-out peer-hover:opacity-100 peer-hover:translate-y-0 shadow-lg">
              Online
            </span>
          </span>
        </span>
      </span>
    </button>
  );
};

export default Avatar;
