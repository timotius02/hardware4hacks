import { type NextPage } from "next";
import Head from "next/head";
import { type hackathon } from "~/components/hackathon-card";
import Hackathons from "~/components/hackathons";
import { Header } from "~/components/header";
import Hero from "~/components/hero";

const hackathons: hackathon[] = [
  {
    name: "HackNYU",
    url: "https://www.hacknyu.org/",
    banner:
      "https://s3.amazonaws.com/assets.mlh.io/events/splashes/000/212/494/thumb/Event_Backsplash.png?1673562402",
    logo: "https://s3.amazonaws.com/assets.mlh.io/events/logos/000/212/494/thumb/Event_Logo.png",
    code: "hacknyu2023",
    date: "Feb 18th - 19th",
    city: "Brooklyn",
    state: "NY",
  },
];
const Home: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div className="mx-auto flex flex-col">
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Platform " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <Hero />
        <div>
          <Hackathons hackathons={hackathons} />
        </div>
      </main>
    </div>
  );
};

export default Home;
