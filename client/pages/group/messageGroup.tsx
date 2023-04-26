import Message from "./message"

interface MessageGroupProps {
  messages: Message[]
}

export default function MessageGroup({ messages }: MessageGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {messages.map((message, i) => (<Message key={message.id} isFirst={i == 0} message={message} />))}
    </div>
  )
}