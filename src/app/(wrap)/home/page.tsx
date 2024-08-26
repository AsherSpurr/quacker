import Form from "@/app/ui/feed/form";
import Quacks from "@/app/ui/feed/quacks";
import React from "react";

export default async function Page() {
    return (
        <main>
            <Form />
            <Quacks />
        </main>
    )
}