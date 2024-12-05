import { drive_v3 } from "@googleapis/drive";
import { Readable } from "stream";

interface Invoice {
  id: string;
  number: string;
  base64: string;
}

export class InvoicesRepository {
  private _folderId: string | null = null;

  constructor(private drive: drive_v3.Drive) {}

  public async generateInvoiceNumber(): Promise<string> {
    const folderId = await this.folderId();
    const response = await this.drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id)",
    });
    const files = response.data.files || [];
    const currentDate = new Date();
    return `${currentDate.toISOString().slice(0, 10).replace(/-/g, "")}${
      files?.length + 1
    }`;
  }

  public async create({
    base64,
    number,
  }: Pick<Invoice, "base64" | "number">): Promise<Invoice> {
    const stream = new Readable();
    stream.push(Buffer.from(base64, "base64"));
    stream.push(null); // Indicate the end of the stream
    const {
      data: { id },
    } = await this.drive.files.create({
      requestBody: {
        name: number,
        mimeType: "application/pdf",
        parents: [await this.folderId()],
      },
      media: {
        mimeType: "application/pdf",
        body: stream,
      },
    });

    if (!id) throw new Error("No id found");

    return { id, number, base64 };
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
    return { id, number: name!, base64 };
  }

  private async folderId(): Promise<string> {
    if (!this._folderId)
      this._folderId = await getFolderIdFromName(this.drive, "Rechnungen");

    return this._folderId;
  }
}

async function getFolderIdFromName(
  drive: drive_v3.Drive,
  folderName: string
): Promise<string> {
  const response = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id, name)",
  });

  const folders = response.data.files;
  if (folders && folders.length > 0 && folders[0].id) return folders[0].id;

  const {
    data: { id },
  } = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    },
  });
  if (!id) throw new Error("Invoice folder not created");
  return id;
}
