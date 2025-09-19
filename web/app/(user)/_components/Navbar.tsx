"use client";

import Logo from "@/app/_components/Logo";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import ProfileIconButton from "./ProfileIconButton";
import ShareImageIconButton from "./ShareImageIconButton";

const Navbar = () => {
  const user = useAuth();

  return (
    <nav className="flex justify-between items-center p-container">
      <Link className="cursor-pointer" href="/home">
        <Logo />
      </Link>

      <div className="flex items-center gap-8">
        <ShareImageIconButton />
        <ProfileIconButton avatarURL={user?.avatar ?? null} />
      </div>
    </nav>
  );
};

export default Navbar;
