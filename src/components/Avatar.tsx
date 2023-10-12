import Image from "next/image";

interface AvatarProps {
  src: string;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <div className="relative inline-block">
      <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-gray-200">
        <Image src={src} alt="Avatar" width={200} height={200} />
      </div>
      <div className="w-5 h-5 rounded-full bg-green-400 border-2 border-white absolute bottom-4 right-2"></div>
    </div>
  );
};

export default Avatar;
