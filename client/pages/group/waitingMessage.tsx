import File from "@/components/file";
import { WaitingMessageProps } from "@/types/interfaces";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface MessageProps {
  message: WaitingMessageProps
}

export default function WaitingMessage({ message }: MessageProps) {
  return <motion.div
    className={`flex items-center gap-2 flex-row-reverse opacity-60`}
  >
    <div className="flex flex-col gap-2 w-fit max-w-[60%] text-black border-2 border-black px-4 py-0.5 text-sm rounded-lg">
      {message.attachments.map((attachment, index) => (
        <File file={attachment} key={index} wasDeleted={false}/>
      ))}
      <p className="flex gap-2 items-baseline">
        {message.content}
        <span className="float-right text-xs animate-spin">
          <FontAwesomeIcon icon={faSpinner} />
        </span>
      </p>
    </div>
  </motion.div>;
}