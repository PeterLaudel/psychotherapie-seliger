"use server";

import { Therapeut } from "@/models/therapeut";
import { getTherapeutsRepository } from "@/server";

type SaveTherapeutResult = { success: boolean; message?: string };

export async function saveTherapeut(_: null | SaveTherapeutResult, formData: FormData) {
  //ugly casting here need to check it again
  const object = Object.fromEntries(formData.entries()) as unknown as Therapeut;
  const therapeutRepository = await getTherapeutsRepository();
  await therapeutRepository.save(object);
  return { success: true, message: "Therapeut gespeichert!" };
}
