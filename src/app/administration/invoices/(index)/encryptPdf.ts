import { execFile } from "child_process";
import { writeFile, readFile, unlink } from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";
import { qpdfPath } from "@/environment";

export async function encryptPdfBase64(
  base64Pdf: string,
  userPw: string,
  ownerPw: string
): Promise<string> {
  if(userPw.length === 0) return base64Pdf;

  const id = crypto.randomUUID();
  const tmpDir = os.tmpdir();

  const input = path.join(tmpDir, `${id}-input.pdf`);
  const output = path.join(tmpDir, `${id}-output.pdf`);

  await writeFile(input, Buffer.from(base64Pdf, "base64"));
  const qpath = qpdfPath();

  await new Promise<void>((resolve, reject) => {
    const p = execFile(qpath, [
      "--encrypt",
      userPw,
      ownerPw,
      "256",
      "--",
      input,
      output,
    ]);

    let stderr = "";
    p.stderr?.on("data", (d) => (stderr += d));

    p.on("close", (code) => {
      code === 0 ? resolve() : reject(new Error(`qpdf failed: ${stderr}`));
    });
  });

  const encrypted = await readFile(output);

  await Promise.all([
    unlink(input).catch(() => {}),
    unlink(output).catch(() => {}),
  ]);

  return encrypted.toString("base64");
}
