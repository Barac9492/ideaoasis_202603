import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { AuthButton } from "./AuthButton";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/archive/1/", label: "아카이브" },
  { href: "/pricing/", label: "요금제" },
  { href: "/about/", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-100 dark:border-zinc-800">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Idea<span className="text-[#2563EB]">Oasis</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
