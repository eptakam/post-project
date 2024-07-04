/*
    nous creons ce composant pour resoudre le probleme de conflit entre 'use client' et 'use server' dans le fichier 'app/new-post/page.js'. survenu lors de la validation du formulaire grace au hook useFormState qui ne fonctionne que dans un composant client. cependant, la fonction createPost() avait besoin d'etre executee dans un composant server. 

    nous allons creer un composant pour le formulaire qui lui sera un composant client
*/

"use client";

import FormSubmit from "@/components/form-submit";
import { useFormState } from "react-dom";

export default function PostForm({ action }) {
  /*
    Note:
      - 'useFormState': est un hook qui permet de gerer l'etat du formulaire. il prend en premier parametre la fonction qui est passee l'attribut action du formulaire. dans notre cas, c'est la fonction 'createPost' qui est appelee lors de la soumission du formulaire. Le segond argument est l'etat initial: dans notre cas, c'est un objet vide ({}) car au debut, le tableau d'erreur est vide. il retourne exactement deux valeurs que nous stockerons dans un tableau: l'etat du formulaire (state) et la fonction (formAction) qui sera passee a l'attribut 'action' du formulaire pour que React puisse ecouter les soumissions du formulaire et mettre a jour l'etat du formulaire (state).

      attention: a cause du fait que nous avons separe les composants, il ne faut pas perdre de vue que c'est le props 'action' qui recevra la fonction 'createPost' dans le composant 'PostForm' qui est dans le fichier 'app/new-post/page.js'. Car un composant client peut bien recevoir un composant serveur comme props. c'est donc le props 'action' qui sera passe en premier argument a 'useFormState' pour gerer l'etat du formulaire.
  */

  const [state, formAction] = useFormState(action, {});

  return (
    <>
      <h1>Create a new post</h1>
      <form action={formAction}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
          {/* afficher les erreurs dues au titre en dessous du champ de saisie */}
          {state.errors &&
            state.errors
              .filter((error) => error === "Title is required")
              .map((error) => (
                <div key={error} className="input-error">
                  {error}
                </div>
              ))
          }
        </p>
        <p className="form-control">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
          {/* afficher les erreurs dues a l'image en dessous du champ de selection */}
          {state.errors &&
            state.errors
              .filter((error) => error === "Image is required")
              .map((error) => (
                <div key={error} className="input-error">
                  {error}
                </div>
              ))
          }
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows="5" />
          {/* afficher les erreurs dues au contenu en dessous du champ de saisie */}
          {state.errors &&
            state.errors
              .filter((error) => error === "Content is required")
              .map((error) => (
                <div key={error} className="input-error">
                  {error}
                </div>
              ))
          }
        </p>
        <p className="form-actions">
          {/* les boutons de soumission du formulaire sont remplaces par le composant 'FormSubmit' qui est dans le fichier 'components/form-submit.js' */}
          <FormSubmit />
        </p>
        {/* afficher les erreurs du formulaire en dessous du formulaire*/}
        {state.errors && (
          <ul className="form-errors">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </form>
    </>
  );
}
