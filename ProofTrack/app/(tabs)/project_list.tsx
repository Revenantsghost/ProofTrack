import React, { useContext } from 'react';
import ListOfProjects from '../components/list_of_projects';
import { UserContext } from './_layout';
import { router } from 'expo-router';

/** 
 * Renders an individual item row in the list.
 * 
 * @returns {JSX.Element} A list of pressable item row components.
 * Pressing a component will allow the user to view its corresponding project.
 */
export default function ProjectList() {
  /* Use hook to get username. */
  const username: string = useContext(UserContext);

  /** 
   * Renders an individual item row in the list.
   * 
   * @param projID A project's unique ID "number".
   * Takes the user to the "View/Edit Project" page corresponding to the projID.
   */
  const goToEditProject = (projID: string) => {
    console.log(`Going to edit project number: ${projID}`);
    router.navigate(`../edit_project?userID=${username}&projID=${projID}`);
  }

  return (
    <ListOfProjects 
      username={username}
      handleProjectPress={(projID: string) => {goToEditProject(projID)}}
    />
  );
}