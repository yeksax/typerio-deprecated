import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "./input";
import TextSplitter from "../../components/textsplitter";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { getSession, signIn } from "next-auth/react";

export async function getServerSideProps({ req }: { req: any }) {
  const session = await getSession({ req })

  if (session) {
    return {
      redirect: {
        destination: '/explore',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
export default function Login() {
  function githubLogin() {
    signIn('github')
  }

  function emailLogin() {
    signIn('credentials')
  }

  function googleLogin() {
    signIn('google')
  }

  return (
    <div className="mx-auto mt-4 flex flex-col gap-6 p-8 rounded-lg border-4 border-black text-center md:w-1/3 w-10/12">
      <form className="flex flex-col gap-6">
        <h1 className="font-bold text-xl">Acesse sua conta</h1>
        <div className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="XXXXXXXXXXX@gmail.com" />
          <Input label="Senha" type="password" />
        </div>

        <div
          className="button bg-purple-700 text-white flex items-center text-lg justify-center gap-4 cursor-pointer w-full border-2 border-black rounded-md p-1"
          onClick={emailLogin}
        >
          <span className="font-semibold">Entrar com email</span>
        </div>
      </form>
      <TextSplitter text="ou continue com" />
      <div className="flex flex-col gap-2">
        <div
          className="button flex items-center text-lg justify-center gap-4 cursor-pointer w-full border-2 border-black rounded-md p-2"
          onClick={githubLogin}
        >
          <FontAwesomeIcon size="lg" icon={faGithub} />
          <span className="font-semibold">Github</span>
        </div>
        <div
          className="button flex items-center text-lg justify-center gap-4 cursor-pointer w-full border-2 border-black rounded-md p-2"
          onClick={googleLogin}
        >
          <FontAwesomeIcon size="lg" icon={faGoogle} />
          <span className="font-semibold">Google</span>
        </div>
      </div>
    </div>
  );
}