import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProfileIconButton = ({ avatarURL }: { avatarURL: string | null }) => {
  return (
    <div className="relative tooltip-trigger z-10">
      <button className="avatar-container avatar-gradient cursor-pointer">
        {avatarURL && (
          <Image priority sizes="100%" fill src={avatarURL} alt="User Avatar" />
        )}
      </button>
      <div className="py-2 tooltip-content absolute top-[100%] right-0">
        <div className="bg-light-background py-4 px-8 flex flex-col items-center justify-center gap-2 rounded-2xl border border-light-background">
          <Link
            href="/profile"
            className="btn btn-ghost whitespace-nowrap text-lg w-full"
          >
            Your Profile
          </Link>
          <button className="btn btn-ghost whitespace-nowrap text-lg w-full">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileIconButton;
