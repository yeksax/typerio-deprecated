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

interface Props {
  user: User,
  users: User[],
  groupData: Group,
  messagesFromDB: any[]
}

let groupName = ""

export default function Page({ user, users, groupData, messagesFromDB }: Props) {
  let [messages, setMessages] = useState<Message[]>(messagesFromDB)

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

  function setStatus(status: { user: string, status: string }) {
    // @ts-ignore
    document.querySelector(`#${status.user}`).innerHTML = status.status;
  }

  useEffect(() => {
    socket.emit('join', groupData.id)

    socket.off('receiveMessage', newMessageHandler)
    socket.on('receiveMessage', newMessageHandler)
    socket.off('status', setStatus)
    socket.on('status', setStatus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData]);

  return <section className="h-full flex">
    <Head>
      <title>{groupData.name}</title>
    </Head>
    <Sidebar users={users} group={groupData} />
    <div className="flex flex-col justify-between flex-1">
      <MessagesContainer messages={groupMessages(messages)} />
      <MessageInput user={user} />
    </div>
  </section>
}

//@ts-ignore
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

  const user = await clientTRPC.user.get.query(session?.user?.email as string)

  // Pass data to the page via props
  return { props: { user, users, groupData, messagesFromDB } }
}