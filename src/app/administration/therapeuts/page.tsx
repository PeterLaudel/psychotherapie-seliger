import { getTherapeutsRepository } from "@/server";
import { TherapeutForm } from "./therapeutForm";

export default async function Page() {
    const therapeutRepository = await getTherapeutsRepository();
    const therapeuts = await therapeutRepository.all();

    return <TherapeutForm therapeut={therapeuts[0]} />
}