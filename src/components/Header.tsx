import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white bg-opacity-0 transition hover:bg-opacity-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <Link href="/" className="flex items-center lg:flex-1">
          <div className="relative h-8 w-8">
            <Image src="/potion.png" alt="" fill />
          </div>
          <span className="ml-2 text-3xl font-bold">Potion</span>
        </Link>
        <h3 className="hidden sm:block">
          Your ingredients, numbers & formulas. Together.
        </h3>
      </nav>
    </header>
  );
}
