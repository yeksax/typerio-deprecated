import { group } from "console";
import SidebarUser from "./sidebarUser";
import Image from 'next/image'


interface Props {
  users: User[]
  group: Group
}

export default function Sidebar(data: Props) {
  return (
    <div className="border-r border-black h-full w-1/6 flex flex-col justify-between p-4">
      <div className="flex flex-col gap-4">
        {data.users.map((user, i) => (
          <SidebarUser key={new Date().getTime() + i} user={user} />
        )
        )}


      </div>

      <div className="flex gap-4">
        <Image
          src={data.group.thumbnail}
          className="w-10 h-10 aspect-square object-cover rounded-md border-2 border-black"
          alt="group thumbnail"
          width={64}
          height={64} />
        <div className="flex justify-between flex-col w-full overflow-hidden">
          <p className='truncate text-sm font-bold'>{data.group.name}</p>
          <p className='truncate text-xs'>{data.group._count.members + " membros"}</p>
        </div>
      </div>
    </div>
  );
}
