"use client";

import Logo from "@/app/_components/Logo";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import ShareImageIconButton from "./ShareImageIconButton";
import ProfileIconButton from "./ProfileIconButton";

const Navbar = () => {
  const user = useAuth();

  // We want to display a toobar when user hovers over the image icon
  // We will create a div with position relative to the image icon
  // When user hovers over the image, we will display the toolbar

  return (
    <nav className="flex justify-between items-center p-container">
      <Link className="cursor-pointer" href="/home">
        <Logo />
      </Link>

      <div className="flex items-center gap-8">
        <button className="btn btn-ghost btn-circle">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.867 18 18 14.867 18 11C18 7.133 14.867 4 11 4C7.133 4 4 7.133 4 11C4 14.867 7.133 18 11 18ZM19.485 18.071L22.314 20.899L20.899 22.314L18.071 19.485L19.485 18.071Z"
              fill="#2A2A2A"
            />
          </svg>
        </button>
        <ShareImageIconButton />
        <ProfileIconButton avatarURL={user?.avatar ?? null} />
      </div>
    </nav>
  );
};

export default Navbar;
