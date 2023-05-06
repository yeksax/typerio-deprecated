import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { ReactNode, use, useEffect, useState } from "react";

interface ConnectionProps {
  children?: ReactNode
  providerCookie: string
  provider: string
  url: string
  icon: IconDefinition
}

export default function Connection({ url, children, provider, providerCookie, icon }: ConnectionProps) {
  let [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    setIsConnected(!!getCookie(providerCookie))
  }, [providerCookie])

  return (
    <Link
      href={url}
      className={`flex items-center justify-center border-2 border-black rounded-md p-2 gap-4 ${isConnected ? 'bg-black text-white' : ""}`}>
      <span>{isConnected ? "Conectado" : "Conectar"} com {provider}</span>
      <FontAwesomeIcon icon={icon} size="xl" />
    </Link>
  )
}