import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { authOptions } from "~/server/auth";
import superjson from "superjson";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { useCallback } from "react";
import { Reservable, type Item } from "@prisma/client";
import Link from "next/link";
import { useToast } from "~/components/hooks/use-toast";
import { Spinner } from "~/components/ui/spinner";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // TRPC SSR Shenanigans
  const ctx = createInnerTRPCContext({ session });

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx,
    transformer: superjson,
  });

  await ssg.hackathon.getItemsInCart.prefetch();

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
    },
  };
};

export default function Checkout() {
  const itemsInCart = api.hackathon.getItemsInCart.useQuery();
  const reservablesInCart = api.hackathon.getReservablesInCart.useQuery();
  const entries = itemsInCart.data ?? [];
  const reservableEntries = reservablesInCart.data ?? [];
  const utils = api.useContext();
  const { toast } = useToast();

  const removeItem = api.hackathon.removeItemFromCart.useMutation({
    // Optimistic Update
    onMutate: async (id) => {
      await utils.hackathon.getItemsInCart.cancel();
      const previousEntries = utils.hackathon.getItemsInCart.getData();
      const newEntries = previousEntries?.filter(
        (entry) => entry.item.id !== id
      );
      utils.hackathon.getItemsInCart.setData(undefined, newEntries);
      return { previousEntries };
    },
    // On error, we roll back
    onError: (err, newItem, context) => {
      if (context) {
        utils.hackathon.getItemsInCart.setData(
          undefined,
          context.previousEntries
        );
      }
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await utils.hackathon.getItemsInCart.invalidate();
    },
  });

  const removeReservable = api.hackathon.removeReservableFromCart.useMutation({
    // Optimistic Update
    onMutate: async (id) => {
      await utils.hackathon.getReservablesInCart.cancel();
      const previousEntries = utils.hackathon.getReservablesInCart.getData();
      const newEntries = previousEntries?.filter(
        (entry) => entry.reservable.id !== id
      );
      utils.hackathon.getReservablesInCart.setData(undefined, newEntries);
      return { previousEntries };
    },
    // On error, we roll back
    onError: (err, newItem, context) => {
      if (context) {
        utils.hackathon.getReservablesInCart.setData(
          undefined,
          context.previousEntries
        );
      }
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await utils.hackathon.getReservablesInCart.invalidate();
    },
  });

  const checkout = api.hackathon.checkoutItems.useMutation({
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message,
        description: "Please try again later",
      });
    },
    onSettled: async () => {
      toast({
        description: "Check out success!",
      });
      await Promise.all([
        utils.hackathon.getItemsInCart.invalidate(),
        utils.hackathon.getAllItems.invalidate(),
      ]);
    },
  });

  const checkoutReservable = api.hackathon.checkoutReservable.useMutation({
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message,
        description: "Please try again later",
      });
    },
    onSettled: async () => {
      toast({
        description: "Check out success!",
      });
      await Promise.all([
        utils.hackathon.getItemsInCart.invalidate(),
        utils.hackathon.getAllItems.invalidate(),
      ]);
    },
  });

  const handleRemove = useCallback(
    (item: Item) => {
      removeItem.mutate(item.id);
    },
    [removeItem]
  );

  const handleRemoveReservable = useCallback(
    (reservable: Reservable) => {
      removeReservable.mutate(reservable.id);
    },
    [removeReservable]
  );

  const handleCheckout = useCallback(() => {
    if (itemsInCart.data) {
      const items = itemsInCart.data.map((entry) => ({
        itemId: entry.itemId,
        quantity: entry.quantity,
      }));
      checkout.mutate(items);
    }

    if (reservablesInCart.data) {
      const reservables = reservablesInCart.data.map(
        ({ reservableId, date }) => ({
          reservableId,
          date,
        })
      );
      checkoutReservable.mutate(reservables);
    }
  }, [itemsInCart.data, checkout, reservablesInCart.data, checkoutReservable]);

  return (
    <div className="h-full bg-white">
      <div className="mx-auto flex max-w-2xl flex-col py-16 px-4 sm:flex-row sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Items to borrow
            </h2>
          </div>

          {entries.length > 0 || reservableEntries.length > 0 ? (
            <div className="mt-8">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {entries.map((entry) => (
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
                          <div className="flex justify-between text-gray-900">
                            <div>
                              <h3 className="mb-1 text-base font-medium">
                                {entry.item.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Qty {entry.quantity}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemove(entry.item)}
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  {reservableEntries.map((entry) => (
                    <li key={entry.reservable.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={entry.reservable.image}
                          alt={entry.reservable.imageAlt}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base">
                            <div>
                              <h3 className="mb-1 text-base font-medium">
                                {entry.reservable.name}
                              </h3>

                              <p className="text-gray-500">
                                {`Reservation on ${entry.date.toLocaleString()}`}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveReservable(entry.reservable)
                              }
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex"></div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center justify-center">
              <img
                src="/empty_cart.svg"
                alt="No Items in Cart"
                className="h-48 w-96 object-contain"
              />
              <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                No Items in Cart
              </h3>
            </div>
          )}
        </div>

        <div className="py-6 px-8 sm:px-12">
          <div className="mt-6 flex items-center justify-center">
            <Button
              disabled={entries.length === 0 || checkout.isLoading}
              size="lg"
              onClick={handleCheckout}
            >
              {checkout.isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  {"Loading"}
                </>
              ) : (
                "Checkout"
              )}
            </Button>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              or
              <Link
                href="/"
                className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
              >
                Continue Browsing
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
