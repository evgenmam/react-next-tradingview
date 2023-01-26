import { useState } from "react";
import dynamic from "next/dynamic";

const TVComponents = dynamic(() => import("../components/tv-components"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <TVComponents />
    </main>
  );
}
