import { useField } from "react-final-form";

export default function InvalidSubscription({
  name,
  children,
}: {
  name: string;
  children: (_unused: boolean) => JSX.Element;
}) {
  const {
    meta: { invalid },
  } = useField(name, { subscription: { invalid: true } });
  return children(!!invalid);
}
