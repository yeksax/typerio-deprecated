/* eslint-disable react-hooks/exhaustive-deps */
import { getSession, useSession } from "next-auth/react";
import { use, useEffect, useRef, useState } from "react";
import Sidebar from "./sidebar";
import MessagesContainer from "./messagesContainer";
import MessageInput from "./messageInput";
import Head from 'next/head'

import { socket } from "@/service/socket";

import { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import { clientTRPC } from "@/service/trpc";
import { Group, Message, User, WaitingMessageProps } from "@/types/interfaces";
import axios from "axios";
import { getCookie } from "cookies-next";
import { getCurrentlyPlaying } from "@/service/spotify";
import GroupHeader from "./groupHeader";
import MessageComponent from "./message";
import WaitingMessage from "./waitingMessage";

interface Props {
  user: User,
  groupData: Group,
  usersFromDB: User[],
  messagesFromDB: any[]
}

let groupName = ""

export default function GroupPage({ user, usersFromDB, groupData, messagesFromDB }: Props) {
  const [messages, setMessages] = useState<Message[]>(messagesFromDB)
  const [mention, setMention] = useState<Message | null>(null)
  const [status, setStatus] = useState<{ title: string, data?: object }>({ title: "Idle" })
  const [spotifyStatus, setSpotifyStatus] = useState<{ title: string, data?: {} }>({ title: "Idle" })
  const [messageOnWait, setMessageOnWait] = useState<WaitingMessageProps | null>(null)
  let users = useRef<User[]>(usersFromDB)

  const { data: session } = useSession()

  function groupMessages(msgs: any) {
    let groupedMessages: any[] = [[]];
    if (msgs.length > 0) {
      let lastAuthor = msgs[0].authorId;

      msgs.forEach((msg: any) => {
        if (msg.authorId == lastAuthor) {
          groupedMessages[groupedMessages.length - 1].push(msg);
        } else {
          lastAuthor = msg.authorId;
          groupedMessages.push([msg]);
        }
      });

      return groupedMessages;
    }

    return [[]];
  }

  function newMessageHandler(message: any) {
    setMessages(messages => [...messages, message]);
  }

  function updateStatus(status: { user: string, status: { title: string, data: {} } }) {
    let userIndex = users.current.findIndex(user => user.username === status.user)
    if (userIndex != -1) {
      let usersClone = [...users.current]
      usersClone[userIndex].status = { ...status.status, data: { ...status.status.data } }

      users.current = usersClone
    }
  }

  async function newUserHandler(user: string) {
    let userExist = users.current.filter(u => u.username == user).length > 0
    let usersClone = [...users.current]

    if (!userExist) {
      let newUser: any = await clientTRPC.user.get.query(user)
      usersClone.push({ ...newUser, status: { title: "Idle", data: {} } })
    }

    users.current = (usersClone)
  }

  async function messageSent() {
    setMessageOnWait(null)
  }

  useEffect(() => {
    socket.emit('join', { group: groupData.id, user: user.username })

    socket.off('receiveMessage', newMessageHandler)
    socket.on('receiveMessage', newMessageHandler)
    socket.off('messageSent', messageSent)
    socket.on('messageSent', messageSent)
    socket.off('join', newUserHandler)
    socket.on('join', newUserHandler)
    socket.off('status', updateStatus)
    socket.on('status', updateStatus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData]);

  const spotifyAcessToken = getCookie('spotify_access_token')

  function getSpotifyCurrentlyPlayingData(rawData: any): typeof status {
    if (rawData.item) {
      const data = {
        source: "Spotify",
        thumbnail: rawData.item.album.images[0].url,
        title: rawData.item.name,
        id: rawData.item.id,
        album: rawData.item.album.name,
        artists: rawData.item.artists.map((artist: any) => artist.name),
        progress: rawData.progress_ms,
        duration: rawData.item.duration_ms,
        paused: rawData.is_playing,
        timestamp: rawData.timestamp,
        is_playing: rawData.is_playing,
      }

      return {
        title: `<span>Ouvindo <span className="font-bold">${rawData.item.name}</span></span>`,
        data: data
      }
    }
    return {
      title: `Idle`,
      data: {}
    }
  }

  useEffect(() => {
    if (!spotifyAcessToken) {
      return;
    }

    getCurrentlyPlaying(spotifyAcessToken as string).then(res => {
      setSpotifyStatus(getSpotifyCurrentlyPlayingData(res))
    });

    const interval = setInterval(async () => {
      let currentlyPlaying = await getCurrentlyPlaying(spotifyAcessToken as string);
      let status = getSpotifyCurrentlyPlayingData(currentlyPlaying)
      setSpotifyStatus(status)
    }, 1000);
    return () => clearInterval(interval);
  }, [spotifyAcessToken]);

  useEffect(() => {
    socket.emit('status', ({
      user: user.username,
      status: status,
    }))
  }, [status.title, status.data, user.username])

  useEffect(() => {
    if (status.title !== "digitando...") {
      setStatus({ ...spotifyStatus, data: { ...spotifyStatus.data } })
    }
  }, [spotifyStatus])

  return <section className="h-full flex">
    <Head>
      <title>{groupData.name}</title>
    </Head>
    <Sidebar users={users.current} group={groupData} />
    <div className="flex flex-col justify-between flex-1">
      <GroupHeader group={groupData} typingUsers={users.current.filter(user => user.status?.title == "digitando...").map(user => user.name)} />
      <MessagesContainer messages={groupMessages(messages)} setMention={setMention} >
        {messageOnWait && <WaitingMessage message={messageOnWait} />}
      </MessagesContainer>

      <MessageInput setStatus={setStatus} setMessageOnWait={setMessageOnWait} users={users.current} defaultStatus={spotifyStatus ? spotifyStatus.title : "Idle"} user={user} mention={mention} setMention={setMention} />
    </div>
  </section>
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<Props> = async function getServerSideProps(context: GetServerSidePropsContext) {
  // Fetch data from external API
  const session = await getSession(context)
  const group = context.query.group as string
  const groupData = await clientTRPC.groups.getGroup.query(group)

  const usersFromDB = await clientTRPC.groups.getMembers.query({
    group: group,
    email: session?.user?.email as string
  })

  const messagesFromDB = await clientTRPC.groups.getMessages.query({
    group: group,
    email: session?.user?.email as string
  })

  const user = await clientTRPC.user.getByEmail.query(session?.user?.email as string)

  // Pass data to the page via props
  return { props: { user, usersFromDB, groupData, messagesFromDB } }
}