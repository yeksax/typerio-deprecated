import { signOut } from "next-auth/react";

export default function Page() {
  return (
    // @ts-ignore
    <button onClick={() => signOut({ redirect: "/" })}>
      tchau
    </button>
  )
}