/*
    ceci nous permettra de remplacer le bouton de soumission du formulaire pour avoir un loading fallback pendant le traitement du formulaire
*/
'use client';

import { useFormStatus } from "react-dom";
// import { useActionState } from "react";

export default function FormSubmit({ children, onSubmit }) {
  const status = useFormStatus(); // ne peut etre utilise que dans un composant client
  // const status = useActionState(); // ne peut etre utilise que dans un composant client

  if (status.pending) {
    return <p>Creating post...</p>;
  }
  
  return (
    <>
    {/* mettre le/les boutons a remplacer ici... */}
      <button type="reset">Reset</button>
      <button>Create Post</button>
    </>
  );
}
