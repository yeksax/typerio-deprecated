import { useEffect, useState } from "react"
import GroupsPreview from "@/components/groupsPreview"
import { useSession } from "next-auth/react"

export default function Explore() {
  const [groups, setGroups] = useState<groupChat[] | undefined>(undefined)
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const user = useSession().data?.user || undefined

  console.log(user?.email)

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