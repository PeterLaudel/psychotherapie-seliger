"use client";

import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import Section from "@/components/section";
import {
  Session,
  SESSION_TYPES,
  SESSION_PHASES,
  RISK_LEVELS,
  INTERVENTIONS,
  RiskLevel,
} from "@/models/session";
import { SessionFormValues } from "./sessionFormShell";

interface Props {
  session: Session;
  saveStatus: "idle" | "saving" | "saved";
  onFinalize: () => void;
}

const riskButtonColors: Record<RiskLevel, string> = {
  none: "bg-gray-100",
  low: "bg-yellow-100",
  moderate: "bg-orange-100",
  high: "bg-red-100",
};

const saveStatusLabel: Record<"idle" | "saving" | "saved", string> = {
  idle: "",
  saving: "Wird gespeichert…",
  saved: "Entwurf gespeichert",
};

export default function SessionForm({ session, saveStatus, onFinalize }: Props) {
  const { control, register, watch } = useFormContext<SessionFormValues>();
  const [riskLevel, sessionDate, sessionType, phase] = watch([
    "riskLevel",
    "sessionDate",
    "sessionType",
    "phase",
  ]);

  const isFinalizeable =
    session.status !== "final" && !!sessionDate && !!riskLevel && !!sessionType;

  return (
    <div className="grid gap-4">
      {riskLevel === "high" && (
        <div className="bg-red-500 text-white px-4 py-3 rounded font-semibold">
          Hohe Risikoeinstufung — bitte sofortige Maßnahmen prüfen.
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{saveStatusLabel[saveStatus]}</span>
        <Button variant="contained" disabled={!isFinalizeable} onClick={onFinalize}>
          Abschließen
        </Button>
      </div>

      {/* Controller required: custom button group, not a native input */}
      <Section>
        <h2 className="mb-4">Risikoeinschätzung</h2>
        <Controller
          name="riskLevel"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2 flex-wrap">
              {RISK_LEVELS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.onChange(value)}
                  className={`px-4 py-2 rounded border-2 font-medium transition-all ${
                    riskButtonColors[value]
                  } ${
                    field.value === value
                      ? "border-blue-600 ring-2 ring-blue-300"
                      : "border-transparent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        />
      </Section>

      <Section>
        <h2 className="mb-4">Basis</h2>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Patient"
            value={`${session.patient.name} ${session.patient.surname}`}
            disabled
            className="col-span-2"
          />

          <TextField
            {...register("sessionDate")}
            label="Datum"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="Sitzungsnummer"
            type="number"
            value={session.sessionNumber}
            disabled
          />

          <TextField
            {...register("durationMinutes", { valueAsNumber: true })}
            label="Dauer (Minuten)"
            type="number"
          />

          <FormControl>
            <InputLabel>Sitzungstyp</InputLabel>
            <Select
              {...register("sessionType")}
              value={sessionType ?? ""}
              label="Sitzungstyp"
            >
              {SESSION_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>Phase</InputLabel>
            <Select {...register("phase")} value={phase ?? ""} label="Phase">
              <MenuItem value="">—</MenuItem>
              {SESSION_PHASES.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Section>

      {/* Controller required: MUI Slider has no native input */}
      <Section>
        <h2 className="mb-4">Stimmung</h2>
        <div className="grid grid-cols-2 gap-8">
          <Controller
            name="moodStart"
            control={control}
            render={({ field }) => (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Zu Beginn: {field.value ?? "—"}
                </p>
                <Slider
                  value={field.value ?? 5}
                  min={1}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  onChange={(_e, v) => field.onChange(v)}
                />
              </div>
            )}
          />
          <Controller
            name="moodEnd"
            control={control}
            render={({ field }) => (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Am Ende: {field.value ?? "—"}
                </p>
                <Slider
                  value={field.value ?? 5}
                  min={1}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  onChange={(_e, v) => field.onChange(v)}
                />
              </div>
            )}
          />
        </div>
      </Section>

      {/* Controller required: chip toggle is not a native input */}
      <Section>
        <h2 className="mb-4">Interventionen</h2>
        <Controller
          name="interventions"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2 flex-wrap mb-3">
              {INTERVENTIONS.map((intervention) => {
                const selected = field.value.includes(intervention);
                return (
                  <Chip
                    key={intervention}
                    label={intervention}
                    clickable
                    color={selected ? "primary" : "default"}
                    variant={selected ? "filled" : "outlined"}
                    onClick={() => {
                      const next = selected
                        ? field.value.filter((i: string) => i !== intervention)
                        : [...field.value, intervention];
                      field.onChange(next);
                    }}
                  />
                );
              })}
            </div>
          )}
        />
      </Section>

      <Section>
        <h2 className="mb-4">Klinische Notizen 🔒</h2>
        <TextField
          {...register("clinicalNotes")}
          label="Notizen (verschlüsselt)"
          multiline
          minRows={6}
          fullWidth
        />
      </Section>

      <Section>
        <h2 className="mb-4">Planung</h2>
        <TextField
          {...register("nextSessionPlan")}
          label="Nächste Sitzung — Planung"
          multiline
          minRows={3}
          fullWidth
        />
      </Section>
    </div>
  );
}
