import React from 'react';
import sanityClient from '../../../sanityClient';
import { PortableText } from '@portabletext/react'; 

interface BlogPost {
  _id: string;
  slug: any;
  title: string;
  body: any; // Change the type to 'any' for Portable Text
  // Add more fields as needed
}

interface BlogPostPageProps {
  post: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  return (
    <div className="bg-gray-100 mx-auto p-4">
      <h1 className="text-2xl font-semibold text-left mb-8">{post.title}</h1>
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Render the Portable Text content */}
        <PortableText value={post.body} />
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  // Fetch all blog post slugs from Sanity
  const query = '*[_type == "post"].slug.current';
  const slugs = await sanityClient.fetch<string[]>(query);

  // Generate paths for all slugs
  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  // Fetch the specific blog post based on the slug
  const query = `*[_type == "post" && slug.current == "${params.slug}"][0]`;
  const post = await sanityClient.fetch<BlogPost>(query);

  return {
    props: { post },
  };
}

export default BlogPostPage;
