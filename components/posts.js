import { formatDate } from "@/lib/format";
import LikeButton from "./like-icon";
import { togglePostLikeStatus } from "@/actions/posts";

function Post({ post }) {
  return (
    <article className="post">
      <div className="post-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{" "}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            {/* 
                togglePostLikeStatus est un server actions 

                garder a l'esprit que le server action 'togglePostLikeStatus' a besoin d'un argument postId pour fonctionner correctement. or pour le faire, nous utilisons la methode .bind() pour preconfigurer l'argument postId cad definir la valeur de l'argument lorsque 'togglePostLikeStatus' sera executee dans le futur.

                cette methode prend deux arguments:
                - le premier argument represente la valeur de 'this' dans la fonction 'togglePostLikeStatus'. ici, nous n'avons pas besoin de definir la valeur de 'this' donc nous passons null.
                - le deuxieme argument sera la nouvelle premiere valeur de la fonction 'togglePostLikeStatus' lorsqu'elle sera executee dans le futur. ici, nous passons post.id pour definir la valeur de postId.
            */}
            <form action={togglePostLikeStatus.bind(null, post.id)} className={post.isLiked ? 'liked' : ''}>
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  return (
    <ul className="posts">
      {posts.map((post) => (
        <li key={post.id}>
          <Post post={post} />
        </li>
      ))}
    </ul>
  );
}
