import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function CreateGroup({appendGroup, currentGroups}: {appendGroup: any, currentGroups: any}) {
  const imageRef = useRef(null)
  const urlRef = useRef(null)
  const user = useSession().data?.user

  const [isEditingImage, setIsEditingImage] = useState(false)
  const [data, setData] = useState({
    name: "Criar novo grupo",
    description: "Descrição...",
    thumbnail: "https://source.unsplash.com/random/?paper"
  })

  function handleCreation() {
    if (!user) return

    let postData = {
      ownerEmail: user.email,
      group: {
        ...data
      },
    }

    // console.log(postData)
    fetch(`http://localhost:3001/groups/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    }).then(async (r) => {
      let newGroup = await r.json()
      appendGroup([...currentGroups, {...newGroup, isIn: true, _count: {members: 1}}])
    }).catch((e) => {
      console.log(e)
    })
  }

  function handleInput(e: any) {
    let length = e.target.value.length
    let min = 1

    e.target.style.width = `${Math.max(length, min)}ch`
    let currentAttribute = e.target.dataset.attribute

    if (currentAttribute != 'thumbnail') {
      setData({ ...data, [currentAttribute]: e.target.value })
    }
  }

  function switchEditing() {
    setIsEditingImage(!isEditingImage)
    // @ts-ignore
    if (isEditingImage) urlRef.current.focus()
  }

  function changeThumbnail(e: any) {
    setData({ ...data, ['thumbnail']: "https://source.unsplash.com/random/?" + e.target.value })
  }

  function handleKeyboardInput(e: any) {
    if (e.key == "Enter") {
      setData({ ...data, ['thumbnail']: "https://source.unsplash.com/random/?" + e.target.value })
    }
  }

  return (
    <div className="flex gap-4 justify-between last:pb-10">
      <Image
        className="h-32 w-32 object-cover aspect-square rounded-md border-black border-4 cursor-pointer"
        onClick={switchEditing}
        src={data.thumbnail}
        alt={`new group thumbnail`}
        ref={imageRef}
        width={256}
        height={256} />
      <div className="flex justify-between flex-col w-full overflow-hidden">
        <div className="flex flex-col gap-2">
          {isEditingImage ?
            <span
              className="flex border-2 border-black px-2 rounded-md box-content max-w-full w-fit"
            >
              <span>
                https://source.unsplash.com/random/?
              </span>
              <input
                key='thumbnail'
                onInput={handleInput}
                onBlur={changeThumbnail}
                onKeyDown={handleKeyboardInput}
                className="outline-none font-semibold"
                ref={urlRef}
                defaultValue={data.thumbnail.split('?')[1]}
                data-attribute='thumbnail'
                style={{ width: `${data.thumbnail.split('?')[1].length}ch` }}
              />
            </span> :

            <>
              <input
                onInput={handleInput}
                className="border-2 border-black px-2 rounded-md text-lg font-semibold box-content"
                defaultValue={data.name}
                data-attribute='name'
                style={{ width: `${data.name.length}ch` }}
              />
              <input
                onInput={handleInput}
                className="border-2 border-black px-2 rounded-md box-content"
                defaultValue={data.description}
                data-attribute='description'
                style={{ width: `${data.description.length}ch` }}
              /></>}
        </div>
        <button
          onClick={handleCreation}
          className="border-black w-fit border-2 box-border text-black px-4 py-1 rounded text-xs font-semibold">
          Criar
        </button>
      </div >
    </div >
  )
}