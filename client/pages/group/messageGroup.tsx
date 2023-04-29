import { Message } from "@/types/interfaces"
import MessageComponent from "./message"

interface MessageGroupProps {
  messages: Message[]
  setMention: (mention: Message) => void
}

export default function MessageGroup({ messages, setMention }: MessageGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {messages.map((message, i) => (<MessageComponent setMention={setMention} key={message.id} isFirst={i == 0} message={message} />))}
    </div>
  )
}