import Head from "next/head";

import Editor from "@/components/editor";
import Header from "@/components/Header";

function Home() {
  return (
    <>
      <Head>
        <title>Potion</title>
        <meta name="description" content="Potion" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <main>
        <Header />
        <div className="m-4 mx-auto min-h-[calc(100vh-116px)] max-w-7xl rounded-2xl bg-neutral-900 bg-[url('/potion-background.png')] bg-[length:200px_200px] bg-center bg-no-repeat p-4 py-10 bg-blend-soft-light md:bg-[length:800px_800px]">
          <Editor />
        </div>
      </main>
    </>
  );
}

export default Home;
