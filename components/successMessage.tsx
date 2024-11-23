import { Alert, Snackbar } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function SuccessMessage({ children, open, onClose }: Props) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="success" variant="filled" onClose={onClose}>
        {children}
      </Alert>
    </Snackbar>
  );
}
