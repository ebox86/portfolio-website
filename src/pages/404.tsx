import Image from 'next/image';
import Link from 'next/link';

function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="https://http.cat/404" alt="404 Cat" width={600} height={600} />
      <Link href="/">
        <span className="mt-8 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition duration-300 ease-in-out cursor-pointer">
          Go back to home
        </span>
      </Link>
    </div>
  );
}

export default Custom404;
