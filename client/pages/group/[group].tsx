import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import MessagesContainer from "./messagesContainer";
import MessageInput from "./messageInput";
import Head from 'next/head'

import { socket } from "@/service/socket";

import { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import { clientTRPC } from "@/service/trpc";
import { Group, Message, User } from "@/types/interfaces";
import axios from "axios";
import { getCookie } from "cookies-next";
import { getCurrentlyPlaying } from "@/service/spotify";

interface Props {
  user: User,
  users: User[],
  groupData: Group,
  messagesFromDB: any[]
}

let groupName = ""

export default function Page({ user, users, groupData, messagesFromDB }: Props) {
  const [messages, setMessages] = useState<Message[]>(messagesFromDB)
  const [mention, setMention] = useState<Message | null>(null)
  const [status, setStatus] = useState("Idle")
  const [spotifyStatus, setSpotifyStatus] = useState("Idle")


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

  function updateStatus(status: { user: string, status: string }) {
    document.querySelector(`#${status.user}`)!.innerHTML = status.status;
  }

  useEffect(() => {
    socket.emit('join', groupData.id)

    socket.off('receiveMessage', newMessageHandler)
    socket.on('receiveMessage', newMessageHandler)
    socket.off('status', updateStatus)
    socket.on('status', updateStatus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData]);

  const spotifyAcessToken = getCookie('spotify_access_token')

  useEffect(() => {
    if (!spotifyAcessToken) {
      // setSeconds(0); // if you want to reset it as well
      return;
    }

    getCurrentlyPlaying(spotifyAcessToken as string).then(res => {
      setSpotifyStatus(`Ouvindo <strong>${res.item.name}</strong>`)
    });
    

    const interval = setInterval(async () => {
      let currentlyPlaying = await getCurrentlyPlaying(spotifyAcessToken as string);
      setSpotifyStatus(`Ouvindo <strong>${currentlyPlaying.item.name}</strong>`)
    }, 1000);
    return () => clearInterval(interval);
  }, [spotifyAcessToken]);

  useEffect(() => {
    if (status != 'digitando...') setStatus(spotifyStatus)
  }, [spotifyStatus, status])

  useEffect(() => {
    socket.emit('status', ({
      user: 'status-' + user.username,
      status: status,
    }))
  }, [status, user.username])

  return <section className="h-full flex">
    <Head>
      <title>{groupData.name}</title>
    </Head>
    <Sidebar users={users} group={groupData} />
    <div className="flex flex-col justify-between flex-1">
      <MessagesContainer messages={groupMessages(messages)} setMention={setMention} />
      <MessageInput setStatus={setStatus} defaultStatus={spotifyStatus} user={user} mention={mention} setMention={setMention} />
    </div>
  </section>
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<Props> = async function getServerSideProps(context: GetServerSidePropsContext) {
  // Fetch data from external API
  const session = await getSession(context)

  const group = context.query.group as string

  const groupData = await clientTRPC.groups.getGroup.query(group)

  const users = await clientTRPC.groups.getMembers.query({
    group: group,
    email: session?.user?.email as string
  })

  const messagesFromDB = await clientTRPC.groups.getMessages.query({
    group: group,
    email: session?.user?.email as string
  })

  const user = await clientTRPC.user.getByEmail.query(session?.user?.email as string)

  // Pass data to the page via props
  return { props: { user, users, groupData, messagesFromDB } }
}