import Link from 'next/link'

export default function Home() {
  return (
    <div className="mt-36 flex flex-col items-center text-center">
      <h1 className='font-bold text-6xl'>Typer.io</h1>
      <h3 className='font-bold text-4xl w-1/2 mt-6'>
        Lorem ipsum dolor sit amet <span className='text-purple-700'>consectetur</span> adipisicing elit.
      </h3>

      <Link
        className='mt-12 px-6 py-2 text-xl font-medium bg-purple-700 text-zinc-50 rounded-lg border-2 border-black'
        href='/explore'
      >
        Explorar
      </Link>
    </div>
  )
}
