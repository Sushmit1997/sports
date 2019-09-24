const SESSION_KEY = 'userSession';

interface Session {
  accessToken: string;
  refreshToken: string;
}

/**
 * Set user session to the storage.
 *
 * @export
 * @param {object} userSession
 */
export function setUserSession(userSession: object) {
  if (userSession) {
    const session = JSON.stringify(userSession);

    localStorage.setItem(SESSION_KEY, session);
  }
}

/**
 * Get user session from the storage.
 *
 * @export
 * @returns {(Session | null)}
 */
export function getUserSession(): Session | null {
  const session = localStorage.getItem(SESSION_KEY);

  if (!session) {
    return null;
  }

  const userSession = JSON.parse(session);

  return userSession;
}

/**
 * Log out the current session.
 *
 * @export
 */
export function clearUserSession() {
  localStorage.removeItem(SESSION_KEY);
}
