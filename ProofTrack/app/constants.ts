/* The IP of our server. */
export const SERVER_IP: string = '13.64.145.249'

/* The port our server runs on. */
export const SERVER_PORT: string = '3000'

/* Returns the link of the server as a string.
 * Format: 'http://XX.XX.XXX.XXX:PORT' */
export function getServer(): string {
    return `http://${SERVER_IP}:${SERVER_PORT}`;
}