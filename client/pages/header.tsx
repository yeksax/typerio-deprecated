import { useUser } from "@auth0/nextjs-auth0/client"
import Link from "next/link"

export default function Header() {
  const { user, error, isLoading } = useUser()
  const linkCss = "hover:font-semibold transition-all"

  return (
    <header className={` px-40 h-20 flex justify-between items-center border-b border-b-black fixed top-0 left-0 w-full glass`}>
      <Link href='/' className="text-2xl upercase font-semibold">
        TYPER
      </Link>
      <nav className="flex gap-12">
        <Link className={linkCss} href="/explore">Explorar</Link>
        {user && <>
          <Link className={linkCss} href="/user/groups">Meus Grupos</Link>
          <Link className={linkCss} href="/premium">Seja Premium</Link></>}
      </nav>
      <nav>
        {user ?
          <Link className={linkCss} href="/api/auth/logout">Meu Perfil</Link> :
          <Link className={linkCss} href="/api/auth/login">Login</Link>
        }

      </nav>
    </header>
  )
}