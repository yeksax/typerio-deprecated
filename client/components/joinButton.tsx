import Link from "next/link";

interface JoinProps {
  group: groupChat,
}

export default function JoinButton({ group }: JoinProps) {
  let href = `/group/join/${group.id}`

  if (group.isIn) href = `/group/${group.id}`
  // if (!isLoggedIn) href = "/login"

  const hoverEffect = "transition-all duration-100 hover:bg-black hover:text-white"

  return <Link
    href={href}
    className={`${hoverEffect} border-black w-fit border-2 box-border text-black px-4 py-1 rounded text-xs font-semibold`}>
    {group.isIn ? "Continuar" : "Entrar"}
  </Link>
}