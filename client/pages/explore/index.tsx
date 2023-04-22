import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import GroupSkeleton from "../../components/groupSkeleton"
import GroupPreview from "@/components/groupPreview"
import GroupsPreview from "@/components/groupsPreview"
import { useUser } from "@auth0/nextjs-auth0/client"

export default function Explore() {
  const [groups, setGroups] = useState<groupChat[] | undefined>(undefined)
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const { user } = useUser()

  useEffect(() => {
    fetch(`http://localhost:3001/groups?user=${user?.email}`).then(async (r) => {
      // await sleep(1000)
      setGroups(await r.json())
    }).catch((e) => {
      console.log(e)
    }
    )
  }, [user])

  return <GroupsPreview groups={groups} />
}