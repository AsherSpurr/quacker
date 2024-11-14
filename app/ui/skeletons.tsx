const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function QuackSkeleton() {
<div className="rounded-xl bg-gray-200 p-4 shadow-sm">
      <div className="flex flex-col p-4">
        <div className="h-40 w-40 rounded-md bg-gray-200"/>
        <div className="h-2 w-full bg-gray-200 my-2"/>
        <div className="flex flex-row items-center justify-around ">
          {/* <button
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
          </button> */}
        </div>
      </div>
    </div>
}