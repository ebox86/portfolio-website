import React from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { PortableText } from '@portabletext/react';
import client from '../../sanityClient';

type LegalDoc = {
  title?: string;
  body?: any;
  updatedAt?: string;
};

interface TermsProps {
  doc: LegalDoc | null;
}

const portableComponents = {
  marks: {
    link: (props: any) => (
      <a
        href={props?.value?.href}
        target={props?.value?.href?.startsWith('http') ? '_blank' : undefined}
        rel="noreferrer"
        className="text-indigo-600 dark:text-indigo-300 hover:underline"
      >
        {props.children}
      </a>
    ),
  },
  list: {
    bullet: (props: any) => <ul className="list-disc pl-5 space-y-2">{props.children}</ul>,
    number: (props: any) => <ol className="list-decimal pl-5 space-y-2">{props.children}</ol>,
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-3">{children}</h3>,
    normal: ({ children }: any) => <p className="text-gray-700 dark:text-gray-200 leading-7">{children}</p>,
  },
};

const TermsPage: React.FC<TermsProps> = ({ doc }) => {
  const lastUpdated = doc?.updatedAt ? new Date(doc.updatedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

  return (
    <div className="w-full space-y-6 pb-10">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{doc?.title || 'Terms of Service'}</h1>
      <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>

      {doc?.body ? (
        <PortableText value={doc.body} components={portableComponents} />
      ) : (
        <p className="text-gray-700 dark:text-gray-200">
          Content coming soon. Questions? Reach out at{' '}
          <a className="text-indigo-600 hover:underline" href="mailto:evan@ebox86.com">
            evan@ebox86.com
          </a>{' '}
          or via the <Link className="text-indigo-600 hover:underline" href="/contact">contact page</Link>.
        </p>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps<TermsProps> = async () => {
  const doc = await client.fetch(
    `*[_type == "legalPage" && (slug.current == $slug || _id == $id)][0]{title, body, "updatedAt": _updatedAt}`,
    { slug: 'terms', id: 'terms' }
  );

  return {
    props: { doc: doc || null },
    revalidate: 600,
  };
};

export default TermsPage;
