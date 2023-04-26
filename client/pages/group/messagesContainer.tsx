import { useEffect, useRef } from "react"
import Message from "./message"
import MessageGroup from "./messageGroup"

interface Props {
  messages: Message[][]
}

interface Message {
  id: 2,
  createdAt: Date,
  updatedAt: Date,
  content: string,
  pastVersions: Message[],
  authorId: string,
  groupChatId: string,
  author: {
    username: string,
    profilePicture: string
  },
  isAuthor: true
}

export default function MessagesContainer({ messages }: Props) {
  const messagesContainer = useRef(null)

  useEffect(() => {
    let element: HTMLElement = messagesContainer.current!
    element.scrollTop = element.scrollHeight
  }, [])

  useEffect(() => {
    let element: HTMLElement = messagesContainer.current!

    if ((element.scrollHeight - element.scrollTop) < (element.clientHeight * 2)) {
      element.scrollTop = element.scrollHeight
    }
  }, [messages])


  return (
    <main className="flex-1 py-4 px-8 flex flex-col gap-6 overflow-y-scroll scroll-smooth scroll" ref={messagesContainer}>
      {messages.map((messageGroup, i) => <MessageGroup key={i} messages={messageGroup} />)}
    </main>
  )
}