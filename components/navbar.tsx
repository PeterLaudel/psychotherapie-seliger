import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-odd-background text-odd-text">
      <div className="flex flex-wrap items-center justify-between mx-auto px-2 py-2 md:px-8 md:py-4">
        <Link href="/">
          <Image
            src="/psychotherapie-seliger/logo.svg"
            alt=""
            width="0"
            height="0"
            sizes="100%"
            className="w-auto h-10 md:h-12"
          />
        </Link>
        <input
          id="check01"
          type="checkbox"
          name="menu"
          className="peer hidden"
        />
        <div className="flex md:flex-row-reverse gap-8 items-center">
          <label className="md:hidden" htmlFor="check01">
            <Image
              src="/psychotherapie-seliger/menu.svg"
              alt=""
              width="0"
              height="0"
              sizes="100%"
              className="w-auto h-8"
            />
          </label>
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50">
            Termin anfragen
          </button>

          <div className="hidden peer-checked:block w-full md:block md:w-auto">
            <ul className="flex flex-col md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0">
              <li>
                <Link href="/#about_me">Über mich</Link>
              </li>
              <li>
                <Link href="/#therapie">Therapie</Link>
              </li>
              <li>
                <Link href="/#behandlungsspektrum">Behandlungsspektrum</Link>
              </li>
              <li>
                <Link href="/#kosten">Kosten</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
