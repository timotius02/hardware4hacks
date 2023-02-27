import { type Hackathon } from "@prisma/client";
import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Hackathons from "~/components/hackathons";
import Hero from "~/components/hero";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const hackathons = await prisma.hackathon.findMany();
  return {
    props: {
      session,
      hackathons,
    },
  };
};

interface HomeProps {
  hackathons: Hackathon[];
}
export default function Home(props: HomeProps) {
  const { hackathons } = props;
  return (
    <div className="mx-auto flex flex-col">
      <Head>
        <title>Hardware4Hacks</title>
        <meta name="description" content="Platform " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Hero />
        <div>
          <Hackathons hackathons={hackathons} />
        </div>
      </main>
    </div>
  );
}
