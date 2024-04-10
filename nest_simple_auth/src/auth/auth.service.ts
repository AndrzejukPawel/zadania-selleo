
import { HttpException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { passwordHash } from '../utils/hashUtils';

const bearerTokenExpirationSeconds = 15 * 60;

type TokenValidationOk = {
  readonly ok: true;
  error?: {
    reason: string,
    code: number;
  }
}

type TokenValidationError = {
  readonly ok: false;
  error: {
    reason: string,
    code: number;
  }
}

type TokenValidationresult = TokenValidationOk | TokenValidationError;

const invalidToken = {
  ok: false,
  error: {
    code: 401,
    reason: "Invalid authentication token"
  }
}

const tokenExpired = {
  ok: false,
  error: {
    code: 401,
    reason: "Authentication Token expired"
  }
}


@Injectable()
export class AuthService {
  constructor(private userService: UserService) { }

  async signIn(email: string, password: string) {
    const user = await this.userService.user({
      email,
      password: passwordHash(password)
    });

    if (!user) {
      throw new HttpException("Invalid credentials.", 401);
    }

    const token = jwt.sign({
      email,
      iat: Math.floor(Date.now() / 1000)
    }, 'secret', { expiresIn: bearerTokenExpirationSeconds });

    await this.userService.updateUser({
      data: { bearerToken: token },
      where: { email: user.email }
    })
    return { token };
  }


  async validateAuthenticationToken(token: string): Promise<TokenValidationresult> {
    const tokenString = jwt.decode(token) as { email: string, iat: number, exp: number };
    if (!tokenString) {
      return invalidToken;
    }

    let email: string;
    let exp: number;
    email = tokenString.email;
    exp = tokenString.exp;

    if (Math.floor(Date.now() / 1000) > exp) {
      return tokenExpired;
    }

    const user = await this.userService.user({
      email
    });

    if (!user || user.bearerToken != token) {
      return invalidToken;
    }

    return { ok: true };
  }
}
