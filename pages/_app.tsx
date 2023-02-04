import type { AppProps } from "next/app";
import "@fontsource/public-sans";
import dynamic from "next/dynamic";

const MuiWrapper = dynamic(() => import("../components/wrappers"), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MuiWrapper>
      <Component {...pageProps} />
    </MuiWrapper>
  );
}
