import { User } from '@/types/interfaces'
import Link from 'next/link'

interface UserProps {
  profile: User
}

export default function SidebarUser({ profile }: UserProps) {
  const userUrl = profile.username

  return (<Link href={profile.isMe ? '/user/me' : `/user/${userUrl}`}
    className="flex items-center gap-2 w-full rounded-lg overflow-hidden border-transparent border-2 hover:border-black transition-colors"
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={profile.profilePicture}
      className="w-10 h-10 rounded-md aspect-square object-cover"
      alt="profile picture"
      width={64}
      height={64} />
    <div className="flex justify-between flex-col gap-1 w-full overflow-hidden">
      <p className={`truncate flex items-baseline text-sm ${profile.isMe ? 'font-bold' : "font-medium"}`}>
        {profile.isMe ? "Eu" : (<>{profile.name}<span className='text-gray-500 text-xs'>#{profile.tag}</span></>)}
      </p>
      <p id={`status-${profile.username.replace(/#/g, "").replace(/ /g, "-")}`} className='truncate text-xs'>{profile.status || 'Idle'}</p>
    </div>
  </Link>)
}