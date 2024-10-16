import { getServerSession } from "next-auth";
import { auth, sheets_v4 } from "@googleapis/sheets";
import { authOptions } from "../../api/auth/[...nextauth]/config";
export default async function Sheets() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const oauth2Client = new auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: session?.accessToken,
  });

  const sheetsClient = new sheets_v4.Sheets({
    auth: oauth2Client,
  });

  const re = await sheetsClient.spreadsheets.get({
    spreadsheetId: "1mJD8qEOMXNDKRmF1mNoaA68xcmFY1J7JbufKOA2-aOU",
  });

  return (
    <div>
      {re.data.sheets?.map((sheet) => {
        return (
          <div key={sheet.properties?.sheetId}>{sheet.properties?.title}</div>
        );
      })}
    </div>
  );
}
