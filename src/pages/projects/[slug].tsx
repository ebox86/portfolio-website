import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import client from '../../../sanityClient';
import { buildSanityImage } from '../../lib/sanityImage';

type ProjectDoc = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  body?: any;
  status?: string;
  links?: {
    live?: string;
    repo?: string;
  };
  tags?: string[];
  added?: string;
  updated?: string;
  image?: any;
  category?: {
    title?: string;
    slug?: string;
    emoji?: string;
    gradientStart?: string;
    gradientEnd?: string;
  };
};

const portableComponents = {
  types: {
    image: (value: any) => {
      const built = buildSanityImage(value.value, { width: 1400 });
      if (!built) return null;
      return (
        <div className="mb-6 w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
          <Image
            src={built.url}
            alt={value.value?.alt || 'Project image'}
            width={built.width || 1600}
            height={built.height || 900}
            className="h-auto w-full object-contain"
            placeholder={built.blurDataURL ? 'blur' : undefined}
            blurDataURL={built.blurDataURL}
            style={built.objectPosition ? { objectPosition: built.objectPosition } : undefined}
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
      );
    },
  },
  marks: {
    code: (props: any) => (
      <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100">
        {props.children}
      </span>
    ),
    link: (props: any) => {
      const target = (props.value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <Link
          href={props.value?.href}
          target={target}
          className="font-semibold text-indigo-600 underline decoration-2 underline-offset-4 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
        >
          {props.children}
        </Link>
      );
    },
  },
  block: {
    normal: (props: any) => <p className="mb-4 leading-7 text-gray-800 dark:text-gray-200">{props.children}</p>,
    h2: (props: any) => <h2 className="mb-3 mt-6 text-3xl font-bold text-gray-900 dark:text-white">{props.children}</h2>,
    h3: (props: any) => <h3 className="mb-2 mt-5 text-2xl font-semibold text-gray-900 dark:text-white">{props.children}</h3>,
    blockquote: (props: any) => (
      <blockquote className="mb-4 border-l-4 border-orange-400 bg-orange-50 px-4 py-3 italic text-gray-800 dark:border-orange-500 dark:bg-gray-800 dark:text-gray-100">
        {props.children}
      </blockquote>
    ),
  },
  list: {
    bullet: (props: any) => <ul className="mb-4 list-disc space-y-2 pl-6">{props.children}</ul>,
    number: (props: any) => <ol className="mb-4 list-decimal space-y-2 pl-6">{props.children}</ol>,
  },
};

const ProjectPage: React.FC<{ project: ProjectDoc | null }> = ({ project }) => {
  if (!project) {
    return <div className="p-6 text-center text-gray-700 dark:text-gray-200">Project not found.</div>;
  }

  const cover = buildSanityImage(project.image, { width: 1400 });
  const gradient = project.category
    ? `linear-gradient(90deg, ${project.category.gradientStart || '#a855f7'}, ${project.category.gradientEnd || '#6366f1'})`
    : undefined;

  const statusTone: Record<string, { bg: string; text: string; border: string }> = {
    planned: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-200', border: 'border-gray-200 dark:border-gray-700' },
    inProgress: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-200 dark:border-amber-700' },
    live: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-800 dark:text-emerald-200', border: 'border-emerald-200 dark:border-emerald-700' },
    archived: { bg: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', border: 'border-gray-300 dark:border-gray-600' },
  };

  const statusClass = project.status ? statusTone[project.status] || statusTone.planned : null;

  return (
    <div className="mx-auto min-h-screen max-w-5xl space-y-5 px-4 pt-0">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/projects"
          className="text-sm font-semibold text-gray-600 underline decoration-2 underline-offset-4 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          ← Back to projects
        </Link>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.7fr)_minmax(220px,300px)] md:items-start">
          <div className="min-w-0 space-y-3">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
            {project.summary && <p className="text-lg text-gray-700 dark:text-gray-200">{project.summary}</p>}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 space-y-3 md:self-start md:max-w-[18rem]">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Details</h4>
            </div>

            <div className="space-y-1">
              {project.category && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="whitespace-nowrap font-semibold dark:text-white">Category:</span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white whitespace-nowrap"
                    style={{ background: gradient }}
                  >
                    {project.category?.emoji ? `${project.category.emoji} ` : ''}
                    {project.category?.title || 'Category'}
                  </span>
                </div>
              )}
              {statusClass && (
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap font-semibold dark:text-white">Status:</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border whitespace-nowrap ${statusClass.bg} ${statusClass.text} ${statusClass.border}`}>
                    {project.status === 'inProgress'
                      ? 'In Progress'
                      : project.status === 'live'
                      ? 'Live'
                      : project.status === 'archived'
                      ? 'Archived'
                      : project.status || 'Status'}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {project.added && (
                <div>
                  <span className="font-semibold">Created:</span> {new Date(project.added).toLocaleDateString()}
                </div>
              )}
              {project.updated && (
                <div>
                  <span className="font-semibold">Updated:</span> {new Date(project.updated).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                >
                  <span aria-hidden>🌐</span> Live site
                </a>
              )}
              {project.links?.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.52 7.52 0 012.01-.27c.68 0 1.36.09 2.01.27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  Repository
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {project.body ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <PortableText value={project.body} components={portableComponents as any} />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          No detailed writeup yet. Check back soon!
        </div>
      )}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch<string[]>('*[_type == "project" && defined(slug.current)].slug.current');
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<{ project: ProjectDoc | null }> = async ({ params }) => {
  const slug = params?.slug as string;
  const query = `
    *[_type=="project" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      summary,
      body,
      status,
      "added": _createdAt,
      "updated": _updatedAt,
      links,
      tags,
      image{
        ...,
        asset->{url, metadata{lqip}},
        crop,
        hotspot
      },
      category->{
        title,
        "slug": slug.current,
        emoji,
        "gradientStart": gradientStart.hex,
        "gradientEnd": gradientEnd.hex
      }
    }
  `;

  const project = await client.fetch<ProjectDoc | null>(query, { slug });

  if (!project) {
    return { notFound: true };
  }

  return {
    props: {
      project,
    },
    revalidate: 600,
  };
};

export default ProjectPage;
