import Sidebar from "./sidebar";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next/types";

interface User {
  username: string;
  profilePicture: string;
}

interface Group {
  id: string,
  ownerId: string,
  name: string,
  description: string,
  thumbnail: string,
  createdAt: Date,
  _count: {
    members: number
  }
}

interface Props { users: { members: User[] }, groupData: Group }

export default function Page({ users, groupData }: Props) {
  return <section className="h-full">
    <Sidebar users={users.members} group={groupData} />
  </section>
}

export const getServerSideProps: GetServerSideProps<Props> = async function getServerSideProps(context: GetServerSidePropsContext) {
  // Fetch data from external API
  const group = context.query.group as string

  const userRes = await fetch(`http://localhost:3001/groups//${group}/members`)
  const users = await userRes.json()

  const groupRes = await fetch(`http://localhost:3001/groups//${group}`)
  const groupData = await groupRes.json()

  // Pass data to the page via props
  return { props: { users, groupData } }
}
