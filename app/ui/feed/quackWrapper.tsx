
import { fetchQuacks } from "../../lib/data";
import { Quacks } from "./quacks";
import { Quack } from "../../lib/definitions";

export default async function QuackWrapper() {
  //add profile image
  //name + username
  //post timestamp

  // When login is completed update the userID argument in fetchQuacks
  const data = await fetchQuacks('0728b9ce-f89a-4232-a1a1-82ec7fb60371');

  return (
    <>
      {data.map((quack: Quack) => {
        return (
          <Quacks
            key={quack.quack_id}
            quack_id={quack.quack_id}
            user_id={quack.user_id}
            created_at={quack.created_at}
            content={quack.content}
            media_url={quack.media_url}
          />
        );
      })}
    </>
  );
}

