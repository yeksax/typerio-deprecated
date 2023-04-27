import { socket } from "@/service/socket";
import { User } from "@/types/interfaces";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { profile } from "console";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
interface UserProps {
  user: User
}

export default function MessageInput({ user }: UserProps) {
  const router = useRouter()
  const group = router.query.group

  const { data: session } = useSession()

  const messageRef = useRef(null)
  const email = session?.user?.email

  const IDLE_CONSTANT = 2500

  function setIdle() {
    console.log('oi')
    socket.emit('status', ({
      user: 'status-' + user.username.replace(/#/g, "").replace(/ /g, "-"),
      status: "Idle",
    }))
  }

  let idleChecker = setTimeout(() => {
    setIdle()
  }, IDLE_CONSTANT)

  function inputHandler(e: any) {
    autoHeight(e)

    socket.emit('status', ({
      user: 'status-' + user.username.replace(/#/g, "").replace(/ /g, "-"),
      status: "digitando...",
    }))

    clearTimeout(idleChecker)
    idleChecker = setTimeout(setIdle, IDLE_CONSTANT)

  }

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
      author: { email: email },
      group: { id: group }
    })

    // @ts-ignore
    messageRef.current.value = ""
    autoHeight(e)
  }

  function shortcutHandler(e: any) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      messageHandler(e)
    }
  }

  return (
    <form
      className="flex gap-2 justify-center h-fit items-center mx-8 mb-6 px-6 border-2 border-black rounded-lg"
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
  )
}