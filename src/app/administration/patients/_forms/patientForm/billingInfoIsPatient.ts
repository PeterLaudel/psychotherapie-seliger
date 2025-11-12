import { Patient } from "@/models/patient";

export function billingInfoIsPatient(patient: Patient) {
  return (
    patient.address.street === patient.billingInfo.address.street &&
    patient.address.city === patient.billingInfo.address.city &&
    patient.address.zip === patient.billingInfo.address.zip &&
    patient.email === patient.billingInfo.email
  );
}
