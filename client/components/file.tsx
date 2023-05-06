import { IconDefinition, faArrowsDownToLine, faC, faClose, faDownLong, faDownload, faFile, faFileArrowDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

interface FileData {
  name: string,
  size: number,
  url?: string,
  id?: string
}

interface FileProps {
  file: FileData
  downloadable?: boolean
  setFiles?: any
  setFilesData?: any
  index?: number
  wasDeleted: boolean
}

export default function File({ file, setFiles, setFilesData, index, downloadable, wasDeleted }: FileProps) {
  const [hovering, setHovering] = useState<boolean>(false)
  const [deleted, setDeleted] = useState<boolean>(wasDeleted)
  let icon = hovering ? faClose : faFile

  if(!downloadable) console.log(wasDeleted)

  function removeFile() {
    setFiles((files: File[]) => {
      return files.filter((_, i) => i !== index)
    })
    setFilesData((files: File[]) => {
      return files.filter((_, i) => i !== index)
    })
  }

  function filenameFormatter(file: string) {
    let fileName = file.split(".").slice(0, -1).join(".")
    let fileExtension = file.split(".").pop()


    return fileName.length > 20 ? `${fileName.substring(0, 16)}...${fileExtension}` : file
  }

  function handleIconClick(e: any) {
    if (!downloadable) {
      hovering ? setDeleted(true) : undefined
    }
  }

  if (downloadable) {
    icon = faFileArrowDown
  }

  function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  function forceDownload(blob: string, filename: string) {
    var a = document.createElement('a');
    a.download = filename;
    a.href = blob;
    // For Firefox https://stackoverflow.com/a/32226068
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  
  function downloadResource(url: string, filename: string) {
    fetch(url, {
        headers: new Headers({
          'Origin': location.origin
        }),
        mode: 'cors'
      })
      .then(response => response.blob())
      .then(blob => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
      })
      .catch(e => console.error(e));
  }
  

  return (
    <motion.span
      className="text-sm flex gap-4 items-center border-l-2 border-gray-500 pl-1.5"
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      animate={{
        scale: deleted || wasDeleted ? 0 : 1,
        width: deleted || wasDeleted ? '0' : 'fit-content'
      }}

      onAnimationComplete={() => {
        if (deleted || wasDeleted) {
          removeFile()
        }
      }}

      transition={{
        duration: 0.3
      }}
    >
      {downloadable ? (
        <button onClick={()=>{
          downloadResource(file.url!, file.name)
        }}>
           <FontAwesomeIcon size="lg" icon={icon} onClick={handleIconClick} className="cursor-pointer" />
        </button>
      ) : (
        <FontAwesomeIcon size="lg" icon={icon} onClick={handleIconClick} className="cursor-pointer" />
      )}
      <div className="flex flex-col cursor-pointer">
        <span className="font-medium truncate">{filenameFormatter(file.name)}</span>
        <span className="text-xs font-regular">{formatBytes(file.size)}</span>
      </div>
    </motion.span>
  )
}