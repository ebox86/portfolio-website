import client from '../../../sanityClient';
import BlogPage, { BlogPageProps, BlogPost } from './blog-page';

async function getPosts() {
    const query = `*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        body,
        publishedAt,
        mainImage,
        categories[] -> {title, _id}
    }`;
  
    const posts = await client.fetch<BlogPost[]>(query);

    return {
        props: {
          posts: posts,
        },
        revalidate: 600 // 10 min
      };
};

export default async function Page() {
    const posts = (await getPosts()).props.posts
    return <BlogPage posts={posts}/>
}