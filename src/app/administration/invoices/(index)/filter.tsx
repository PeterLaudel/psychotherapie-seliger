"use client";

import { HourglassEmpty, Send, CheckCircle } from "@mui/icons-material";
import { Autocomplete, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Invoice } from "@/models/invoice";

type InvoiceStatus = Invoice["status"];

const statusOptions: { value: InvoiceStatus; label: string; icon: React.ReactNode }[] = [
  { value: "pending", label: "Offen", icon: <HourglassEmpty className="text-amber-400" fontSize="small" /> },
  { value: "sent", label: "Gesendet", icon: <Send className="text-blue-400" fontSize="small" /> },
  { value: "paid", label: "Bezahlt", icon: <CheckCircle className="text-green-400" fontSize="small" /> },
];

interface FilterParams {
  search?: string;
  status?: InvoiceStatus;
}

export function Filter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filter, setFilter] = useState<FilterParams>({
    search: searchParams.get("search") || undefined,
    status: (searchParams.get("status") as InvoiceStatus) || undefined,
  });

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (filter.search) newSearchParams.set("search", filter.search);
    if (filter.status) newSearchParams.set("status", filter.status);
    replace(`${pathname}?${newSearchParams.toString()}`);
  }, [filter, pathname, replace]);

  const selectedOption = statusOptions.find((o) => o.value === filter.status) ?? null;

  return (
    <div className="flex items-center gap-4">
      <TextField
        value={searchParams.get("search") || ""}
        onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
        label="Suche"
        size="small"
      />
      <Autocomplete
        value={selectedOption}
        onChange={(_, option) =>
          setFilter((prev) => ({ ...prev, status: option?.value ?? undefined }))
        }
        options={statusOptions}
        getOptionLabel={(o) => o.label}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            <span className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </span>
          </li>
        )}
        renderInput={(params) => <TextField {...params} label="Status" size="small" />}
        sx={{ minWidth: 150 }}
      />
    </div>
  );
}
