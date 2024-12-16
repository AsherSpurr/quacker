import React from "react";

export default function Form() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form className="flex flex-">
        <input placeholder="What's quackin'?"></input>
        <button>Post</button>
      </form>
    </div>
  );
}
