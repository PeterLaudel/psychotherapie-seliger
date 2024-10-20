import CreatableSelect from "react-select/creatable";
import { Patient as PatientType } from "../../../models/patient";
import { Field } from "react-final-form";

interface Props {
  patients: PatientType[];
}

export default function Patient({ patients }: Props) {
  const options = patients.map((patient) => ({
    label: `${patient.name} ${patient.surname}`,
    value: patient.id,
    ...patient,
  }));

  return (
    <Field<PatientType> name="patient" type="select">
      {({ input }) => (
        <div>
          <label>Patient</label>
          <CreatableSelect<PatientType>
            instanceId={input.name}
            {...input}
            options={options}
            isClearable={true}
            isValidNewOption={() => false}
          />
        </div>
      )}
    </Field>
  );
}
