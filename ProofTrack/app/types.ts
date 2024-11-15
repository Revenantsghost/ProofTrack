/* Basic information on a user. */
export type User = {
  /* A user's UNIQUE username, such as "Kyle", "Anmol", or "Charles". */
  username: string,
  /* The number of projects the user has started. */
  numProjects: number,
}

/* Basic information on a project. */
export type Project = {
  /* The username of the user who owns this project. */
  username: string,
  /* A project's UNIQUE ID number. */
  projID: number,
}