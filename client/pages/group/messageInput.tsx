import { socket } from "@/service/socket";
import { Message, User } from "@/types/interfaces";
import { faClose, faFile, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, } from "react";
import { motion } from "framer-motion";
import File from "../../components/file";

interface UserProps {
  user: User,
  mention: Message | null
  setMention: (mention: Message | null) => void
  setStatus: ({ title, data }: { title: string, data?: any }) => void
  defaultStatus: string
  users: User[]
}

interface FileData {
  name: string,
  size: number
  id: string,
  deleted: boolean
}

export default function MessageInput({ user, setMention, mention, setStatus, defaultStatus, users }: UserProps) {
  const router = useRouter()
  const group = router.query.group

  const { data: session } = useSession()
  const idleTimer = useRef<NodeJS.Timeout | null>(null)

  const messageRef = useRef<HTMLTextAreaElement>(null)
  const email = session?.user?.email

  const [userMentions, setUserMentions] = useState<string[]>([])
  const [files, setFiles] = useState<ArrayBuffer[]>([])

  const [filesData, setFilesData] = useState<FileData[]>([])

  const IDLE_CONSTANT = 1000

  function inputHandler(e: any) {
    autoHeight(e)
    if (e.target.value == '') {
      setStatus({ title: defaultStatus })
      return
    }

    setStatus({ title: 'digitando...' })

    clearTimeout(idleTimer.current!)
    idleTimer.current = setTimeout(() => {
      setStatus({ title: defaultStatus })
    }, IDLE_CONSTANT)
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


    if (message === "" && files.length === 0) {
      setStatus({ title: defaultStatus })
      return
    }

    socket.emit('message', {
      message: {
        content: message,
        mention: mention?.id
      },
      attachments: {
        files: files,
        filesData: filesData,
      },
      author: { email: email },
      group: { id: group }
    })

    // @ts-ignore
    messageRef.current.value = ""
    autoHeight(e)
    setMention(null)
    setUserMentions([])
  }

  async function pasteHandler(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    let newFiles = e.clipboardData.files

    if (newFiles.length) {
      for (let i = 0; i < newFiles.length; i++) {
        let file = await newFiles[i].arrayBuffer()

        // console.log(newFiles[i].arrayBuffer().then(r=>console.log(r)))
        setFiles(prevFiles => [...prevFiles, file])
        setFilesData(prevFiles => [...prevFiles, {
          id: newFiles[i].lastModified.toString(),
          name: newFiles[i].name,
          size: newFiles[i].size,
          deleted: false
        }])
      }
    }
  }

  function shortcutHandler(e: any) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      messageHandler(e)
    }

    if (e.key == 'Escape') {
      if (filesData.length > 0) {
        setFilesData(files => files.map(f => {
          return files.indexOf(f) != files.length - 1 ? f : { ...f, deleted: true };
        }))
      } else {
        setMention(null)
      }
    }
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

  useEffect(() => {
    messageRef.current?.focus()
  }, [mention])

  return (
    <div className="mx-12 border-2 border-black rounded-lg mb-6 px-4 flex flex-col gap-01682985029932.pdf">
      <motion.div
        animate={{
          height: mention ? "60px" : 0
        }}
        transition={{
          duration: 0.1,
        }}
        className="text-gray-800 flex justify-between items-center text-sm"
      >
        <span className="break-all flex flex-col line-clamp-1 border-l-2 pl-2 border-gray-500" onClick={() => {
          let mentionEl: HTMLElement | null = document.querySelector(`#message-${mention?.id}`)
          mentionEl?.scrollIntoView({ behavior: "smooth" })
          mentionEl!.animate(highlightMention, highlightMentionTiming)
        }}>
          <span className="font-semibold">
            {mention?.author.name}
          </span>
          <span>
            {mention?.content}
          </span>
        </span>
        {mention && <FontAwesomeIcon icon={faClose} className="text-black cursor-pointer" onClick={() => setMention(null)} />}
      </motion.div>

      <motion.div className="flex gap-8 overflow-x-scroll w-full"
        initial={{
          height: '0'
        }}

        animate={{
          height: filesData.length > 0 ? '2.2rem' : "0",
          marginTop: filesData.length ? "0.5rem" : "0"
        }}

        transition={{
          duration: 0.1,
        }}
      >
        {filesData.map((file, index) => (
          <File key={file.id} file={file} setFilesData={setFilesData} setFiles={setFiles} index={index} wasDeleted={file.deleted} />
        ))}
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
          onPaste={pasteHandler}
        >
        </textarea>
        <button type="submit">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>

      </form>
    </div>
  )
}