import { useField } from "react-final-form";

export default function ValueSubscription<T>({
  name,
  children,
}: {
  name: string;
  children: (value: T) => JSX.Element;
}) {
  const {
    input: { value },
  } = useField<T>(name, { subscription: { value: true } });
  return children(value);
}
