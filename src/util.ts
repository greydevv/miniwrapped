import { randomBytes } from "crypto";

export const generateRandomState = (): string => randomBytes(8).toString('hex');
