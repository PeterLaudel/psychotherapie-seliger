import { getServerSession } from "next-auth";
import { getToken } from "./getToken";

// Mock the next-auth module
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("getToken", () => {
  it("should return the access token if session is found", async () => {
    const mockSession = { accessToken: "mockToken123" };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const token = await getToken();

    expect(token).toBe("mockToken123");
  });

  it("should throw an error if no session is found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    await expect(getToken()).rejects.toThrow("No session found");
  });
});
