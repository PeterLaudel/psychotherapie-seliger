import {
  Field,
  FieldProps,
  FieldRenderProps,
  useField,
  useForm,
} from "react-final-form";
import { useEffect } from "react";

type SunychronizedFieldProps<
  FieldValue,
  RP extends FieldRenderProps<FieldValue, T, InputValue>,
  T extends HTMLElement = HTMLElement,
  InputValue = FieldValue
> = {
  originFieldName: string;
  synchronize: boolean;
} & FieldProps<FieldValue, RP, T, InputValue>;

export default function SynchronizedField<
  FieldValue,
  T extends HTMLElement = HTMLElement,
  InputValue = FieldValue,
  RP extends FieldRenderProps<FieldValue, T, InputValue> = FieldRenderProps<
    FieldValue,
    T,
    InputValue
  >
>({
  originFieldName,
  synchronize,
  children,
  name,
  ...rest
}: SunychronizedFieldProps<FieldValue, RP, T, InputValue>) {
  const {
    input: { value: originFieldValue },
  } = useField<T>(originFieldName, { subscription: { value: true } });
  const { resetFieldState, change } = useForm();

  useEffect(() => {
    if (synchronize) {
      change(name, originFieldValue);
      resetFieldState(name);
    }
  }, [originFieldValue, synchronize, change, name, resetFieldState]);

  useEffect(() => {
    if (!synchronize) {
      change(name, "");
    }
  }, [synchronize, change, name]);

  //check if children is a function
  if (typeof children === "function")
    return (
      <Field<FieldValue, T, InputValue, RP> name={name} {...rest}>
        {(values) => children(values)}
      </Field>
    );

  return (
    <Field<FieldValue, T, InputValue, RP> name={name} {...rest}>
      {children}
    </Field>
  );
}
