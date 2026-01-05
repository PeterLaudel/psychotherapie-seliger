import * as dotenv from "dotenv";

dotenv.config({ path: [`.env.${process.env.NODE_ENV}`], quiet: true });

export function sqliteUrl(): string {
  return process.env.SQLITE_URL || "";
}

export function environment(): string {
  return process.env.NODE_ENV || "";
}

export function isProduction(): boolean {
  return environment() === "production";
}

export function isDevelopment(): boolean {
  return environment() === "development";
}

export function qpdfPath(): string {
  return process.env.QPDF_PATH || "qpdf";
}

export function pdfOwnerPassword(): string {
  return process.env.PDF_OWNER_PASSWORD || ''
}
