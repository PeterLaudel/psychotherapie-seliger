"use server";

import { Therapeut } from "@/models/therapeut";

export async function saveTherapeut(data: Therapeut | null, formData: FormData) {
    console.log("formData", formData.get("name"));
    return Promise.resolve(data);
}