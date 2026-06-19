import { getSessionsRepository } from "@/server";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export const GET = async (_req: NextRequest, props: Props) => {
  const { id } = await props.params;
  const sessionsRepository = await getSessionsRepository();
  const session = await sessionsRepository.find(Number(id));
  return NextResponse.json(session);
};

