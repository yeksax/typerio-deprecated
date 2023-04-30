import { socket } from "@/service/socket";
import { Message, User } from "@/types/interfaces";
import { faClose, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, } from "react";
import { motion } from "framer-motion";

interface UserProps {
  user: User,
  mention: Message | null
  setMention: (mention: Message | null) => void
  setStatus: (value: string) => void
  defaultStatus: string
}

export default function MessageInput({ user, setMention, mention, setStatus, defaultStatus }: UserProps) {
  const router = useRouter()
  const group = router.query.group

  const { data: session } = useSession()
  const idleTimer = useRef<NodeJS.Timeout | null>(null)

  const messageRef = useRef<HTMLTextAreaElement>(null)
  const email = session?.user?.email

  const IDLE_CONSTANT = 1500

  function inputHandler(e: any) {
    autoHeight(e)
    setStatus('digitando...')

    clearTimeout(idleTimer.current!)
    idleTimer.current = setTimeout(() => {
      setStatus(defaultStatus)
    }, IDLE_CONSTANT)
  }

  useEffect(() => {

  }, [defaultStatus])

  function autoHeight(e: any) {
    let element = e.target
    element.style.height = "40px";
    element.style.height = (element.scrollHeight) + "px";
  }

  function messageHandler(e: any) {
    e.preventDefault()
    // @ts-ignore
    const message = messageRef.current.value


    if (message === "") return
    socket.emit('message', {
      // @ts-ignore
      message: message,
      mention: mention?.id,
      author: { email: email },
      group: { id: group }
    })

    // setMentionedMessage(null)

    // @ts-ignore
    messageRef.current.value = ""
    autoHeight(e)
    setMention(null)
  }

  function shortcutHandler(e: any) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      messageHandler(e)
    }

    if (e.key == 'Escape') {
      setMention(null)
    }
  }

  const highlightMention = [
    { marign: "0" },
    { margin: "0 24px" },
    { margin: "0" },
  ];

  const highlightMentionTiming = {
    duration: 300,
    delay: 300,
    ease: "easeInOut",
    iterations: 1,
  };

  useEffect(() => {
    messageRef.current?.focus()
  }, [mention])

  return (
    <div className="mx-8 border-2 border-black rounded-lg mb-6 px-6 flex flex-col gap-0">
      <motion.div
        animate={{
          height: mention ? "40px" : 0
        }}
        transition={{
          duration: 0.1,
        }}
        className="text-gray-800 flex justify-between items-center text-sm"
      >
        <span className="break-all line-clamp-1" onClick={() => {
          let mentionEl: HTMLElement | null = document.querySelector(`#message-${mention?.id}`)
          mentionEl?.scrollIntoView({ behavior: "smooth" })
          mentionEl!.animate(highlightMention, highlightMentionTiming)
        }}>
          {mention?.content}
        </span>
        {mention && <FontAwesomeIcon icon={faClose} className="text-black cursor-pointer" onClick={() => setMention(null)} />}
      </motion.div>

      <form
        className="flex gap-2 justify-center items-center"
        onSubmit={messageHandler}
      >
        <textarea
          className="h-10 w-full max-h-28 py-2 resize-none backdrop-blur-4 bg-transparent outline-none"
          onChange={inputHandler}
          onKeyDown={shortcutHandler}
          ref={messageRef}
          placeholder="Type a message..."
          name="message"
        >
        </textarea>
        <button type="submit">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>

      </form>
    </div>
  )
}