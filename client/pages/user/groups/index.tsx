import GroupPreview from "@/components/groupPreview";
import GroupSkeleton from "@/components/groupSkeleton";
import GroupsPreview from "@/components/groupsPreview";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

export default function MyChats() {
  const { user } = useUser()
  const [groups, setGroups] = useState<groupChat[] | undefined>(undefined)

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    if (user != undefined) {
      fetch(`http://localhost:3001/user/groups?email=${user.email}`, {
      }).then(async (r) => {

        setGroups(await r.json())
        console.log(groups)
      }).catch((e) => {
        console.log(e)
      }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return <div className="flex flex-col pt-10">
    
    {/* <div className="w-full border-b border-b-black px-40"></div> */}
    <GroupsPreview groups={groups} />
  </div>
}

