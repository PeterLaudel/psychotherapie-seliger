import { getServicesRepository } from "@/server";
import ServiceForm from "./serviceForm";

interface Props {
  params: Promise<{ serviceId: number }>;
}

export default async function Page(props: Props) {
  const { serviceId } = await props.params;

  const serviceRepository = await getServicesRepository();
  const service = await serviceRepository.find(serviceId);

  return <ServiceForm service={service} />;
}
