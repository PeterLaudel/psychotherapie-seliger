import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-odd-background text-odd-text">
      <div className="grid [grid-template-areas:'logo_button_menu''items_items_items'] md:[grid-template-areas:'logo_items_button'] items-center justify-between mx-auto px-2 py-2 md:px-8 md:py-4">
        <Link href="/" className="[grid-area:logo]">
          <Image
            src="/psychotherapie-seliger/logo.svg"
            alt="Logo von Psychotherapie Seliger"
            width="0"
            height="0"
            sizes="100%"
            className="w-auto h-10 md:h-12"
          />
        </Link>
        <Link href="#kontakt_formular" className="[grid-area:button]">
          <input
            type="button"
            value="Termin anfragen"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
          />
        </Link>
        <div className="peer [grid-area:menu] md:hidden">
          <input id="check01" type="checkbox" name="menu" className="hidden" />
          <label htmlFor="check01">
            <Image
              src="/psychotherapie-seliger/menu.svg"
              alt="Menü für mobile Geräte"
              width="0"
              height="0"
              sizes="100%"
              className="w-auto h-8"
            />
          </label>
        </div>
        <div className="[grid-area:items] justify-self-start hidden peer-has-[:checked]:block w-full md:block md:w-auto">
          <ul className="flex flex-col md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0">
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
