import { drive_v3 } from "@googleapis/drive";
import { Readable } from "stream";

interface Invoice {
  id: string;
  name: string;
  base64: string;
}

export class InvoicesRepository {
  constructor(private drive: drive_v3.Drive) {}

  public async create({
    base64,
    name,
  }: Pick<Invoice, "base64" | "name">): Promise<Invoice> {
    const stream = new Readable();
    stream.push(Buffer.from(base64, "base64"));
    stream.push(null); // Indicate the end of the stream
    const {
      data: { id },
    } = await this.drive.files.create({
      requestBody: {
        name,
        mimeType: "application/pdf",
      },
      media: {
        mimeType: "application/pdf",
        body: stream,
      },
    });

    if (!id) throw new Error("No id found");

    return { id, name, base64 };
  }

  public async get(id: string): Promise<Invoice> {
    const {
      data: { name },
    } = await this.drive.files.get({
      fileId: id,
      fields: "name",
    });

    const { data } = await this.drive.files.get(
      {
        fileId: id,
        alt: "media",
      },
      {
        responseType: "arraybuffer",
      }
    );

    const buffer = Buffer.from(data as ArrayBuffer);
    const base64 = buffer.toString("base64");
    return { id, name: name!, base64 };
  }
}
