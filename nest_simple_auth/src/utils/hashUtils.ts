import { sha256 } from 'js-sha256';

export function passwordHash(password: string) {
  return sha256.hmac("This is password", password);
}
