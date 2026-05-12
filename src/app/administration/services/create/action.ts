"use server";

import { ServiceSave } from "@/repositories/servicesRepository";
import { getServicesRepository } from "@/server";
import { revalidatePath } from "next/cache";

export async function createService(data: ServiceSave): Promise<void> {
  const repo = await getServicesRepository();
  await repo.save(data);
  revalidatePath("/administration/services");
}
