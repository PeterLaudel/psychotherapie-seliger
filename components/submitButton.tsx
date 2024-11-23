import { Button, CircularProgress } from "@mui/material";

interface Props {
  submitting: boolean;
  children: React.ReactNode;
}

export default function SubmitButton({
  submitting,
  children,
  ...rest
}: Props & React.ComponentProps<typeof Button>) {
  return (
    <Button type="submit" variant="contained" disabled={submitting} {...rest}>
      {submitting && <CircularProgress size={18} className="mr-2" />}
      {children}
    </Button>
  );
}
