import { Source_Code_Pro } from "next/font/google"
import { ReactElement } from "react"
import Header from "./header"

interface LayoutProps {
  children: ReactElement
}

const sourceCode = Source_Code_Pro({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={`${sourceCode.className} flex flex-col page`}>
      <Header />
      <div className="pt-20 h-full overflow-y-scroll">{children}</div>
    </div>
  )
}
