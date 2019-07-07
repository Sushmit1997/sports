import * as jwt from '../utils/jwt';

import { en } from '../lang/en';

import { getUserFromRefreshToken } from './user';
import { AccessTokenData } from '../domains/token';
import UserAccountTokens from '../models/UserAccountTokens';

/**
 * Generates access token and refresh token.
 * Insert refresh token into the database.
 *
 * @param {Object} data
 * @returns {Object}
 */
export async function generateAccessAndRefreshTokens(data: AccessTokenData) {
  const refreshTokenData = { ...data, isRefreshToken: true };
  const accessTokenData = { ...data };

  const accessToken = jwt.createToken(accessTokenData);
  const refreshToken = jwt.createRefreshToken(refreshTokenData);

  await new UserAccountTokens({
    user_account_id: data.user.id,
    refresh_token: refreshToken,
    created_at: new Date(Date.now())
  }).save();

  // save to db
  return {
    accessToken,
    refreshToken,
    data
  };
}

/**
 * Generate access token.
 *
 * @param {Object} data.
 * @returns {String}
 */
export function generateAccessToken(data: AccessTokenData) {
  const accessToken = jwt.createToken(data);

  return accessToken;
}

/**
 * Returns new access token.
 *
 * @param  {Object}  req
 * @returns {Promise}
 */
export async function getNewAccessToken(refreshToken: string): Promise<any> {
  const user = await getUserFromRefreshToken(refreshToken);

  const accessToken = generateAccessToken({ user });

  return new Promise(resolve => {
    resolve({ accessToken, message: en.TOKENIZATION_SUCCESSFUL });
  });
}
