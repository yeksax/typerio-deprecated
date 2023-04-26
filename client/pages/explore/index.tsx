import { useEffect, useState } from "react"
import GroupsPreview from "@/components/groupsPreview"
import { getSession, useSession } from "next-auth/react"
import { clientTRPC } from "@/service/trpc";
import { Group } from "@/types/interfaces";
import { GetServerSidePropsContext } from "next";


interface ExploreProps {
  groupsExplore: Group[];
}
export default function Explore({ groupsExplore }: ExploreProps) {
  const [groups, setGroups] = useState<Group[] | undefined>(groupsExplore)
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const user = useSession().data?.user || undefined

  console.log(user?.email)

  return <GroupsPreview groups={groups} />
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const groupsExplore: any[] = await clientTRPC.groups.getGroups.query(session?.user?.email as string)

  return {
    props: {
      groupsExplore
    }
  }
}