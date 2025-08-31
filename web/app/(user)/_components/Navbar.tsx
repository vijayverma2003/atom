"use client";

import Logo from "@/app/_components/Logo";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const user = useAuth();

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
        <button className="btn btn-ghost btn-circle">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.576 14.576L15.707 10.707C15.5195 10.5195 15.2652 10.4142 15 10.4142C14.7348 10.4142 14.4805 10.5195 14.293 10.707L6.865 18.135C5.74832 17.1998 4.90816 15.9775 4.43512 14.5999C3.96208 13.2223 3.87413 11.7417 4.18074 10.3177C4.48735 8.89382 5.17689 7.58063 6.17499 6.5198C7.17309 5.45897 8.44187 4.69077 9.84449 4.29804C11.2471 3.90532 12.7303 3.90298 14.1342 4.29128C15.538 4.67957 16.8092 5.44377 17.8107 6.50145C18.8121 7.55912 19.5058 8.87014 19.8169 10.2931C20.128 11.716 20.0447 13.1969 19.576 14.576ZM12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22ZM11 10C11 10.5304 10.7893 11.0391 10.4142 11.4142C10.0391 11.7893 9.53043 12 9 12C8.46957 12 7.96086 11.7893 7.58579 11.4142C7.21071 11.0391 7 10.5304 7 10C7 9.46957 7.21071 8.96086 7.58579 8.58579C7.96086 8.21071 8.46957 8 9 8C9.53043 8 10.0391 8.21071 10.4142 8.58579C10.7893 8.96086 11 9.46957 11 10Z"
              fill="var(--light-foreground)"
            />
          </svg>
        </button>
        <button className="avatar-container avatar-gradient cursor-pointer">
          {user?.avatar && (
            <Image
              priority
              sizes="100%"
              fill
              src={user?.avatar || ""}
              alt="User Avatar"
            />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
