import TextSplitter from "@/components/textsplitter";
import { clientTRPC } from "@/service/trpc";
import { User } from "@/types/interfaces";
import { getSession } from "next-auth/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next/types";

interface UserPage {
  user: User
}

export default function Page({ user }: UserPage) {
  return (
    <main
      className="mx-40 mt-10">
      <TextSplitter text={user.name} className="text-xl font-black" align="left" />
    </main>
  );
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<UserPage> = async (context: GetServerSidePropsContext) => {
  const user = await clientTRPC.user.get.query(context.query.user as string)

  return {
    props: {
      user
    }
  }
}