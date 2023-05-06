import { Group } from "@/types/interfaces";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function GroupHeader({ group, typingUsers }: { group: Group, typingUsers: string[] }) {
  const router = useRouter()

  let description = group.description

  if (typingUsers.length > 0) {
    if (typingUsers.length > 1){
      if (typingUsers.length <= 3) {
        description = typingUsers.join(", ") + " estão digitando..."
      } else {
        description = typingUsers.slice(0, 3) + " e " + (typingUsers.length - 3) + " outros estão digitando..."
      }
    } else {
      description = typingUsers[0] + " está digitando..."
    }
  }

  return (
    <div
      className="border-b-2 border-black p-4 px-12 flex justify-between items-center"
    >
      <div className="flex gap-4">
        <Image className="rounded-md border-2 border-black w-12 h-12 aspect-square object-cover" src={group.thumbnail} width={200} height={200} alt="group thumbnail" />
        <div className="flex flex-col justify-between">
          <h3 className="font-bold text-xl">{group.name}</h3>
          <h3 className="font-medium text-xs text-gray-500">{description}</h3>
        </div>
      </div>
      <div className="flex gap-8">
        {/* <Link href="/explore">Explorar</Link> */}
        <span className="cursor-pointer" onClick={() => router.back()} >Voltar</span>

      </div>
    </div>
  )
}