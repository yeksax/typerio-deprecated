import { socket } from "@/service/socket";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MessageInput() {
  const router = useRouter()
  const group = router.query.group

  const { data: session } = useSession()

  const email = session?.user?.email

  function autoHeight(e: any) {
    let element = e.target
    element.style.height = "40px";
    element.style.height = (element.scrollHeight) + "px";
  }

  function messageHandler(e: any) {
    e.preventDefault()
    socket.emit('message', {
      message: e.target.value,
      author: { email: email },
      group: { id: group }
    })

    e.target.value = ""
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
        onChange={autoHeight}
        onKeyDown={shortcutHandler}
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