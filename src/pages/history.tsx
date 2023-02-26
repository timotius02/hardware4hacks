import { getServerSession } from "next-auth";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";
import { type GetServerSideProps } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";
import { useCallback } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // TRPC SSR Shenanigans
  const ctx = createInnerTRPCContext({ session });

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx,
    transformer: superjson,
  });

  await ssg.hackathon.getItemsWaiting.prefetch();

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
    },
  };
};

export default function History() {
  const entries = api.hackathon.getItemsWaiting.useQuery();
  const utils = api.useContext();
  const removeReservation = api.hackathon.removeItemFromWaiting.useMutation({
    // Optimistic Update
    onMutate: async (inputId) => {
      await utils.hackathon.getItemsWaiting.cancel();
      const previousItems = utils.hackathon.getItemsWaiting.getData();

      const newItems = previousItems?.filter((entry) => entry.id !== inputId);
      utils.hackathon.getItemsWaiting.setData(undefined, newItems);
      return { previousItems };
    },
    // On error, we roll back
    onError: (err, newItem, context) => {
      if (context) {
        utils.hackathon.getItemsWaiting.setData(
          undefined,
          context.previousItems
        );
      }
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await utils.hackathon.getItemsWaiting.invalidate();
    },
  });

  const handleRemove = useCallback(
    (entryId: string) => {
      removeReservation.mutate(entryId);
    },
    [removeReservation]
  );
  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-2xl flex-col py-16 px-4 sm:flex-row sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Waiting for Approval
            </h2>
          </div>

          {entries.data && entries.data.length > 0 ? (
            <div className="mt-8">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {entries.data.map((entry) => (
                    <li key={entry.item.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={entry.item.image}
                          alt={entry.item.imageAlt}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{entry.item.name}</h3>
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => handleRemove(entry.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {entry.quantity}</p>

                          <div className="flex"></div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
