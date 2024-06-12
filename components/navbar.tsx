import Link from "next/link";

export default function Navbar() {
  return (
    <div className="p-4 sticky top-0 bg-white">
      <div className="grid grid-cols-[repeat(3,auto)_4fr] justify-start gap-8 max-md:hidden">
        <Link href="/#about_me">Über mich</Link>
        <Link href="/#praxis">Praxis</Link>
        <Link href="/#kosten">Kosten</Link>
        <Link className="justify-self-end" href="/book">
          Termin buchen
        </Link>
      </div>
      <div className="grid grid-flow-col md:hidden">
        <div>Test1</div>
        <div className="justify-self-end">
          <input
            id="check01"
            type="checkbox"
            name="menu"
            className="peer hidden"
          />
          <label htmlFor="check01">sMenu</label>
          <ul className="hidden peer-checked:block">
            <li>HUHU</li>
            <li>HAHA</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
