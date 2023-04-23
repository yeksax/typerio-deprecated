import CreateGroup from "@/components/groupCreate";
import GroupsPreview from "@/components/groupsPreview";
import TextSplitter from "@/components/textsplitter";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MyChats() {
  const user = useSession({
    required: true,
  }).data?.user;

  const [groups, setGroups] = useState<groupChat[] | undefined>(undefined)

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    if (user != undefined) {
      fetch(`http://localhost:3001/user/groups?user=${user.email}`, {
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
    <div className="px-40">
      <CreateGroup appendGroup={setGroups} currentGroups={groups} />
    </div>
    {/* <TextSplitter text="Grupos em que você está" className="px-40"/> */}
    {/* <div className="w-full border-b border-b-black px-40"></div> */}
    <GroupsPreview groups={groups} />
  </div>
}

