import { useEffect, useRef, useState } from "react"
import MessageGroup from "./messageGroup"
import { Message } from "@/types/interfaces"

interface Props {
  messages: Message[][]
  setMention: (mention: Message) => void
}

export default function MessagesContainer({ messages, setMention }: Props) {
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
    <main className="flex-1 relative py-4 px-12 flex flex-col gap-6 overflow-y-scroll scroll-smooth scroll" ref={messagesContainer}>
      {messages.map((messageGroup, i) => <MessageGroup setMention={setMention} key={i} messages={messageGroup} />)}
    </main>
  )
}