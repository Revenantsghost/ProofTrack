/* Basic information on a user. */
export type User = {
  /* A user's username, such as "Kyle", "Anmol", or "Charles". */
  username: string,
  /* A user's UNIQUE ID number. */
  userID: number,
  /* The number of projects the user has started. */
  numProjects: number
}