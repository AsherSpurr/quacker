
import { fetchQuacks } from "../../lib/data";
import { Quacks } from "./quacks";
import { Quack } from "../../lib/definitions";

export default async function QuackWrapper() {
  //add profile image
  //name + username
  //post timestamp
  const data = await fetchQuacks('84caebab-ea4a-4a38-9836-9e080aabc639');

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

