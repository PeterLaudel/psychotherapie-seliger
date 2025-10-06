import { TherapeutRepository } from "@/repositories/therapeutRepository";


export function getTherapeutsRepository() {
    return Promise.resolve(new TherapeutRepository());
}