import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"

export default function Header() {
  const { data: session } = useSession()

  const linkCss = "hover:font-semibold transition-all"

  let isChatting = false
  let chat: string;

  const router = useRouter()
  if (router.pathname == '/group/[group]') {
    isChatting = true
    chat = router.query.group as string
  }

  return (
    <header className={`px-6 md:px-40 h-20 flex justify-between items-center border-b-2 border-b-black fixed top-0 left-0 w-full glass`}>
      <Link href='/' className="text-2xl upercase font-extrabold">
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
          <Link className={linkCss} href={`/user/settings`}>Meu Perfil</Link> :
          <Link className={linkCss} href="/auth/signin">Login</Link>
        }
      </nav>
    </header>
  )
}