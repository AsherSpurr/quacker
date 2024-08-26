"use client";
import { quacks } from "@/app/lib/placeholder-data";
import Image, { StaticImageData } from "next/image";
import {
  ChatBubbleBottomCenterIcon,
  HeartIcon,
  ArrowPathRoundedSquareIcon
} from "@heroicons/react/24/outline";

export default function QuackWrapper() {
  //add profile image
  //name + username
  //post timestamp
  const quacksData = quacks;
  return (
    <>
      {quacksData.map((quack) => {
        return (
          <Quack
            key={quack.id}
            name={quack.name}
            userName={quack.userName}
            timeStamp={quack.timeStamp}
            content={quack.content}
            avatar={quack.avatar}
          />
        );
      })}
    </>
  );
}

export function Quack({
  name,
  userName,
  timeStamp,
  content,
  avatar,
}: {
  name: string;
  userName: string;
  timeStamp: string;
  content: string;
  avatar: StaticImageData;
}) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-blue-500 p-4 shadow-sm">
      <div className="flex flex-col p-4">
        <Image
          src={avatar}
          className="rounded-full"
          width={40}
          height={40}
          alt="avatar"
        />
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p>{userName}</p>
        <p>{timeStamp}</p>
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
