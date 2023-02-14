import { useState } from "react";
import dynamic from "next/dynamic";

const TVBuilder = dynamic(() => import("../components/builder"), {
  ssr: false,
});

export default function Home() {
  return <TVBuilder />;
}
