import Image from 'next/image'

interface User {
  user: {
    username: string;
    profilePicture: string;
    status?: string;
    isMe: boolean
  }
}

export default function SidebarUser(user: User) {
  let profile = user.user

  return (<div className="flex items-center gap-2 w-full">
    <Image
      src={profile.profilePicture}
      className="w-10 h-10 rounded-full  aspect-square object-cover"
      alt="profile picture"
      width={64}
      height={64} />
    <div className="flex justify-between flex-col w-full overflow-hidden">
      <p className={`truncate text-sm ${profile.isMe ? 'font-bold' : "font-medium"}`}>{profile.isMe ? "Eu" : profile.username}</p>
      <p className='truncate text-xs'>{profile.status || 'No status'}</p>
    </div>
  </div>)
}