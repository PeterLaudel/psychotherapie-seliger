import { useField } from "react-final-form";
import type { JSX } from "react";

interface Props<T, S = T> {
  name: string;
  map?: (value: T) => S;
  children: (value: S | T) => JSX.Element;
}

export default function ValueSubscription<T, S = T>({
  name,
  map,
  children,
}: Props<T, S>) {
  const {
    input: { value },
  } = useField<T>(name, { subscription: { value: true } });

  if (map) {
    return children(map(value));
  }
  return children(value);
}
