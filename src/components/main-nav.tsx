import { Archive } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "~/lib/utils";

// import { siteConfig } from "@/config/site"
// import { Icons } from "@/components/icons"
// import { MobileNav } from "@/components/mobile-nav"
import { type MainNavItem } from "~/types";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items }: MainNavProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Archive />
        <span className="hidden font-bold sm:inline-block">Hardware4Hacks</span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center text-lg font-semibold text-slate-600 sm:text-sm",
                segment &&
                  item.href.startsWith(`/${segment}`) &&
                  "text-slate-900",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
