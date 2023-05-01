import { Group } from "@/types/interfaces";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function GroupHeader({ group }: { group: Group }) {
  const router = useRouter()

  return (
    <div
      className="border-b-2 border-black p-4 px-12 flex justify-between items-center"
    >
      <div className="flex gap-4">
        <Image className="rounded-md border-2 border-black w-10 h-10 aspect-square object-cover" src={group.thumbnail} width={200} height={200} alt="group thumbnail" />
        <div className="flex flex-col justify-between">
          <h3 className="font-bold text-xl">{group.name}</h3>
          <h3 className="font-medium text-sm text-gray-500">{group.description}</h3>
        </div>
      </div>
      <div className="flex gap-8">
        <Link href="/explore">Explorar</Link>
        <span className="cursor-pointer" onClick={() => router.back()} >Sair</span>

      </div>
    </div>
  )
}