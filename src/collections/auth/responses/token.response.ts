import {User} from "../../users/schemas/user.schema";

export interface TokenResponse {
  user: User | null,
  accessToken: string,
  role?: string,
  expiresIn: string
}
