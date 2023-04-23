import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()

  const linkCss = "hover:font-semibold transition-all"

  function handleSignOut() {
    //@ts-ignore
    signOut({ redirect: "/" })
  }

  return (
    <header className={`px-6 md:px-40 h-20 flex justify-between items-center border-b border-b-black fixed top-0 left-0 w-full glass`}>
      <Link href='/' className="text-2xl upercase font-semibold">
        TYPER
      </Link>
      <nav className="flex gap-12">
        <Link className={linkCss} href="/explore">Explorar</Link>
        {session && <>
          <Link className={linkCss} href="/user/groups">Meus Grupos</Link>
          <Link className={linkCss} href="/premium">Seja Premium</Link></>}
      </nav>
      <nav>
        {session ?
          <button className={linkCss} onClick={handleSignOut} >Meu Perfil</button> :
          <Link className={linkCss} href="/login">Login</Link>
        }

      </nav>
    </header>
  )
}