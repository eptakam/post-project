/*
    ici, nous allons creer notre server actions dans un fichier separe pour nous eviter a recourir a la repartition de composant comme cela a ete le cas avec <PostForm action={createPost} /> dans le fichier 'app/new-post/page.js'. cas c'est un composant client qui avait besoin d'un composant serveur pour gerer les donnees du formulaire. 

    pour ce faire, nous allons deplacer notre server actions 'storePost' qui est dans le fichier 'app/new-post/page.js'. pour ce fichier a la difference que 'use serer' ne sera plus dans la fonction 'storePost' mais au debut du fichier. et la fonction 'storePost' sera exportee pour etre utilisee dans le composant 'NewPostPage' qui est dans le fichier 'app/new-post/page.js'.
*/

"use server"; // creer un server action

import { redirect } from "next/navigation";
import { storePost } from "@/lib/posts";
import { uploadImage } from "@/lib/cloudinary";
import { updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";

// vu que le server action 'createPost' est passee au hook useFormState() dans le composant PostForm via l'attribut action, formData n'est plus le premier argument mais le deuxieme. le premier argument etant prevState qui est l'etat precedent du formulaire. il faut donc l'ajouter dans la signature de la fonction createPost() sinon une erreur sera declenchee (formData.get is not a function).
export async function createPost(prevState, formData) {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  // valider les donnees du formulaire
  let errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (!content || content.trim().length === 0) {
    errors.push("Content is required");
  }

  if (!image || image.size === 0) {
    errors.push("Image is required");
  }

  // verifier s'il y a au moins une erreur dans le tableau 'errors'
  if (errors.length > 0) {
    return { errors }; // retourner les erreurs pour les afficher a l'utilisateur
  }

  // appeler la fonction 'uploadImage' qui est dans le fichier 'lib/cloudinary.js' pour telecharger l'image sur le serveur
  let imageUrl;

  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error("Failed to upload image, post was not created");
  }

  // appeler la fonction 'storePost' qui est dans le fichier 'lib/posts.js' pour enregistrer le post
  await storePost({
    // nous avons ajoute le await pour attendre que la fonction 'storePost' soit terminee avant de rediriger l'utilisateur et surtout porce que nous voulons utiliser un loading fallback pendant le traitement du formulaire
    imageUrl: imageUrl,
    title, // ou title: title. title, est possible car le nom de la variable est le meme que le nom de la propriete (key)
    content, // ou content: content
    userId: 1,
  });

  redirect("/feed"); // rediriger l'utilisateur vers la page feed
}

// rendre fonctionnel le bouton pour les likes
export async function togglePostLikeStatus(postId) {
  // appeler la fonction 'updatePostLikeStatus' qui est dans le fichier 'lib/posts.js' pour mettre a jour le statut du like
  await updatePostLikeStatus(postId, 2);
  await revalidatePath('/', 'layout'); // revalider le chemin pour mettre a jour les donnees en cache
}
