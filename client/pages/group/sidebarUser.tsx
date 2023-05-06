/* eslint-disable @next/next/no-img-element */
import { User } from '@/types/interfaces'
import Link from 'next/link'
import { useRef, useState } from 'react';
import { motion } from 'framer-motion'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faBackwardStep, faForwardStep, faPause } from '@fortawesome/free-solid-svg-icons';

const parse = require('html-react-parser');


interface UserProps {
  profile: User
}

export default function SidebarUser({ profile }: UserProps) {
  const userUrl = profile.username
  const status = profile.status ? parse(profile.status.title) : parse("<span className='text-gray-500' style='font-size: 0.6rem'>Offline</span>")
  const [hovering, setHovering] = useState(false)
  const [shouldMove, setShouldMove] = useState(true)
  const [coordinates, setCoordinates] = useState([0, 0])
  const [display, setDisplay] = useState("none")

  let [timeElapsed, setTimeElapsed] = useState("0:00")
  let [songDuration, setSongDuration] = useState("0:00")
  let [songPercentage, setSongPercentage] = useState(0)

  const data = profile.status?.data

  if (data) {
    let duration = new Date(data.duration)
    songDuration = duration.getMinutes() + ":" + duration.getSeconds().toString().padStart(2, "0")

    let elapsed = new Date(data.progress)
    timeElapsed = `${elapsed.getMinutes()}:${elapsed.getSeconds().toString().padStart(2, "0")}`

    let percentage = (elapsed.getTime() / duration.getTime()) * 100
    songPercentage = percentage
  }

  function moveInfo(e: any) {
    if (shouldMove) setCoordinates([e.clientX - 10, e.clientY - 10])
  }

  return (
    <div
      onMouseMove={moveInfo}>
      <Link href={profile.isMe ? '/user/me' : `/user/${userUrl}`}
        className="flex items-center p-0.5 px-1 gap-2 w-full rounded-lg overflow-hidden border-transparent border-2 hover:border-black transition-colors"
        onMouseLeave={() => setHovering(false)}
        onMouseEnter={() => { setHovering(true); setShouldMove(true) }}
      >
        <img
          src={profile.profilePicture}
          className="w-9 h-9 rounded-md aspect-square object-cover"
          alt="profile picture"
          width={64}
          height={64} />
        <div className="flex justify-between flex-col gap-1 w-full overflow-hidden">
          <p className={`truncate flex items-baseline text-sm ${profile.isMe ? 'font-bold' : "font-medium"}`}>
            {profile.isMe ? "Eu" : (<>{profile.name}<span className='text-gray-500 text-xs'>#{profile.tag}</span></>)}
          </p>
          <p
            className='truncate text-xs font-medium'>{status}</p>
        </div>
      </Link>
      {data && Object.keys(data).length > 0 && (
        <motion.div
          className='fixed p-2 border-2 border-black rounded-md bg-white'
          onMouseOver={() => { setHovering(true); setShouldMove(false) }}
          onMouseLeave={() => setHovering(false)}
          initial={{
            display: 'none'
          }}
          animate={{
            left: coordinates[0],
            top: coordinates[1],
            opacity: hovering ? 1 : 0,
            scale: hovering ? 1 : 0,
            display: display,
          }}

          onAnimationComplete={() => {
            if (!hovering) {
              setDisplay("none")
            } else {
              setDisplay('block')
            }
          }}
        >
          <div className="flex flex-col gap-6">
            {/* <div className="flex gap-4">
              <img
                src={profile.profilePicture}
                className="w-16 h-16 border-2 border-black rounded-md aspect-square object-cover"
                alt="profile picture"
                width={64}
                height={64} />
              <div className="flex flex-col justify-between font-semibold">
                <h3 className='flex items-baseline'>
                  {profile.name}
                  <span className='font-medium text-gray-500 text-sm'>#{profile.tag}</span>
                </h3>
                <Link className='border-2 w-fit border-black rounded-md px-2 py-0.5 text-xs' href={profile.isMe ? '/user/me' : `/user/${userUrl}`}>Perfil</Link>
              </div>
            </div> */}
            {data.source == "Spotify" && (
              <div className="flex flex-col gap-4">
                <h3 className='font-medium flex justify-between items-center text-sm'>
                  <span>
                    Ouvindo no {" "}
                    <span className='font-bold'>Spotify</span>
                  </span>
                  <FontAwesomeIcon className='ml-4 cursor-pointer' size='lg' icon={faSpotify} onClick={() => { setHovering(false) }} />
                </h3>
                <Link href={"https://open.spotify.com/track/" + data.id} target='_blank' className="flex gap-2">
                  <Image
                    className='rounded-md border-black border-2 w-12 h-12 aspect-square object-cover'
                    src={data.thumbnail} alt='music thumbnail' width={256} height={256} />
                  <div className="flex flex-col justify-between">
                    <h3 className='text-sm font-semibold'>{data.title}</h3>
                    <h5 className='text-xs text-gray-700 font-medium'>{data.artists.join(", ")}</h5>
                    <h5 className='text-xs text-gray-500'>{data.album}</h5>
                  </div>
                </Link>
                <div className="flex flex-col gap-1.5">
                  <h4 className='text-xs text-gray-600'>Duração</h4>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-gray-600">
                      <span className='text-xs'>{timeElapsed}</span>
                      <span className='text-xs'>{songDuration}</span>
                    </div>
                    <div className='w-full h-1 relative'>
                      <div className='bg-gray-200 h-1 w-full rounded-md absolute'></div>
                      <motion.div className='bg-gray-900 h-1 rounded-md absolute' animate={{ width: `${songPercentage}%` }}></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>)}
    </div>
  )
}