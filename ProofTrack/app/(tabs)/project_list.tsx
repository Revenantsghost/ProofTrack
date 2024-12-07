import React, { useContext } from 'react';
import ListOfProjects from '../components/list_of_projects';
import { UserContext } from './_layout';
import { router } from 'expo-router';

export default function ProjectList() {
  /* Use hook to get username. */
  const username: string = useContext(UserContext);

  const goToEditProject = (projID: number) => {
    console.log(`Going to edit project number: ${projID}`);
    router.navigate(`../edit_project?userID=${username}&projID=${projID}`);
  }

  return (
    <ListOfProjects 
      username={username}
      handleProjectPress={(projID: number) => {goToEditProject(projID)}}
    />
  );
}