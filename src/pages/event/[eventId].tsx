import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { Reservations } from "~/components/events/reservations";
import { Inventory } from "~/components/events/inventory";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const eventId = context.params?.eventId;

  if (!eventId) {
    throw new Error("Event Id Not Found!");
  }

  let hackathonId: string;
  if (Array.isArray(eventId)) {
    hackathonId = eventId.join("");
  } else {
    hackathonId = eventId;
  }

  // TRPC SSR Shenanigans
  const ctx = createInnerTRPCContext({ session: null });

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx,
    transformer: superjson,
  });

  await Promise.all([
    ssg.hackathon.getAllItems.prefetch(hackathonId),
    ssg.hackathon.getAllReservables.prefetch(hackathonId),
  ]);

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
      hackathonId,
    },
  };
};

interface EventProps {
  hackathonId: string;
}
export default function Event(props: EventProps) {
  const items = api.hackathon.getAllItems.useQuery(props.hackathonId);
  const reservables = api.hackathon.getAllReservables.useQuery(
    props.hackathonId
  );

  return (
    <>
      <Inventory items={items.data ?? []} />
      <Reservations reservables={reservables.data ?? []} />
    </>
  );
}
