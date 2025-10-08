import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-odd-background text-odd-text">
      <div className="grid [grid-template-areas:'logo_button_menu''items_items_items'] lg:[grid-template-areas:'logo_items_button'] items-center justify-between mx-auto px-2 py-2 lg:px-8 lg:py-4">
        <Link href="/home" className="[grid-area:logo]">
          <Image
            src="/logo.svg"
            alt="Logo von Psychotherapie Seliger"
            width="0"
            height="0"
            sizes="100%"
            className="w-auto h-10 lg:h-12"
          />
        </Link>
        <Link href="#kontakt_formular" className="[grid-area:button]">
          <input
            type="button"
            value="Termin anfragen"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
          />
        </Link>
        <div className="peer [grid-area:menu] lg:hidden">
          <input id="check01" type="checkbox" name="menu" className="hidden" />
          <label htmlFor="check01">
            <Image
              src="/menu.svg"
              alt="Menü für mobile Geräte"
              width="0"
              height="0"
              sizes="100%"
              className="w-auto h-8"
            />
          </label>
        </div>
        <div className="[grid-area:items] justify-self-start hidden peer-has-checked:block w-full lg:block lg:w-auto">
          <ul className="flex flex-col lg:p-0 mt-4 lg:flex-row lg:space-x-8 lg:mt-0 lg:border-0">
            <li>
              <Link href="#about_me">Über mich</Link>
            </li>
            <li>
              <Link href="#therapie">Therapie</Link>
            </li>
            <li>
              <Link href="#behandlungsspektrum">Behandlungsspektrum</Link>
            </li>
            <li>
              <Link href="#kosten">Kosten</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
