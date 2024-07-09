import Posts from '@/components/posts';
import { getPosts } from '@/lib/posts';

// jouter des meta data dynamiques a la page. Pour cela, nous utiliserons la fonction generateMetadata() qui prendra en argument le nombre de posts affiches sur la page. Cette fonction retournera un objet avec les proprietes title et description.
export async function generateMetadata() {
  const posts = await getPosts();
  const numberOfPosts = posts.length;
  return {
    title: `All Posts (${numberOfPosts})`,
    description: `Browse all ${numberOfPosts} posts shared by our users.`,
  };
}

export default async function FeedPage() {
  const posts = await getPosts();
  return (
    <>
      <h1>All posts by all users</h1>
      <Posts posts={posts} />
    </>
  );
}
