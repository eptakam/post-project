import PostForm from "@/components/post-form";
import { createPost } from "@/actions/posts";

/*
    Note:
      en React, nous avons deux options pour gérer les formulaires: 'form action' et 'Server actions'

      - 'form action': une fonction est creee soit dans un fichier separe ou dans le meme fichier pour traiter les donnees du formulaire. et cette fonction est appelee dans l'attribut 'action' du formulaire. cette fonction recoit automatiquement un objet 'formData' qui contient les donnees du formulaire.

      - 'Server actions': une fonction est creee dans un fichier separe pour traiter les donnees du formulaire. cette fonction recoit les donnees du formulaire en parametre. cette fonction est appelee dans le composant pour traiter les donnees du formulaire. il est important d'ajouter 'use server' au debut de la fonction pour creer un server action. et lors la fontion doit devenir une fonction asynchrone en ajoutant 'async' avant le mot cle 'function'.
*/

export default function NewPostPage() {
 
  return (
    <PostForm action={createPost} />
  ); 
}
