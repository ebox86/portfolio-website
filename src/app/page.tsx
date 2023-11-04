import Home, { BlogPost }  from './home-page'
import client from '../../sanityClient'; 

async function getPosts() {
    const query = `*[_type == "post"] | order(publishedAt desc) [0..2] {
        _id,
        title,
        slug,
        publishedAt
      }`;
    
  const recentPosts = await client.fetch<BlogPost[]>(query);

  return {
    props: {
      posts: recentPosts,
    },
    revalidate: 600 // 10 min
  };
}

export default async function Page() {
  const posts = (await getPosts()).props
  return <Home posts={posts.posts} />
}