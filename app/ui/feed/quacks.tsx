"use client"
import Image, { StaticImageData } from "next/image";
import {
  ChatBubbleBottomCenterIcon,
  HeartIcon,
  ArrowPathRoundedSquareIcon
} from "@heroicons/react/24/outline";

export function Quacks({
  quack_id,
  user_id,
  created_at,
  content,
  media_url
}: {
  quack_id: number,
  user_id: number,
  created_at: string,
  content: string,
  media_url: string | null;
}) {
    const formattedDate = new Date(created_at).toLocaleString(); // Move this to utils file and move to fucntion

  return (
    <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-blue-500 p-4 shadow-sm">
      <div className="flex flex-col p-4">
        {/* <Image
          src={avatar}
          className="rounded-full"
          width={40}
          height={40}
          alt="avatar"
        /> */}
        {/* <h3 className="text-xl font-bold text-white">{name}</h3> */}
        {/* <p>{userName}</p> */}
        <p>{formattedDate}</p>
        <p className="text-white">{content}</p>
        <div className="flex flex-row items-center justify-around ">
          <button
            className="h-2 w-2"
            onClick={() => console.log("clicked comment")}
          >
            <ChatBubbleBottomCenterIcon className="size-6 text-white-500" />
          </button>
          <button
            className="h-2 w-2"
            onClick={() => console.log("clicked heart")}
          >
            <HeartIcon className="size-6 text-white-500" />
          </button>
          <button
            className="h-2 w-2"
            onClick={() => console.log("clicked re-quack")}
          >
            <ArrowPathRoundedSquareIcon className="size-6 text-white-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
