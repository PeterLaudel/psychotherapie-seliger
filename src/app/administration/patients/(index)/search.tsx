"use client";

import { Input } from "@mui/material";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (query: string) => {
    replace(`${pathname}?search=${query}`);
  };

  return (
    <Input
      value={searchParams.get("search") || ""}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Suche"
    />
  );
}
