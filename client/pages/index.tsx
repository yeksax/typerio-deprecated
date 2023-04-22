import Link from 'next/link'
import { io } from 'socket.io-client'

export default function Home() {
  // testing socket
  // const socket = io('http://localhost:3001')
  // socket.emit("message", "Hello World")

  return (
    <div className="mt-36 flex flex-col items-center text-center">
      <h1 className='font-bold text-6xl'>Typer.io</h1>
      <h3 className='font-bold text-4xl w-1/2 mt-6'>
        Seu <span className='text-purple-700'>techchat</span>, todos devs a distância de um click!
      </h3>

      <div onClick={() => {
      }} className='mt-12 px-6 py-2 text-xl font-medium bg-purple-700 text-zinc-50 rounded-lg border-2 border-black'
      // href='/explore'
      >
        Explorar
      </div>
    </div>
  )
}
