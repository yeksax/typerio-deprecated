import { User } from '@/types/interfaces'
import Image from 'next/image'
import Link from 'next/link'

interface UserProps {
  profile: User
}

export default function SidebarUser({ profile }: UserProps) {
  const userUrl = profile.username

  return (<Link href={profile.isMe ? '/user/me' : `/user/${userUrl}`}
    className="flex items-center p-1 px-2 gap-2 w-full rounded-md hover:bg-gray-100 transition-colors"
    >
    <Image
      src={profile.profilePicture}
      className="w-10 h-10 rounded-full  aspect-square object-cover"
      alt="profile picture"
      width={64}
      height={64} />
    <div className="flex justify-between flex-col w-full overflow-hidden">
      <p className={`truncate flex items-baseline text-sm ${profile.isMe ? 'font-bold' : "font-medium"}`}>
        {profile.isMe ? "Eu" : (<>{profile.name}<span className='text-gray-500 text-xs'>#{profile.tag}</span></>)}
      </p>
      <p id={`status-${profile.username.replace(/#/g, "").replace(/ /g, "-")}`} className='truncate text-xs'>{profile.status || 'Idle'}</p>
    </div>
  </Link>)
}