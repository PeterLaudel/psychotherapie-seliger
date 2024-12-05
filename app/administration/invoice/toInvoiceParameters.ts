import { FormInvoice, Position } from "./invoiceForm";
import { Props as InvoiceParameters } from "./invoiceTemplate";

const toInvoiceAddress = (values: FormInvoice) => {
  if (!values.patient) return undefined;

  return {
    name: values.patient.name,
    surname: values.patient.surname,
    ...values.patient.address,
  };
};

function toPatient(values: FormInvoice) {
  if (!values.patient) return undefined;

  return {
    name: values.patient.name,
    surname: values.patient.surname,
    birthdate: values.patient.birthdate,
    diagnosis: values.diagnosis,
  };
}

function toPositions(values: FormInvoice) {
  return values.positions
    .filter(
      (position): position is Position =>
        position.service !== undefined &&
        position.number !== undefined &&
        position.date !== undefined &&
        position.factor !== undefined &&
        position.pageBreak !== undefined
    )
    .map((position) => ({
      date: position.date,
      number: position.number,
      factor: position.factor,
      amount:
        (position.service.amounts[position.factor] ?? 0) * position.number,
      pageBreak: position.pageBreak,
      originalGopNr: position.service.originalGopNr,
      description: position.service.description,
    }));
}

export function toInvoiceParameters(values: FormInvoice): InvoiceParameters {
  return {
    invoiceNumber: values.invoiceNumber,
    invoiceAddress: toInvoiceAddress(values),
    patient: toPatient(values),
    positions: toPositions(values),
  };
}
