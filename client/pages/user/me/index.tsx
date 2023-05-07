import TextSplitter from "@/components/textsplitter";
import { clientTRPC } from "@/service/trpc";
import { User } from "@/types/interfaces";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import InfoContainer from "./editInfo";
import InfoWrapper from "./infoWrapper";
import Separator from "./verticalSeparator";
import Link from "next/link";
import Connection from "./connection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLastfm, faSpotify } from "@fortawesome/free-brands-svg-icons";

interface ProfileProps {
  user: User
}

export default function Page({ user }: ProfileProps) {
  const [editing, setEditing] = useState(false)
  const [avatar, setAvatar] = useState(user.profilePicture)
  const imageInputRef = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [profile, setProfile] = useState({
    name: user.name,
    tag: user.tag,
    email: user.email,
  })

  function changeThumbnail(event: any) {
    let file = event.target.files[0]
    let reader = new FileReader()

    reader.onload = function (e) {
      setAvatar(e.target?.result as string)
    };
    reader.readAsDataURL(file);

  }

  function inputFile() {
    //@ts-expect-error
    imageInputRef.current.click()
  }

  function toggleEditing(e: any) {
    setEditing(!editing)
  }

  function saveChanges() {
    let data = formRef.current

    if (!data) return

    setProfile({
      name: data.user.value as string,
      email: data.email.value as string,
      tag: data.tag.value.padStart(4, "0") as string
    })

    if (avatar !== user.profilePicture) {
      clientTRPC.user.updateAvatar.mutate({
        id: user.id,
        base64string: avatar
      })
    }

    clientTRPC.user.update.mutate({
      id: user.id,
      data: {
        name: data.user.value as string,
        tag: data.tag.value.padStart(4, "0") as string
      }
    })

    setEditing(false)
  }

  function cancelChanges() {
    let data = formRef.current

    if (!data) return

    data.user.value = profile.name
    data.email.value = profile.email
    data.tag.value = profile.tag
    setAvatar(user.profilePicture)
    setEditing(false)
  }

  return (
    <div className="mx-40 flex flex-col">
      <TextSplitter text="Meu perfil" className="font-bold text-2xl mt-8 mb-8" />
      <div className="flex gap-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          onClick={() => editing && inputFile()}
          className={`rounded-xl border-8 border-black aspect-square w-48 h-48 object-cover ${editing ? "cursor-pointer" : ""}`}
          src={avatar} width={200} height={200} alt="profile picture" />
        <input type="file" ref={imageInputRef} name="thumbnail" accept="image/*" onChange={changeThumbnail} className="hidden" />
        <div className="flex flex-col justify-between w-full gap-12">
          <form ref={formRef} className="grid grid-cols-2 gap-x-8 w-full">
            <InfoWrapper label="Username">
              <InfoContainer defaultValue={user.name} editing={editing} maxLength={24} name="user" />
              <Separator />
              <InfoContainer defaultValue={user.tag} prefix="#" editing={editing} name="tag" maxLength={4} inputPrefix="0" />
            </InfoWrapper>
            <InfoWrapper label="Email" className="" readOnly>
              <InfoContainer defaultValue={user.email} readOnly editing={editing} name="email" />
            </InfoWrapper>
          </form>

          <div className="flex gap-2">
            {editing ?
              <>
                <button className="px-3 py-1 text-sm font-semibold hover:bg-black hover:text-white transition-colors border-2 w-fit border-black rounded-lg" onClick={saveChanges}>
                  Salvar Alterações
                </button>

                <button className="px-3 py-1 text-sm font-semibold hover:bg-black hover:text-white transition-colors border-2 w-fit border-black rounded-lg" onClick={cancelChanges}>
                  Cancelar
                </button>
              </> :
              <button className="px-3 py-1 text-sm font-semibold hover:bg-black hover:text-white transition-colors border-2 w-fit border-black rounded-lg" onClick={toggleEditing}>
                Editar Perfil
              </button>
            }
          </div>

        </div>
      </div>

      <TextSplitter text="Conexões" className="font-bold text-2xl mt-32 mb-8" />

      <div className="grid grid-cols-2 gap-x-8">
        <Connection provider="Spotify" providerCookie="spotify_access_token" icon={faSpotify} url="/api/spotify/connect">
        </Connection>
      </div>

    </div >
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const user = await clientTRPC.user.getProfileByEmail.query(session?.user?.email as string)

  return {
    props: {
      user
    }
  }
}