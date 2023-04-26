import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import JoinButton from "./joinButton";
import * as Type from "@/types/interfaces";

interface GroupProps {
  group: Type.Group
}

export default function GroupPreview({ group }: GroupProps) {
  return (
    <div className="flex gap-4 justify-between last:pb-10">
      <Image className="h-24 w-24 object-cover aspect-square rounded border-black border-2" src={group.thumbnail || '/group.png'} alt={`${group.name} thumbnail`} width={100} height={100} />
      <div className="flex justify-between flex-col w-full overflow-hidden">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{group.name}</h3>
          <p className="truncate">{group.description}</p>
        </div>
        <JoinButton group={group} />
      </div >
      <div className="flex flex-col">
        <span className="px-2 flex gap-2 items-center text-md font-semibold rounded-md border-2 border-black">
          {group._count?.members.toString()}
          <FontAwesomeIcon size="xs" icon={faUsers} />
        </span>
      </div>
    </div >
  )
}