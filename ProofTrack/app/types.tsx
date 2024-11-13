/* Basic information on a user. */
export type User = {
  /* A user's username, such as "Kyle", "Anmol", or "Charles". */
  username: string,
  /* A user's UNIQUE ID number. */
  userID: number,
  /* The number of projects the user has started. */
  numProjects: number
}

/* Basic information on a project. */
export type Project = {
  /* The userID of the user who owns this project. */
  userID: number,
  /* A project's UNIQUE ID number. */
  projID: number
}