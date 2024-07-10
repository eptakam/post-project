import logo from "@/assets/logo.png";
import Image from "next/image";

import Link from "next/link";

export default function Header() {
  return (
    <header id="main-header">
      <Link href="/">
        {/* <img src={logo.src} alt="Mobile phone with posts feed on it" /> */}
        <Image
          src={logo}  
          // definir le width et height lorsqu'on aura une taille d'image fixe peu importe la taille de l'ecran
          width={100}
          height={100}
          // sizes="10vw"  // 10% of the viewport width. pratique recommandee pour l'optimisation de l'image
          alt="Mobile phone with posts feed on it"
        />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/feed">Feed</Link>
          </li>
          <li>
            <Link className="cta-link" href="/new-post">
              New Post
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
