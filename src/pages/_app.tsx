import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { KoHo } from "next/font/google";

const koho = KoHo({ weight: ["400", "500", "600"], subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${koho.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
