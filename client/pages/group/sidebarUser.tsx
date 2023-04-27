import { User } from '@/types/interfaces'
import Image from 'next/image'
import Link from 'next/link'

interface UserProps {
  profile: User
}

export default function SidebarUser({ profile }: UserProps) {
  const userUrl = profile.name.toLowerCase().replace(/\s/g, '-') + "_" + profile.tag

  return (<div className="flex items-center gap-2 w-full">
    <Image
      src={profile.profilePicture}
      className="w-10 h-10 rounded-full  aspect-square object-cover"
      alt="profile picture"
      width={64}
      height={64} />
    <Link href={profile.isMe ? '/user/me' : `/user/${userUrl}`} className="flex justify-between flex-col w-full overflow-hidden">
      <p className={`truncate flex items-baseline text-sm ${profile.isMe ? 'font-bold' : "font-medium"}`}>
        {profile.isMe ? "Eu" : (<>{profile.name}<span className='text-gray-500 text-xs'>#{profile.tag}</span></>)}
      </p>
      <p id={`status-${profile.username.replace(/#/g, "").replace(/ /g, "-")}`} className='truncate text-xs'>{profile.status || 'Idle'}</p>
    </Link>
  </div>)
}