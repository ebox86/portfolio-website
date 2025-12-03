import React, { useCallback, useMemo, useState } from 'react';
import client from '../../sanityClient';
import { GetStaticProps } from 'next';

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
};

type ProjectsProps = {
  categories: Category[];
  projects: Project[];
};

const defaultTone = { start: '#a855f7', end: '#6366f1' };

const ProjectsPage: React.FC<ProjectsProps> = ({ categories = [], projects = [] }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [page, setPage] = useState<number>(0);
  const PAGE_SIZE = 8;

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

  return (
    <div className="w-full space-y-10">
      <header className="space-y-3">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white">Projects</h1>
        <p className="text-lg text-gray-700 dark:text-gray-200">
          Curated builds, infra work, and experiments. Pick a category to drill in; below is the full list.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((card) => (
          <button
            key={card.key}
            onClick={() => {
              setActiveCategory(card.key);
              setPage(0);
            }}
            className={`relative text-left rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80 p-5 flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 dark:focus:ring-offset-gray-900 ${
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
            {card.summary && <p className="text-gray-700 dark:text-gray-200 break-words">{card.summary}</p>}
            <div
              className="h-1.5 w-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${card?.gradientStart || defaultTone.start}, ${card?.gradientEnd || defaultTone.end})`,
              }}
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">Tap to filter</div>
          </button>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">All projects</h3>
          <button
            onClick={() => setActiveCategory('all')}
            className="text-sm font-semibold px-3 py-1 rounded-full border border-gray-200 bg-white text-orange-600 hover:text-orange-700 hover:border-orange-200 hover:bg-gray-50 shadow-sm transition dark:border-gray-700 dark:bg-gray-800 dark:text-orange-300 dark:hover:text-orange-200 dark:hover:bg-gray-700"
          >
            Show all
          </button>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
              {pagedProjects.map((project) => {
                const catKey = projectCategoryKey(project) || '';
                const cat = categoryMap[catKey];
                const catLabel = cat?.label || 'Uncategorized';
                return (
                  <div
                    key={project.title}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm hover:shadow-md transition dark:border-gray-700 dark:bg-gray-800/80 mb-3 last:mb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h4>
                        <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-orange-400 to-purple-500" />
                        {project.subtitle && <p className="text-sm text-gray-700 dark:text-gray-300">{project.subtitle}</p>}
                      </div>
                      <span
                    className="ml-3 text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{
                      background: `linear-gradient(90deg, ${cat?.gradientStart || defaultTone.start}, ${cat?.gradientEnd || defaultTone.end})`,
                    }}
                  >
                        {cat?.emoji ? `${cat.emoji} ` : ''}{catLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
          {pageCount > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="text-sm font-semibold px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Page {page + 1} of {pageCount}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page + 1 >= pageCount}
                className="text-sm font-semibold px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                Next
              </button>
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

  const projectsQuery =
    '*[_type=="project"]|order(coalesce(order,0) desc, _createdAt desc){ "title": title, "subtitle": summary, "categoryRef": category._ref, "category": category, "added": _createdAt, "updated": _updatedAt, "status": status }';

  const [categories, projects] = await Promise.all([
    client.fetch<Category[]>(categoriesQuery),
    client.fetch<Project[]>(projectsQuery),
  ]);

  return {
    props: {
      categories: categories || [],
      projects: projects || [],
    },
    revalidate: 600,
  };
};

export default ProjectsPage;
