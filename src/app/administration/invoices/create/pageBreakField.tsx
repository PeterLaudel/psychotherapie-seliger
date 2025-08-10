import { Add, Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useField } from "react-final-form";

interface Props {
  name: string;
}

export function PageBreakField({ name }: Props) {
  const {
    input: { value: isPageBreak, onChange },
  } = useField<boolean>(`${name}.pageBreak`, {
    subscription: { value: true },
  });

  if (isPageBreak)
    return (
      <div className="grid grid-cols-[1fr_auto_1fr]">
        <div className="border border-gray-300 self-center min-w-full" />
        <Tooltip title="Seitenumbruch entfernen" placement="right">
          <IconButton onClick={() => onChange(!isPageBreak)}>
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
        <div className="border border-gray-300 self-center min-w-full" />
      </div>
    );

  return (
    <div className="flex justify-center">
      <Tooltip title="Seitenumbruch hinzufügen" placement="right">
        <IconButton onClick={() => onChange(!isPageBreak)}>
          <Add fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
