import Link from "next/link";
import { ReactNode } from "react";

interface ConnectionProps {
  children?: ReactNode
  url: string
}

export default function Connection({ url, children }: ConnectionProps) {
  return (
    <Link href={url} className="flex items-center justify-center border-2 border-black rounded-md p-2 gap-2">
      {children}
    </Link>
  )
}