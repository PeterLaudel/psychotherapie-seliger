import { getPatientsRepository } from "@/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search") || "";

  const patientsRepository = await getPatientsRepository();
  const patients = await patientsRepository.filter({ search });

  return NextResponse.json(patients);
};
