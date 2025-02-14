import { OAuth2Client } from "google-auth-library";
import { getToken } from "./getToken";

export const getAuthClient = async () => {
  const token = await getToken();
  const oAuthClient = new OAuth2Client();
  oAuthClient.setCredentials({
    access_token: token,
  });
  return oAuthClient;
};
