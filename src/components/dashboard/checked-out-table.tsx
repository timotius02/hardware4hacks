import { MoreVertical } from "lucide-react";
import { api } from "~/utils/api";
import { Button } from "../ui/button";

export default function CheckedOutTable() {
  const entries = api.hackathon.getItemsCheckedOut.useQuery().data ?? [];
  const utils = api.useContext();
  const returnItem = api.hackathon.returnItem.useMutation({
    onMutate: async (reservationId) => {
      await utils.hackathon.getItemsCheckedOut.cancel();
      const previousReservables = utils.hackathon.getItemsCheckedOut.getData();
      const newReservations = previousReservables?.filter(
        (reservation) => reservation.id !== reservationId
      );
      utils.hackathon.getItemsCheckedOut.setData(undefined, newReservations);
      return { previousReservables };
    },
    // On error, we roll back
    onError: (err, newItem, context) => {
      if (context) {
        utils.hackathon.getItemsCheckedOut.setData(
          undefined,
          context.previousReservables
        );
      }
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await utils.hackathon.getItemsCheckedOut.invalidate();
    },
  });

  const handleReturn = (reservationId: string) => {
    returnItem.mutate(reservationId);
  };
  return (
    <div className="flex flex-col">
      <div className="align-middle">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 px-4 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                >
                  <button className="flex items-center gap-x-3 focus:outline-none">
                    <span>Name</span>
                  </button>
                </th>

                <th
                  scope="col"
                  className="px-12 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                >
                  Status
                </th>

                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                >
                  Items
                </th>

                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                >
                  Quantity
                </th>

                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                >
                  Actions
                </th>

                <th scope="col" className="relative py-3.5 px-4">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {entries.map((entry) => (
                <tr key={entry.item.id}>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
                    <div>
                      <h2 className="font-medium text-gray-800 dark:text-white ">
                        {entry.user.name}
                      </h2>
                      <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                        {entry.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-12 py-4 text-sm font-medium">
                    <div className="inline gap-x-2 rounded-full bg-slate-100/60 px-3 py-1 text-sm font-normal text-slate-600 dark:bg-gray-800">
                      Checked Out
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <div>
                      <h4 className="text-gray-700 dark:text-gray-200">
                        {entry.item.name}
                      </h4>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <div className="flex items-center">{entry.quantity}</div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <Button onClick={() => handleReturn(entry.id)}>
                      Return
                    </Button>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <button className="rounded-lg px-1 py-1 text-gray-500 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300">
                      <MoreVertical />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
