"use client";

import { AuthContext } from "@/providers/AuthProvider";
import Link from "next/link";
import { useContext } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { UserNav } from "./UserNav";
import { User } from "lucide-react";

export default function Header() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="flex justify-between items-center px-5 py-5">
        <Link href="/">
          <h1 className="text-center flex items-center justify-center font-bold text-2xl text-red-600">
            Bipod Shongket
          </h1>
        </Link>

        <div className="space-x-2 flex justify-around items-center">
          {user ? (
            <>
              <UserNav />
              <Link href="/allsosrequest">
                <Button className="bg-red-700 text-secondary-foreground">
                  See All Global Request
                </Button>
              </Link>
              <Link href="/mapdash">
                <Button className="bg-red-700 text-secondary-foreground">
                  MAP
                </Button>
              </Link>
              <Link href="/community">
                <Button className="bg-green-700 text-secondary-foreground">
                  Community
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/log-in">
                <Button>Log In</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}

          {/* <Link href="/about">
                        <Button>About</Button>
                    </Link> */}
          <ThemeToggle></ThemeToggle>
        </div>
      </div>

      <Separator className="bg-red-600"></Separator>
    </>
  );
}
