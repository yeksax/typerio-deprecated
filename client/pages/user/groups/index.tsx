import CreateGroup from "@/components/groupCreate";
import GroupsPreview from "@/components/groupsPreview";
import { clientTRPC } from "@/service/trpc";
import { Group } from "@/types/interfaces";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";

interface MyChatsProps {
  myGroups: Group[]
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const myGroups = await clientTRPC.user.getGroups.query(session?.user?.email as string)

  return {
    props: {
      myGroups
    },
  };
}

export default function Page({ myGroups }: MyChatsProps) {
  const user = useSession({
    required: true,
  }).data?.user;

  const [groups, setGroups] = useState<Group[] | undefined>(myGroups)

  return <div className="flex flex-col pt-10">
    <div className="px-40">
      <CreateGroup appendGroup={setGroups} currentGroups={groups} />
    </div>
    {/* <TextSplitter text="Grupos em que você está" className="px-40"/> */}
    {/* <div className="w-full border-b border-b-black px-40"></div> */}
    <GroupsPreview groups={groups} />
  </div>
}