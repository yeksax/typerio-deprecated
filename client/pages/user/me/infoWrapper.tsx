import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

interface WrapperProps {
  children: React.ReactNode;
  label: string
  className?: string
  readOnly?: boolean
}

export default function InfoWrapper({ children, label, className, readOnly = false }: WrapperProps) {
  return (
    <div className={`flex flex-col ${className} w-full`}>
      <h3 className="text-md font-bold mb-2 flex items-center">
        {label}
        {readOnly && <FontAwesomeIcon size="xs" icon={faLock} className="ml-2"/> } 
      </h3>
      <div className={`flex border-2 border-black rounded-md w-fit max-w-full`}>
        {children}
      </div>
    </div >
  )
}