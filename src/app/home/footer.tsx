import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <Link href="/home/impressum">Impressum</Link>
      <Link href="/home/datenschutz">Datenschutz</Link>
    </footer>
  );
}
