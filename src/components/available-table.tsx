import { MoreVertical } from "lucide-react";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

export default function AvailableTable() {
  const items = api.hackathon.getAllItemsGlobal.useQuery().data ?? [];
  const trimString = (string: string, length = 50) => {
    return string.length > length
      ? string.substring(0, length - 3) + "..."
      : string;
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
                  Count
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left  text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                >
                  Image Link
                </th>

                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                >
                  Image Alt
                </th>

                <th scope="col" className="relative py-3.5 px-4">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
                    <div>
                      <h2 className="font-medium text-gray-800 dark:text-white ">
                        {item.name}
                      </h2>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-12 py-4 text-sm font-medium">
                    <div
                      className={cn(
                        "inline gap-x-2 rounded-full  px-3 py-1 text-sm font-normal dark:bg-gray-800",
                        item.count > 0
                          ? "bg-emerald-100/60 text-emerald-500 "
                          : "bg-red-100/60 text-red-500"
                      )}
                    >
                      {item.count > 0 ? "Available" : "Not Available"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <div className="flex items-center">{item.count}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <div>
                      <h4 className="text-gray-700 dark:text-gray-200">
                        <a
                          className="text-ellipsis whitespace-nowrap"
                          href={item.image}
                        >
                          {trimString(item.image)}
                        </a>
                      </h4>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <div>
                      <h4 className="text-gray-700 dark:text-gray-200">
                        {item.imageAlt}
                      </h4>
                    </div>
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
