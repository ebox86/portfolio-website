import BlogPostPage, { BlogPost } from "./blog-post-page"
import client from '../../../../sanityClient';

async function getPostBySlug(slug: string) {
    const query = `*[_type == "post" && slug.current == "${slug}"][0]`;
    const post = await client.fetch<BlogPost>(query);
    return {
        props: { post },
        revalidate: 600 // 10 mins
    };
}

export default async function Page({ params }: { params: { slug: string } }) {
    const post = (await getPostBySlug(params.slug)).props.post
    return <BlogPostPage {...post}  />
}