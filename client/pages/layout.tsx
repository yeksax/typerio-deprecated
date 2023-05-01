import { Source_Code_Pro } from "next/font/google"
import { ReactElement } from "react"
import Header from "./header"
import { getCookie } from "cookies-next"
import axios from "axios"
import { useRouter } from "next/router"

interface LayoutProps {
  children: ReactElement
}

const sourceCode = Source_Code_Pro({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] })

export default function Layout({ children }: LayoutProps) {
  if(getCookie('spotify_refresh_token') && !getCookie('spotify_access_token')){
    axios.get('/api/spotify/refresh_token')
  }

  const router = useRouter()
  const noHeaderPages = ['/group/[group]']

  let shouldHaveHeader = (!noHeaderPages.includes(router.pathname))

  return (
    <div className={`${sourceCode.className} flex flex-col page`}>
      {shouldHaveHeader && <Header />}
      <div className={`${shouldHaveHeader ? "pt-20": ""} h-full overflow-y-scroll`}>{children}</div>
    </div>
  )
}
