import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import useSWRInfinite from 'swr/infinite';
import { GetStaticProps } from 'next';
import client from '../../sanityClient';
import { buildSanityImage } from '../lib/sanityImage';
import { toPlainText } from '@portabletext/react';

interface PostTag {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
}

interface PostCategory {
  _id?: string;
  title?: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: any;
  publishedAt: string;
  mainImage: any;
  body: any;
  tags?: PostTag[];
  category?: PostCategory;
}

interface BlogPageProps {
  initialPage: BlogPost[];
  tagsList: PostTag[];
  categoriesList: PostCategory[];
}

const FIRST_PAGE_SIZE = 3;
const PAGE_SIZE = 3;

const pageBounds = (pageIndex: number) => {
  if (pageIndex === 0) {
    return { start: 0, limit: FIRST_PAGE_SIZE };
  }
  return { start: FIRST_PAGE_SIZE + (pageIndex - 1) * PAGE_SIZE, limit: PAGE_SIZE };
};

const fetchPostsPage = async (start: number, limit: number) => {
  const stop = start + limit; // GROQ slices are end-exclusive
  const query = `*[_type == "post"] | order(publishedAt desc) [${start}...${stop}] {
    _id,
    title,
    slug,
    body,
    publishedAt,
    mainImage{
      asset->{_ref, url, metadata{lqip}},
      crop,
      hotspot
    },
    tags[] -> {title, _id, "slug": slug.current},
    category -> {title, _id}
  }`;

  return await client.fetch<BlogPost[]>(query);
};

