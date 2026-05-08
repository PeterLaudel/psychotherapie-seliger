import { getPatientsRepository } from "@/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const searchTerm = searchParams.get("search") || "";

  const patientsRepository = await getPatientsRepository();
  const patients = await patientsRepository.findBySearchTerm(searchTerm);

  return NextResponse.json(patients);
};
