import Image from "next/image";

interface AvatarProps {
  src: string;
  blurDataURL?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, blurDataURL }) => {
  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 scale-[1.15] rounded-full bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70] blur-2xl opacity-70 -z-10" />
      <div className="relative p-[6px] rounded-full bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70]">
        <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-900">
          <Image
            src={src}
            alt="Avatar"
            width={200}
            height={200}
            priority={true}
            placeholder={blurDataURL ? 'blur' : undefined}
            blurDataURL={blurDataURL}
          />
        </div>
      </div>
      <div className="w-5 h-5 rounded-full bg-green-400 border-2 border-white absolute bottom-5 right-6 shadow-md"></div>
    </div>
  );
};

export default Avatar;
