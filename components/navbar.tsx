import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <div>
      <div className="grid grid-cols-[repeat(4,auto)_4fr] justify-start items-center gap-8 max-md:hidden px-10 py-3">
        <Image
          src="/psychotherapie-seliger/logo3.svg"
          alt=""
          width="0"
          height="0"
          sizes="100%"
          className="w-auto h-12"
        />
        <Link href="/#about_me">Über mich</Link>
        <Link href="/#praxis">Praxis</Link>
        <Link href="/#kosten">Kosten</Link>
        <Link className="justify-self-end" href="/book">
          Termin buchen
        </Link>
      </div>
      <div className="grid grid-flow-col md:hidden py-3 px-5 items-center">
        <Image
          src="/psychotherapie-seliger/logo3.svg"
          alt=""
          width="0"
          height="0"
          sizes="100%"
          className="w-auto h-12"
        />
        <div className="justify-self-end">
          <input
            id="check01"
            type="checkbox"
            name="menu"
            className="peer hidden"
          />
          <label htmlFor="check01">
            <Image
              src="/psychotherapie-seliger/menu.svg"
              alt=""
              width="0"
              height="0"
              sizes="100%"
              className="w-auto h-8"
            />
          </label>
          <div className="hidden peer-checked:block relative"> HUHU</div>
        </div>
      </div>
    </div>
  );
}
