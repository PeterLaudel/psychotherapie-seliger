import { getServicesRepository } from "@/server";
import ServiceList from "./servicesList";


export default async function Page() {
    const serviceRepository = await getServicesRepository();
    const services = await serviceRepository.all();

    return <ServiceList services={services} />;
}