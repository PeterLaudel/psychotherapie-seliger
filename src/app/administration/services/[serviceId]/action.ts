"use server";

import { getServicesRepository } from "@/server";

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

  await servicesRepository.save({ ...service, description: object.description });

  return { success: true, message: "Service saved" };
}
