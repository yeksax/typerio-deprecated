import { Message } from "@/types/interfaces";
import { faReply, faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useState } from "react";
import Separator from "../user/me/verticalSeparator";
import File from "@/components/file";

interface MessageComponentProps {
  setMention?: (mention: Message) => void
  message: Message,
  isFirst: boolean
}

export default function MessageComponent({ message, isFirst, setMention }: MessageComponentProps) {
  const createdAt = new Date(message.createdAt)
  const hour = createdAt.getHours()
  const minute = createdAt.getMinutes()
  const time = `${hour}:${minute < 10 ? '0' + minute : minute}`

  const [showActions, setShowActions] = useState(false)

  const margin = !isFirst ? "ml-10" : ""

  function mentionMessage(e: any) {
    e.preventDefault()
    setMention!(message)
  }

  const highlightMention = [
    { marign: "0" },
    { margin: "0 12px" },
    { margin: "0" },
  ];

  const highlightMentionTiming = {
    duration: 300,
    delay: 300,
    ease: "easeInOut",
    iterations: 1,
  };

  return (
    <motion.div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onDoubleClick={mentionMessage}
      className={`flex items-center gap-2 ${message.isAuthor ? 'flex-row-reverse' : ''} ${margin}`}
      id={`message-${message.id}`}
    >
      {!message.isAuthor && isFirst && (
        // eslint-disable-next-line @next/next/no-img-element
        <img data-owner={message.author.username} className="rounded-lg self-start border-2 border-black w-8 h-8 object-cover aspect-square" src={message.author.profilePicture} width={28} height={28} alt="profile picture" />)
      }
      <motion.div
        animate={{
          x: message.isAuthor ? (showActions ? -12 : 0) : (showActions ? 12 : 0),
        }}
        className={`w-fit max-w-[60%] text-black border-2 border-black px-4 py-0.5 text-sm rounded-lg flex flex-col gap-1`}>
        {!message.isAuthor && isFirst && <span className="font-semibold">{message.author.name}</span>}
        <div className="flex flex-col gap-2">
          {message.mentionedMessageId && (
            <div className="flex gap-2 mt-1 cursor-pointer border-l-2 pl-2 border-gray-500"
              onClick={() => {
                let mention: HTMLElement | null = document.querySelector(`#message-${message.mentionedMessage.id}`)
                mention?.scrollIntoView({ behavior: "smooth" })
                mention!.animate(highlightMention, highlightMentionTiming)
              }}
            >
              <div className="text-xs text-gray-800">
                <span className="font-semibold">
                  {message.mentionedMessage.author.name}
                </span>
                <pre className="break-all">
                  {message.mentionedMessage.content}
                </pre>
              </div>
            </div>
          )}
          {message.attachments?.length > 0 && (
            <div className={`grid gap-2 mt-1 grid-flow-row ${message.attachments.length > 4 ? 'grid-cols-3' : message.attachments.length > 1 ? 'grid-cols-2' : ''}`}>
              {message.attachments.map((attachment, index) => (
                <File length={message.attachments.length} index={index} downloadable file={attachment} key={attachment.id} wasDeleted={false} />
              ))}
            </div>
          )}

          <p className="break-all">
            {message.content}
            <span className="text-xs text-gray-400 float-right mt-1 ml-2">
              {time}
            </span>
          </p>


        </div>
      </motion.div>

      <motion.div animate={
        {
          x: message.isAuthor ? (showActions ? -16 : 0) : (showActions ? 16 : 0),
          opacity: showActions ? 1 : 0
        }
      } transition={{ duration: 0.2 }} className="w-fit" >
        <div className="w-6 h-6 grid place-items-center cursor-pointer" onClick={mentionMessage}>
          <FontAwesomeIcon size="sm" className={message.isAuthor ? "transform -scale-x-100" : ""} icon={faReply} />
        </div>
      </motion.div>
    </motion.div >
  )
}