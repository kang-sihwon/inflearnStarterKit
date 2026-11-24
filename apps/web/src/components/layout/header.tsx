import Link from "next/link";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "홈" },
  { href: "/todos", label: "할 일 예제" },
  { href: "/about", label: "소개" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          Starter Kit
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={buttonVariants({ variant: "ghost", size: "sm" })}>
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="메뉴 열기">
                  <Menu className="size-4" />
                </Button>
              }
            />
            <SheetContent>
              <SheetTitle className="sr-only">메뉴</SheetTitle>
              <nav className="mt-10 flex flex-col gap-2 px-4">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="rounded-md px-2 py-2 hover:bg-accent">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
