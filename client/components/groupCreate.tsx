import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function CreateGroup({ appendGroup, currentGroups }: { appendGroup: any, currentGroups: any }) {
  const imageRef = useRef(null)
  const imageInputRef = useRef(null)
  const user = useSession().data?.user

  const [thumbnail, setThumbnail] = useState("https://source.unsplash.com/random/?paper")

  function handleInput(e: any) {
    let length = e.target.value.length
    let min = 1

    e.target.style.width = `${Math.max(length, min)}ch`
    let currentAttribute = e.target.dataset.attribute
  }

  function changeThumbnail(event: any) {
    // setData({ ...data, ['thumbnail']: "https://source.unsplash.com/random/?" + e.target.value })
    let file = event.target.files[0]
    let reader = new FileReader()

    console.log(file)

    reader.onload = function (e) {
      setThumbnail(e.target?.result as string)
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: any) {
    e.preventDefault()

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        appendGroup([JSON.parse(this.response), ...currentGroups])
      }
    };
    xhttp.open("POST", "http://localhost:3001/groups/create", true);
    xhttp.send(new FormData(e.target));
  }

  function inputFile() {
    //@ts-expect-error
    imageInputRef.current.click()
  }

  return (
    <form
      className="flex gap-4 justify-between last:pb-10"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      method="post"
    >
      <Image
        className="h-32 w-32 object-cover aspect-square rounded-md border-black border-4 cursor-pointer"
        onClick={inputFile}
        src={thumbnail}
        alt={`new group thumbnail`}
        ref={imageRef}
        width={256}
        height={256} />
      <input type="file" ref={imageInputRef} name="thumbnail" accept="image/*" onChange={changeThumbnail} className="hidden" />
      <input type="hidden" name="owner" value={user?.email as string} />
      <div className="flex justify-between flex-col w-full overflow-hidden">
        <div className="flex flex-col gap-2">
          <input
            onInput={handleInput}
            className="border-2 border-black px-2 rounded-md text-lg font-semibold box-content"
            defaultValue="Novo grupo"
            data-attribute='name'
            name="name"
            style={{ width: `10ch` }}
          />
          <input
            onInput={handleInput}
            className="border-2 border-black px-2 rounded-md box-content"
            defaultValue="Descrição"
            data-attribute='description'
            name="description"
            style={{ width: `9ch` }}
          />
        </div>
        <button
          type="submit"
          className="transition-all duration-100 hover:bg-black hover:text-white border-black w-fit border-2 box-border text-black px-4 py-1 rounded text-xs font-semibold">
          Criar
        </button>
      </div >
    </form >
  )
}