import { MoreVertical } from "lucide-react";

export default function AvailableTable() {
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
                  About
                </th>

                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                >
                  Users
                </th>

                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                >
                  License use
                </th>

                <th scope="col" className="relative py-3.5 px-4">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              <tr>
                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
                  <div>
                    <h2 className="font-medium text-gray-800 dark:text-white ">
                      Catalog
                    </h2>
                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      catalogapp.io
                    </p>
                  </div>
                </td>
                <td className="whitespace-nowrap px-12 py-4 text-sm font-medium">
                  <div className="inline gap-x-2 rounded-full bg-emerald-100/60 px-3 py-1 text-sm font-normal text-emerald-500 dark:bg-gray-800">
                    Customer
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm">
                  <div>
                    <h4 className="text-gray-700 dark:text-gray-200">
                      Content curating app
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      Brings all your news into one place
                    </p>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm">
                  <div className="flex items-center">test</div>
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-sm">
                  <div className="h-1.5 w-48 overflow-hidden rounded-full bg-blue-200">
                    <div className="h-1.5 w-2/3 bg-blue-500"></div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-sm">
                  <button className="rounded-lg px-1 py-1 text-gray-500 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300">
                    <MoreVertical />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