const BlogPage: React.FC<BlogPageProps> = ({ initialPage, tagsList = [], categoriesList = [] }) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [allowLoadMore, setAllowLoadMore] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');

  const { data, size, setSize, isValidating } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && previousPageData.length === 0) return null;
      return ['posts', pageIndex];
    },
    async (key) => {
      const [, pageIndex] = key as [string, number];
      const { start, limit } = pageBounds(pageIndex);
      return fetchPostsPage(start, limit);
    },
    {
      fallbackData: initialPage ? [initialPage] : undefined,
      revalidateOnFocus: false,
    }
  );

  const posts = useMemo(() => (data ? data.flat() : []), [data]);
  const isLoadingInitialData = !data && isValidating;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const lastPageIndex = (data?.length || 1) - 1;
  const expectedLastPageSize = lastPageIndex === 0 ? FIRST_PAGE_SIZE : PAGE_SIZE;
  const isReachingEnd = data && data[data.length - 1]?.length < expectedLastPageSize;

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTags =
        !activeTags.length ||
        post.tags?.some((tag) => {
          const tagId = tag.slug || tag._id;
          return tagId && activeTags.includes(tagId);
        });
      const matchesCategory =
        !activeCategory ||
        (post.category && (post.category._id === activeCategory || post.category.title === activeCategory));
      return matchesTags && matchesCategory;
    });
  }, [activeTags, activeCategory, posts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setAllowLoadMore(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!allowLoadMore || !loadMoreRef.current) return;
    const rect = loadMoreRef.current.getBoundingClientRect();
    const inView = rect.top < window.innerHeight + 100;
    if (inView && !isLoadingMore && !isReachingEnd) {
      setSize((s) => s + 1);
    }
  }, [allowLoadMore, isLoadingMore, isReachingEnd, setSize]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!allowLoadMore) return;
        if (first.isIntersecting && !isLoadingMore && !isReachingEnd) {
          setSize((s) => s + 1);
        }
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [setSize, isLoadingMore, isReachingEnd, allowLoadMore]);

  return (
    <div className="w-full space-y-8">
      <header className="space-y-3">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white">Posts</h1>
        <p className="text-lg text-gray-700 dark:text-gray-200">
          Notes, walkthroughs, and reviews from the lab. Filter by tag to narrow things down.
        </p>
      </header>

      <section className="space-y-2 rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">Select tags or category to refine</span>
          </div>
          {(activeTags.length > 0 || activeCategory) && (
            <button
              onClick={() => {
                setActiveTags([]);
                setActiveCategory('');
              }}
              className="text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 shadow-sm transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Category:</span>
            {categoriesList.map((cat) => {
              const catId = cat._id || cat.title || '';
              const isActive = activeCategory === catId;
              return (
                <button
                  key={catId}
                  onClick={() => setActiveCategory(isActive ? '' : catId)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    isActive
                      ? 'border-transparent bg-slate-900 text-white focus:ring-slate-300 dark:bg-slate-200 dark:text-slate-900 dark:focus:ring-slate-200 dark:focus:ring-offset-gray-900'
                      : 'border-gray-300 bg-gray-50 text-gray-800 hover:border-gray-400 hover:text-gray-900 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:text-white dark:focus:ring-slate-300 dark:focus:ring-offset-gray-900'
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
            {categoriesList.length === 0 && (
              <div className="rounded-full border border-dashed border-gray-300 bg-white/60 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                No categories
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Tags:</span>
            {tagsList.map((tag) => {
              const tagId = tag.slug || tag._id;
              const isActive = tagId ? activeTags.includes(tagId) : false;
              return (
                <button
                  key={tag._id}
                  onClick={() => {
                    if (!tagId) return;
                    setActiveTags((prev) =>
                      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    isActive
                      ? 'border-transparent bg-sky-600 text-white focus:ring-sky-300 dark:focus:ring-offset-gray-900'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-sky-200 hover:text-sky-700 focus:ring-sky-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-sky-300 dark:hover:text-sky-200 dark:focus:ring-sky-300 dark:focus:ring-offset-gray-900'
                  }`}
                >
                  {tag.title}
                </button>
              );
            })}
            {tagsList.length === 0 && (
              <div className="rounded-full border border-dashed border-gray-300 bg-white/60 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                No tags
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {activeCategory
              ? `${categoriesList.find((c) => (c._id || c.title) === activeCategory)?.title || 'Category'} posts`
              : activeTags.length > 0
              ? 'Filtered posts'
              : 'All posts'}
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTags([])}
              className="text-sm font-semibold px-3 py-1 rounded-full border border-gray-200 bg-white text-orange-600 hover:text-orange-700 hover:border-orange-200 hover:bg-gray-50 shadow-sm transition dark:border-gray-700 dark:bg-gray-800 dark:text-orange-300 dark:hover:text-orange-200 dark:hover:bg-gray-700"
            >
              Show all
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <ul className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(({ _id, title = '', slug = '', mainImage = '', tags, body, publishedAt, category }) => {
                const cover = buildSanityImage(mainImage, { width: 640, height: 400 });
                if (!slug) return null;

                return (
                  <Link key={_id} href={`/blog/${encodeURIComponent(slug.current)}`}>
                    <li className="bg-white border border-gray-200 my-2 rounded-lg shadow-sm transition duration-300 hover:shadow-md cursor-pointer dark:bg-gray-800/80 dark:border-gray-700">
                      <div className="flex">
                        <div className="relative w-4/12">
                          <Image
                            src={cover?.url || ''}
                            alt={title}
                            fill
                            placeholder={cover?.blurDataURL ? 'blur' : undefined}
                            blurDataURL={cover?.blurDataURL}
                            className="rounded-l-lg object-cover"
                            style={cover?.objectPosition ? { objectPosition: cover.objectPosition } : undefined}
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                        <div className="p-4 w-8/12 bg-white dark:bg-gray-900 rounded-r-lg">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h2 className="text-xl font-semibold cursor-pointer text-gray-900 dark:text-white">{title}</h2>
                              <p className="text-gray-600 dark:text-gray-300 text-sm my-1">
                                Published on {new Date(publishedAt).toLocaleDateString()}
                              </p>
                            </div>
                            {category?.title && (
                              <span className="ml-2 text-xs font-semibold px-3 py-1 rounded-full text-white bg-slate-900 dark:bg-slate-200 dark:text-slate-900 whitespace-nowrap">
                                {category.title}
                              </span>
                            )}
                          </div>
                          {tags && tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {tags.map(({ _id = '', title = '', slug }) => (
                                <span
                                  key={_id || title}
                                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-700 dark:text-white"
                                >
                                  {title || slug}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  </Link>
                );
              })
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-300">No posts match this tag yet.</div>
            )}
          </ul>
          <div ref={loadMoreRef} className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            {isLoadingMore ? 'Loading…' : isReachingEnd ? 'No more posts' : 'Scroll to load more'}
          </div>
        </div>
      </section>
    </div>
  );
};

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const tagsQuery = '*[_type == "postTag"] | order(title asc){_id, title, description, "slug": slug.current}';
  const categoriesQuery = '*[_type == "postCategory"] | order(title asc){_id, title}';

  const [initialPage, tagsList, categoriesList] = await Promise.all([
    fetchPostsPage(0, FIRST_PAGE_SIZE),
    client.fetch<PostTag[]>(tagsQuery),
    client.fetch<PostCategory[]>(categoriesQuery),
  ]);

  return {
    props: {
      initialPage,
      tagsList: tagsList || [],
      categoriesList: categoriesList || [],
    },
    revalidate: 600, // 10 minutes
  };
};

export default BlogPage;
