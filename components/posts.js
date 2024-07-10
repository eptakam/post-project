"use client";

import { formatDate } from "@/lib/format";
import LikeButton from "./like-icon";
import { togglePostLikeStatus } from "@/actions/posts";
import { useOptimistic } from "react";
import Image from "next/image";

/*
    Nous desirons optimiser les images qui seront generees par les utilisateurs en utilisant le composant Image de 'next/image'. le probleme est que les images peuvent etre de tailles differentes et nous ne pouvons pas definir une taille fixe pour toutes les images. pour resoudre ce probleme, nous utiliserons l'attribut 'fill'

    en ajoutant cet attribut 'fill', nous avons un autre probleme du au fait que NextJs pas securite bloque le chargement d'image. car nous utilisons un lien externe pour charger les images. pour resoudre ce probleme, nous devons ajouter le lien de l'image dans le fichier 'next.config.mjs' pour autoriser le chargement des images.

    l'autorisation du chargement des images fait, nous rencontrons un autre probleme: les images sont chargees en full screen a cause de l'attribut 'fill'. pour resoudre ce probleme, nous devons ajouter une classe CSS pour definir la taille de l'image dans un conteiner contenant l'image. le container parent de l'image doit avoir:
      - une position relative.
      - une taille definie.

    Cloudinary nous permet manipuler l'url des images et d'ajouter certaines extra configurations qui feront en sorte que Cloudinary genere plusieurs versions d'un fichier image, les cache et les serve ces differentes versions a notre application.

    on utilise ces capacites de Cloudinary via le props 'loader'. le props 'loader' qui prend comme valeur une fonction (imageLoader) qui retourne une chaine de caractere representant l'url de l'image a charger.

    nous pouvons nous meme definir une qualite de l'image (quality={50})

    pour generer un url different pour chaque image, nous devons separer l'url generee par Cloudinary en deux parties: une partie representant le nom de l'image et l'autre partie representant tout l'url jusqu'a /upload/. 

    pour finir, nous allons enlever le props 'fill' et ajouter les props 'width' et 'height' pour definir la taille de l'image. car sinon, il nous faudra definir au moins un element pour le props 'sizes' pour eviter le warning au niveau du browser.
*/

function imageLoader(config) {
  const urlStart = config.src.split("upload/")[0];
  const urlEnd = config.src.split("upload/")[1];
  // const transfomtions = `w_200,h_150,q_${config.quality}`;
  const transfomtions = `w_200,q_${config.quality}`; // pour eviter la distorsion de l'image, on ne definit que la largeur de l'image
  return `${urlStart}upload/${transfomtions}/${urlEnd}`;
}

function Post({ post, action }) {
  return (
    <article className="post">
      <div className="post-image">
        {/* <img src={post.image} alt={post.title} /> */}
        <Image
          loader={imageLoader}
          src={post.image}
          width={200}
          height={120}
          alt={post.title}
          quality={50}
        />
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
            <form
              action={action.bind(null, post.id)}
              className={post.isLiked ? "liked" : ""}
            >
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
  /*
 pour annuler le temps d'attente qu'il y a avant la mise a jour, par exemple lorsqu'on like un post, en plus d'utiliser la fonction revalidatePath() de 'next/cache', nous allons utiliser le hook 'optimistic' de 'react'. 

 hook 'useOptimistic()' prend deux arguments:
    - le premier argument est la donnee de depart (les donnees que nous fetchons de la BD). ici, nous passons 'posts' qui est la liste des posts.
    - le deuxieme argument est une fonction qui sera executee automatiquement par React au moment setter pour mettre a jour les donnees passees de maniere optimiste. 

le hook 'useOptimistic()' retourne un tableau avec deux elements:
    - le premier element est la donnee optimiste.
    - le deuxieme element est la fonction qui nous permettra de declencher la mise a jour optimiste.

    par la suite, nous remplacerons 'posts' par 'optimisticPosts' dans le composant 'Posts' pour afficher les donnees de maniere optimiste.

    apres avoir definit la logique de la mise jour optimiste, il faut s'assurer qu'on appelle la fonction 'updatedOptimisticPosts()' pour declencher la mise a jour optimiste, et qu'on lui passe l'id du post qui a ete mis a jour.

    cela se fera en creant une nouvelle action que nous passerons en tant que prop a notre composant 'Post' pour mettre a jour le statut du like.
    
    Ne pas oublier de passer le props action a la fonction 'Post' et remplacer 'togglePostLikeStatus' par 'action' dans le composant 'Post' au niveau de l'attribut 'action' de la balise 'form'.

    terminer en ajoutant 'use client' au-dessus de tous les composants pour pouvoir utiliser le hook 'useOptimistic()'.
*/

  const [optimisticPosts, updatedOptimisticPosts] = useOptimistic(
    posts,
    (prevPosts, updatedPostId) => {
      // trouver l'index du post qui sera mis a jour
      const updatedPostIndex = prevPosts.findIndex(
        (post) => post.id === updatedPostId
      );

      // verifier si un post a ete mis a jour
      if (updatedPostIndex === -1) {
        return prevPosts;
      }

      // creer une copie de la liste des posts dans un nouvel objet
      const updatedPosts = { ...prevPosts[updatedPostIndex] };

      // mettre a jour le nombre de likes et le statut du like
      updatedPosts.likes =
        updatedPosts.isLiked + (updatedPosts.isLiked ? -1 : 1);
      updatedPosts.isLiked = !updatedPosts.isLiked; // inverser le statut du like (true -> false, false -> true)

      // creer une nouvelle liste de posts avec le post mis a jour
      const newPosts = [...prevPosts];
      newPosts[updatedPostIndex] = updatedPosts;

      return newPosts;
    }
  );

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  // nouvelle action pour mettre a jour le statut du like
  async function updatedPost(postId) {
    updatedOptimisticPosts(postId);
    await togglePostLikeStatus(postId);
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatedPost} />
        </li>
      ))}
    </ul>
  );
}
