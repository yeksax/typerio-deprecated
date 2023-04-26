import { clientTRPC } from "@/service/trpc";
import { Group } from "@/types/interfaces";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

//@ts-ignore
export const getServerSideProps: GetServerSideProps<{ data: Group }> = async (context: GetServerSidePropsContext) => {
  const data = await clientTRPC.groups.getGroup.query(context.query.group as string)

  return {
    props: {
      data,
    },
  }
}

function Page({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isJoining, setIsJoining] = useState(false)


  async function joinGroup() {
    setIsJoining(true)
    let res = await clientTRPC.groups.joinGroup.mutate({ group: data.id, user: session?.user?.email as string })
    router.push(`/group/${res}`)
  }


  // will resolve data to type Data
  return (
    <div className="p-8 px-16 border-4 border-black rounded-lg fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
      <Image
        className="rounded-lg w-28 h-28 object-cover border-4 border-black"
        src={data.thumbnail}
        width={256}
        height={256}
        alt="thumbnail" />
      <h3 className="text-md font-medium text-center w-80">
        Quer entrar no grupo <span className="font-semibold">{data.name}</span>?
      </h3>
      <button
        onClick={joinGroup}
        className="px-8 py-2 flex gap-4 items-center font-semibold border-2 border-black hover:bg-black hover:text-white rounded-lg text-black bg-white transition-colors">
        {isJoining ? "Entrando..." : "Confirmar"}
      </button>
    </div>
  )
}

export default Page
