import React from 'react';
import sanityClient from '../../../sanityClient';
import { PortableText } from '@portabletext/react'; 
import client from '../../../sanityClient';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

interface BlogPost {
  _id: string;
  slug: any;
  title: string;
  body: any;
  mainImage: any;
}

interface BlogPostPageProps {
  post: BlogPost;
}

const getImageUrl = (imageField: any) => {
  return builder.image(imageField).url() || '';
};

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  return (
    <div className="bg-gray-100 mx-auto p-4">
      <img
        src={getImageUrl(post.mainImage)} 
        alt={post.title}
        className="w-full h-96 object-cover rounded-lg shadow-md mb-4"
      />

      <h1 className="text-2xl font-semibold text-left mb-4">{post.title}</h1>
      <div className="bg-white rounded-lg shadow-md p-4">
        {post.body ? 
        (
          <PortableText value={post.body} />
          ) : (
          <p>No content available for this post.. i probably forgot to add a body.. <i>Opps</i></p>
        )}
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const query = '*[_type == "post"].slug.current';
  const slugs = await sanityClient.fetch<string[]>(query);

  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const query = `*[_type == "post" && slug.current == "${params.slug}"][0]`;
  const post = await sanityClient.fetch<BlogPost>(query);

  return {
    props: { post },
  };
}

export default BlogPostPage;
