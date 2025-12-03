import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import useSWRInfinite from 'swr/infinite';
import { GetStaticProps } from 'next';
import client from '../../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { toPlainText } from '@portabletext/react';

const builder = imageUrlBuilder(client);

interface BlogPost {
  _id: string;
  title: string;
  slug: any;
  publishedAt: string;
  mainImage: any;
  body: any;
  categories: any;
}

interface BlogPageProps {
  initialPage: BlogPost[];
}

const PAGE_SIZE = 6;

const fetchPostsPage = async (start: number, limit: number) => {
  const stop = start + limit; // GROQ slices are end-exclusive
  const query = `*[_type == "post"] | order(publishedAt desc) [${start}...${stop}] {
    _id,
    title,
    slug,
    body,
    publishedAt,
    mainImage,
    categories[] -> {title, _id}
  }`;

  return await client.fetch<BlogPost[]>(query);
};

function urlFor(source: any) {
  return builder.image(source);
}

const BlogPage: React.FC<BlogPageProps> = ({ initialPage }) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, size, setSize, isValidating } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && previousPageData.length === 0) return null;
      return ['posts', pageIndex];
    },
    async (key) => {
      const [, pageIndex] = key as [string, number];
      const start = pageIndex * PAGE_SIZE;
      return fetchPostsPage(start, PAGE_SIZE);
    },
    {
      fallbackData: initialPage ? [initialPage] : undefined,
      revalidateOnFocus: false,
    }
  );

  const posts = useMemo(() => (data ? data.flat() : []), [data]);
  const isLoadingInitialData = !data && isValidating;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isReachingEnd = data && data[data.length - 1]?.length < PAGE_SIZE;

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoadingMore && !isReachingEnd) {
          setSize((s) => s + 1);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [setSize, isLoadingMore, isReachingEnd]);

  return (
    <div className="w-full">
      <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">Posts</h1>
      <ul className="mt-4 space-y-4">
        {posts.length > 0 &&
          posts.map(({ _id, title = '', slug = '', mainImage = '', categories, body, publishedAt }) =>
            slug && (
              <Link key={_id} href={`/blog/${encodeURIComponent(slug.current)}`}>
                <li className="bg-slate-50 border border-gray-100 my-4 shadow-md rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex">
                    <div className="relative w-1/2">
                      <Image
                        src={urlFor(mainImage).width(400).quality(80).url() || ''}
                        alt={title}
                        fill
                        placeholder="blur"
                        blurDataURL={urlFor(mainImage).width(20).quality(20).url() || ''}
                        className="rounded-l-lg object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-4 w-1/2 bg-white dark:bg-gray-900 rounded-r-lg">
                      <h2 className="text-xl font-semibold cursor-pointer text-gray-900 dark:text-white">{title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm my-1 dark:text-gray-200">
                          Published on {new Date(publishedAt).toLocaleDateString()}
                      </p>
                      {categories &&
                        categories.map(({ _id = '', title = '' }) => (
                          <span
                            key={_id}
                            className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-700 dark:text-white"
                          >
                            {title}
                          </span>
                        ))}
                      {body && (
                        <p className="text-gray-800 dark:text-gray-100 mt-2">
                          {toPlainText(body).length >= 80
                            ? toPlainText(body).slice(0, 80) + '...'
                            : toPlainText(body)}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              </Link>
            )
          )}
      </ul>
      <div ref={loadMoreRef} className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        {isLoadingMore ? 'Loading…' : isReachingEnd ? 'No more posts' : 'Scroll to load more'}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const posts = await fetchPostsPage(0, PAGE_SIZE);

  return {
    props: {
      initialPage: posts,
    },
    revalidate: 600, // 10 minutes
  };
};

export default BlogPage;
