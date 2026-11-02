"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, UserRound } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import { BookNookLogo } from "@/components/brand/booknook-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { primaryNav, type NavItem } from "@/lib/constants/navigation";
import { demoUser } from "@/lib/demo/user";

// Until BetterAuth is wired up, the demo reader is treated as signed in so the
// private routes and the account menu can be reviewed.
const isSignedIn = true;

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = primaryNav.filter((item) => isSignedIn || !item.private);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="BookNook home"
          className="shrink-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <BookNookLogo />
        </Link>

        <nav
          aria-label="Main navigation"
          className="ml-4 hidden items-center gap-1 lg:flex"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActivePath(pathname, item.href)}
            />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />

          {isSignedIn ? (
            <UserMenu />
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Button
                render={<Link href="/login" />}
                nativeButton={false}
                variant="ghost"
                className="rounded-full"
              >
                Login
              </Button>
              <Button
                render={<Link href="/register" />}
                nativeButton={false}
                className="rounded-full"
              >
                Register
              </Button>
            </div>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="inline-flex size-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[86vw] max-w-sm gap-0 bg-background p-0"
            >
              <SheetHeader className="border-b border-border/60 px-5 py-4">
                <SheetTitle className="sr-only">BookNook navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Links to every room in the BookNook library.
                </SheetDescription>
                <BookNookLogo />
              </SheetHeader>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1 p-3"
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {item.label}
                      {typeof item.count === "number" && (
                        <span
                          className={cn(
                            "ml-auto rounded-full px-2 py-0.5 text-[0.62rem] font-semibold",
                            active
                              ? "bg-white/15 text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {item.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <SheetFooter className="mt-auto gap-3 border-t border-border/60 p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-[#d9c6b5] text-[0.65rem] font-semibold text-[#4b3a2c] dark:bg-[#3a2d25] dark:text-[#e8d6c4]">
                      {demoUser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {demoUser.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {demoUser.email}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => {
                    setMenuOpen(false);
                    toast.info("Logout will be connected to BetterAuth next.", {
                      description: "You are browsing with the demo reader.",
                    });
                  }}
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.82rem] font-medium whitespace-nowrap transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {item.label}
      {typeof item.count === "number" && (
        <span
          className={cn(
            "rounded-full px-1.5 text-[0.6rem] font-semibold",
            active
              ? "bg-white/15 text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {item.count}
        </span>
      )}
    </Link>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="ml-0.5 rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Avatar>
          <AvatarFallback className="bg-[#d9c6b5] text-[0.65rem] font-semibold text-[#4b3a2c] dark:bg-[#3a2d25] dark:text-[#e8d6c4]">
            {demoUser.initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-2">
          <span className="block text-sm font-semibold text-foreground">
            {demoUser.name}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {demoUser.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href="/my-books" />}
          className="gap-2 px-2 py-2"
        >
          <UserRound className="size-4" aria-hidden="true" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="gap-2 px-2 py-2"
          onClick={() =>
            toast.info("Logout will be connected to BetterAuth next.", {
              description: "You are browsing with the demo reader.",
            })
          }
        >
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
