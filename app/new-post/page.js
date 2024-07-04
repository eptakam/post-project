import FormSubmit from '@/components/form-submit';
import { storePost } from '@/lib/posts';
import { redirect } from 'next/navigation';

/*
    Note:
      en React, nous avons deux options pour gérer les formulaires: 'form action' et 'Server actions'

      - 'form action': une fonction est creee soit dans un fichier separe ou dans le meme fichier pour traiter les donnees du formulaire. et cette fonction est appelee dans l'attribut 'action' du formulaire. cette fonction recoit automatiquement un objet 'formData' qui contient les donnees du formulaire.

      - 'Server actions': une fonction est creee dans un fichier separe pour traiter les donnees du formulaire. cette fonction recoit les donnees du formulaire en parametre. cette fonction est appelee dans le composant pour traiter les donnees du formulaire. il est important d'ajouter 'use server' au debut de la fonction pour creer un server action. et lors la fontion doit devenir une fonction asynchrone en ajoutant 'async' avant le mot cle 'function'.
*/

export default function NewPostPage() {
  async function createPost(formData) {
    "use server"; // creer un server action
    const title = formData.get('title');
    const image = formData.get('image');
    const content = formData.get('content');

    // appeler la fonction 'storePost' qui est dans le fichier 'lib/posts.js' pour enregistrer le post
    await storePost({
      // nous avons ajoute le await pour attendre que la fonction 'storePost' soit terminee avant de rediriger l'utilisateur et surtout porce que nous voulons utiliser un loading fallback pendant le traitement du formulaire
      imageUrl: '',
      title,  // ou title: title. title, est possible car le nom de la variable est le meme que le nom de la propriete (key)
      content,  // ou content: content
      userId: 1
    });

    redirect('/feed'); // rediriger l'utilisateur vers la page feed
  }

  return (
    <>
      <h1>Create a new post</h1>
      <form action={createPost}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </p>
        <p className="form-control">
          <label htmlFor="image">Image URL</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows="5" />
        </p>
        <p className="form-actions">
          <FormSubmit />
        </p>
      </form>
    </>
  );
}
