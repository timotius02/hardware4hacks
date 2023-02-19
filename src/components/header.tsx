import { Archive } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

import { UserAccountNav } from "./user-account-nav";

export function Header() {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <header className="container sticky top-0 z-40 mx-auto max-w-screen-2xl bg-white px-6">
      <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
        <Link href="/" className="flex items-center space-x-2">
          <Archive />
          <span className="hidden font-bold sm:inline-block">
            Hardware4Hacks
          </span>
        </Link>

        {user ? (
          <UserAccountNav
            user={{
              name: user?.name,
              image: user?.image,
              email: user?.email,
            }}
          />
        ) : (
          <button onClick={() => void signIn()}>Signin</button>
        )}
      </div>
    </header>
  );
}
