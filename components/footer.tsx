import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <Link href="/impressum">Impressum</Link>
      <Link href="/datenschutz">Datenschutz</Link>
    </footer>
  );
}
