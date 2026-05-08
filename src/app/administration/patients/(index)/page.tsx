import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPatientsRepository } from "@/server";
import { patientsQueryKey } from "@/queries/patients";
import PatientsList from "./patientsList";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: patientsQueryKey(),
    queryFn: async () => {
      const search = (await searchParams).search || "";
      const repo = await getPatientsRepository();
      return repo.findBySearchTerm(search);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientsList />
    </HydrationBoundary>
  );
}
