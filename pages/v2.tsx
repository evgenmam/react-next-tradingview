import { useState } from "react";
import dynamic from "next/dynamic";

const V2 = dynamic(() => import("../components/v2"), { ssr: false });

export default function Home() {
  return (
    <main>
      <V2 />
    </main>
  );
}
