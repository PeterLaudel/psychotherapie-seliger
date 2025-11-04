"use server";

import { getServicesRepository } from "@/server";
import { revalidatePath } from "next/cache";

type SaveServiceResult = { success: boolean; message?: string };

interface FormDataType {
  id: number;
  description: string;
}

export default async function saveService(
  _: SaveServiceResult | null,
  formData: FormData
) {
  //ugly casting here need to check it again
  const object = Object.fromEntries(
    formData.entries()
  ) as unknown as FormDataType;

  const servicesRepository = await getServicesRepository();
  const service = await servicesRepository.find(object.id);

  await servicesRepository.save({
    ...service,
    description: object.description,
  });

  revalidatePath("/administration/services");

  return { success: true, message: "Service saved" };
}
