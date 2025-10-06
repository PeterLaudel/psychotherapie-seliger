import { TherapeutRepository } from "@/repositories/therapeutRepository";
import { getTherapeutsRepository } from "@/server";
import { TherapeutsForm } from "./therapeutsForm";

export default async function Page() {
    const therapeutRepository = await getTherapeutsRepository();
    const therapeuts = await therapeutRepository.all();

    if (therapeuts.length === 0) {
        return <TherapeutsForm />
    }

    return <TherapeutsForm therapeut={therapeuts[0]} />
}