import { sign, verify } from "jsonwebtoken";
import { CLAIMS_NAMESPACE, RoleName } from "./constant";
import { Request } from "express";

export type TokenPayload = {
  id: string;
  roles: Array<RoleName>;
  iat?: number;
  [CLAIMS_NAMESPACE]: {
    "x-hasura-user-id": string;
    "x-hasura-default-role": RoleName;
    "x-hasura-allowed-roles": RoleName[];
  };
};

export function signToken(tokenPayload: TokenPayload): string {
  return sign(tokenPayload, process.env.JWT_SECRET as string);
}

export function getAuthedUser(token: string): TokenPayload | undefined;
export function getAuthedUser(req: Request): TokenPayload | undefined;
export function getAuthedUser(arg: string | Request): TokenPayload | undefined {
  let token = "";
  if (typeof arg === "string") {
    token = arg;
  } else if (typeof arg === "object") {
    token = arg?.headers.authorization as string;
  }
  if (token) {
    token = token.replace(/^Bearer /, "");
    const verifiedToken = verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    return verifiedToken;
  }
}
