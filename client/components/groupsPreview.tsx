import { ReactElement } from "react";
import GroupPreview from "./groupPreview"
import GroupSkeleton from "./groupSkeleton"
import { Group } from "@/types/interfaces";

interface GroupsProps {
  groups?: Group[] | undefined
}

export default function GroupsPreview({ groups }: GroupsProps) {
  let toBeDisplayed: ReactElement | ReactElement[] = <GroupSkeleton count={7} />;

  if (groups) toBeDisplayed = groups.map((group) => {
    return <GroupPreview group={group} key={group.id} />
  })

  if (groups?.length == 0) {
    toBeDisplayed = <h1 className="text-xl opacity-50 font-medium text-center">Não há nada pra ver aqui...</h1>
  }


  return <div className="flex flex-col gap-8 px-40 pt-10">{toBeDisplayed}</div>
}