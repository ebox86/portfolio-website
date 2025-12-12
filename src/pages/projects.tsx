import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import client from '../../sanityClient';
import { GetStaticProps } from 'next';
import { buildSanityImage } from '../lib/sanityImage';

type Category = {
  _id?: string;
  key: string;
  label: string;
  emoji?: string;
  summary?: string;
  gradientStart?: string;
  gradientEnd?: string;
};

type Project = {
  title: string;
  subtitle?: string;
  category?: any;
  categorySlug?: string;
  categoryRef?: string;
  added?: string;
  updated?: string;
  status?: string;
  featured?: boolean;
  slug?: string;
  image?: any;
  links?: {
    live?: string;
    repo?: string;
  };
};

type ProjectsProps = {
  categories: Category[];
  projects: Project[];
  featuredProject?: Project | null;
};

const defaultTone = { start: '#a855f7', end: '#6366f1' };

const ProjectsPage: React.FC<ProjectsProps> = ({ categories = [], projects = [], featuredProject }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [page, setPage] = useState<number>(0);
  const PAGE_SIZE = 6;

  const categoryMap = useMemo(() => {
    const map: Record<string, Category> = {};
    (categories || []).forEach((c) => {
      if (c?.key) map[c.key] = c;
    });
    return map;
  }, [categories]);

  const categoryIdMap = useMemo(() => {
    const map: Record<string, Category & { _id?: string }> = {};
    (categories as any[] || []).forEach((c: any) => {
      if (c?._id) map[c._id] = c;
    });
    return map;
  }, [categories]);

  const projectCategoryKey = useCallback(
    (project: Project) => {
      if (project.categoryRef && categoryIdMap[project.categoryRef]?.key) {
        return categoryIdMap[project.categoryRef].key;
      }
      if (project.category && typeof project.category === 'object' && (project.category as any)._ref) {
        const ref = (project.category as any)._ref as string;
        if (ref && categoryIdMap[ref]?.key) return categoryIdMap[ref].key;
      }
      return project.category || project.categorySlug;
    },
    [categoryIdMap],
  );

  const recentCategoryKeys = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const recents = new Set<string>();
    (projects || []).forEach((p) => {
      const catKey = projectCategoryKey(p);
      if (!catKey) return;
      const addedDate = p.added ? new Date(`${p.added}`) : null;
      const updatedDate = p.updated ? new Date(`${p.updated}`) : null;
      const latest = updatedDate && addedDate ? (updatedDate > addedDate ? updatedDate : addedDate) : (updatedDate || addedDate);
      if (latest && latest >= cutoff) {
        recents.add(catKey);
      }
    });
    return recents;
  }, [projects, projectCategoryKey]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter((p) => projectCategoryKey(p) === activeCategory);
  }, [activeCategory, projects, projectCategoryKey]);

  const pagedProjects = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredProjects.slice(start, start + PAGE_SIZE);
  }, [filteredProjects, page]);

  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));

  useEffect(() => {
    if (page >= pageCount) {
      setPage(0);
    }
  }, [page, pageCount]);
  const featuredImage = useMemo(() => buildSanityImage(featuredProject?.image, { width: 1200, height: 640 }), [featuredProject]);
  const featuredCategory = featuredProject ? categoryMap[projectCategoryKey(featuredProject) || ''] : null;

  return (
    <div className="w-full space-y-10">
      <header className="space-y-3">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white">Projects</h1>
        <p className="text-lg text-gray-700 dark:text-gray-200">
          Curated side projects, tools, and experiments.
        </p>
      </header>

      {featuredProject && (
        <section className="relative grid gap-6 overflow-visible rounded-3xl border border-gray-200 bg-gradient-to-r from-orange-50 via-white to-indigo-50 p-6 shadow-sm dark:border-gray-700 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 md:grid-cols-5">
          <span className="absolute -top-4 right-3 text-base font-semibold px-3 py-1 rounded-full bg-amber-400 text-amber-900 shadow-sm border border-amber-500 dark:bg-amber-400 dark:text-amber-900 dark:border-amber-500">
            Featured
          </span>
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              {featuredCategory && (
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                  style={{
                    background: `linear-gradient(90deg, ${featuredCategory?.gradientStart || defaultTone.start}, ${featuredCategory?.gradientEnd || defaultTone.end})`,
                  }}
                >
                  {featuredCategory?.emoji ? `${featuredCategory.emoji} ` : ''}
                  {featuredCategory?.label}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{featuredProject.title}</h2>
              {featuredProject.subtitle && (
                <p className="text-base text-gray-700 dark:text-gray-200">{featuredProject.subtitle}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {featuredProject.slug && (
                <Link
                  href={`/projects/${encodeURIComponent(featuredProject.slug)}`}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  <span aria-hidden>📄</span> Project details
                </Link>
              )}
              {featuredProject.links?.live && (
                <a
                  href={featuredProject.links.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-orange-100 dark:bg-orange-500"
                >
                  View live
                </a>
              )}
              {featuredProject.links?.repo && (
                <a
                  href={featuredProject.links.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.52 7.52 0 012.01-.27c.68 0 1.36.09 2.01.27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  View code
                </a>
              )}
            </div>
          </div>
          <div className="relative md:col-span-2 h-56 md:h-full rounded-2xl overflow-hidden border border-gray-200 bg-white/50 dark:border-gray-700 dark:bg-gray-800/80">
            {featuredImage ? (
              <Image
                src={featuredImage.url}
                alt={featuredProject.title}
                fill
                className="object-cover"
                placeholder={featuredImage.blurDataURL ? 'blur' : undefined}
                blurDataURL={featuredImage.blurDataURL}
                style={featuredImage.objectPosition ? { objectPosition: featuredImage.objectPosition } : undefined}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-300">
                No preview image
              </div>
            )}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Categories</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Select to filter</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((card) => (
            <button
              key={card.key}
              onClick={(e) => {
                const next = activeCategory === card.key ? 'all' : card.key;
                setActiveCategory(next);
                setPage(0);
                if (next === 'all') e.currentTarget.blur();
              }}
              className={`relative h-full text-left rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80 p-5 flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 dark:focus:ring-offset-gray-900 ${
                activeCategory === card.key ? 'ring-2 ring-offset-2 ring-orange-400 dark:ring-offset-gray-900' : ''
              }`}
            >
              {recentCategoryKeys.has(card.key) && (
                <span className="absolute -top-4 right-3 text-base font-semibold px-3 py-1 rounded-full bg-emerald-500 text-white shadow-sm border border-emerald-600 dark:bg-emerald-500 dark:text-white dark:border-emerald-500">
                  New
                </span>
              )}
              <div className="flex flex-col items-start gap-3">
                {card.emoji && (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-gray-700">
                    {card.emoji}
                  </span>
                )}
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white break-words">{card.label}</h2>
              </div>
              {card.summary && <p className="text-sm text-gray-700 dark:text-gray-200 break-words">{card.summary}</p>}
              <div
                className="mt-auto h-1.5 w-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${card?.gradientStart || defaultTone.start}, ${card?.gradientEnd || defaultTone.end})`,
                }}
              />
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {activeCategory === 'all'
              ? 'All projects'
              : `${categoryMap[activeCategory]?.label || 'Category'} projects`}
          </h3>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
              {pagedProjects.map((project) => {
                const catKey = projectCategoryKey(project) || '';
                const cat = categoryMap[catKey];
                const projectHref = project.slug ? `/projects/${encodeURIComponent(project.slug)}` : null;
                const projectImage = buildSanityImage(project.image, { width: 400, height: 260 });

                const cardContent = (
                  <div
                    className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition dark:border-gray-700 dark:bg-gray-800/80"
                  >
                    <div className="flex items-start gap-4 px-4 py-2.5">
                      <div className="flex flex-1 flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h4>
                        </div>
                        <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-orange-400 to-purple-500" />
                        {project.subtitle && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 break-words">{project.subtitle}</p>
                        )}
                      </div>
                      {projectImage && (
                        <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
                          <Image
                            src={projectImage.url}
                            alt={project.title}
                            fill
                            className="object-cover"
                            placeholder={projectImage.blurDataURL ? 'blur' : undefined}
                            blurDataURL={projectImage.blurDataURL}
                            style={projectImage.objectPosition ? { objectPosition: projectImage.objectPosition } : undefined}
                            sizes="128px"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );

                return (
                  <div key={project.slug || project.title} className="mb-3 last:mb-0">
                    {projectHref ? (
                      <Link href={projectHref} className="block">
                        {cardContent}
                      </Link>
                    ) : (
                      cardContent
                    )}
                  </div>
                );
              })}
          </div>
          {pageCount > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {Array.from({ length: pageCount }).map((_, idx) => {
                const isActive = idx === page;
                return (
                  <button
                    key={idx}
                    onClick={() => setPage(idx)}
                    className={`min-w-[36px] rounded-md px-3 py-1 text-sm font-semibold transition shadow-sm ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export const getStaticProps: GetStaticProps<ProjectsProps> = async () => {
  const categoriesQuery =
    '*[_type=="projectCategory"]|order(coalesce(order,0) asc, title asc){ "_id": _id, "key": slug.current, "label": title, "emoji": emoji, "summary": description, "gradientStart": gradientStart.hex, "gradientEnd": gradientEnd.hex }';

  const projectFields = `
    "title": title,
    "subtitle": summary,
    "slug": slug.current,
    "categoryRef": category._ref,
    "category": category,
    "categorySlug": category->slug.current,
    "added": _createdAt,
    "updated": _updatedAt,
    "status": status,
    "featured": featured,
    "links": links,
    "image": image{
      ...,
      asset->{url, metadata{lqip}}
    }
  `;

  const projectsQuery = `*[_type=="project"]|order(coalesce(order,0) desc, _createdAt desc){ ${projectFields} }`;
  const featuredProjectQuery = `*[_type=="project" && featured == true]|order(coalesce(order,0) desc, _createdAt desc)[0]{ ${projectFields} }`;

  const [categories, projects, featuredProject] = await Promise.all([
    client.fetch<Category[]>(categoriesQuery),
    client.fetch<Project[]>(projectsQuery),
    client.fetch<Project | null>(featuredProjectQuery),
  ]);

  return {
    props: {
      categories: categories || [],
      projects: projects || [],
      featuredProject: featuredProject || null,
    },
    revalidate: 600,
  };
};

export default ProjectsPage;
