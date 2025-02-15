import { getServerSession } from "next-auth";
import { getUser } from "./getUser";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("getUser", () => {
  it("should return the user if session is found", async () => {
    const mockSession = { user: { name: "mockUser", email: "some@email.de" } };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const user = await getUser();
    expect(user).toBe(mockSession.user);
  });

  it("should throw an error if no session is found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    await expect(getUser()).rejects.toThrow("No session found");
  });
});
