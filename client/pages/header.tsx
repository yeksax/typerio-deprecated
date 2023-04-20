import { useUser } from "@auth0/nextjs-auth0/client"
import Link from "next/link"

export default function Header() {
  const { user, error, isLoading } = useUser()

  return (
    <header className={` px-40 h-20 flex justify-between items-center border-b border-b-black fixed top-0 left-0 w-full glass`}>
      <Link href='/' className="text-2xl upercase font-semibold">
        TYPER
      </Link>
      <nav className="flex gap-12">
        <Link href="/explore">Explorar</Link>
        <Link href="/wpm">WPM Runner</Link>
        <Link href="/premium">Seja Premium</Link>
      </nav>
      <nav>
        {user ?
          <Link href="/api/auth/logout">Meu Perfil</Link> :
          <Link href="/api/auth/login">Login</Link>
        }

      </nav>
    </header>
  )
}