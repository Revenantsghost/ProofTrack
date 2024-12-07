/* Basic information on a user. */
export type User = {
  /* A user's UNIQUE username, such as "Kyle", "Anmol", or "Charles". */
  username: string,
  /* The number of projects the user has started. */
  numProjects: number,
}

/* Basic information on a project. */
export type Project = {
  /* The userID of the user who owns this project. */
  username: string,
  /* A project's UNIQUE ID number. */
  projID: number,
  /* A project's name, usually describing the purpose of the project */
  name: string,
  /* The frequency at which proof needs to submitted */
  notificationFrequency: string,
  /* Date until which the project lasts */
  duration: string,
  /* Images/proof associated with the project */
  images: string[],
}

export type ProjectInfo = {
  username: string,
  projID: number,
}