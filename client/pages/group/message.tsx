import Image from "next/image";

export default function Message({ message, isFirst }: { message: Message, isFirst: boolean }) {
  const createdAt = new Date(message.createdAt)
  const hour = createdAt.getHours()
  const minute = createdAt.getMinutes()
  const time = `${hour}:${minute < 10 ? '0' + minute : minute}`

  const margin = !isFirst ? "ml-12" : ""

  return (
    <div className={`flex gap-4 ${message.isAuthor ? 'justify-end' : ''} ${margin}`}>
      {!message.isAuthor && isFirst && (
        <Image data-owner={message.author.username} className="rounded-full border-2 border-black w-8 h-8 object-cover aspect-square" src={message.author.profilePicture} width={28} height={28} alt="profile picture" />)
      }
      <div className={`w-fit max-w-[60%] text-black border-2 border-black px-4 py-0.5 text-sm rounded-lg flex flex-col gap-1`}>
        {!message.isAuthor && isFirst && <span className="font-semibold">{message.author.username}</span>}
        <div className="flex items-end gap-2 justify-between">
          <p className="break-all line-clamp-3">{message.content}</p>
          <span className="text-xs text-gray-400 mt-[-.1rem]">
            {time}
          </span>
        </div>
      </div>
    </div>
  )
}