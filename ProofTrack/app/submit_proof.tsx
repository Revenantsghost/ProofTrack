import React from 'react';
import { Alert } from 'react-native';
import ListOfProjects from './components/list_of_projects';
import { router, useLocalSearchParams, Redirect } from 'expo-router';

/** 
 * Renders an individual item row in the list.
 * 
 * @returns {JSX.Element} A list of pressable item row components.
 * Pressing a component will prompt the user to submit proof for its corresponding project.
 */
export default function SubmitProof() {
  const { username } = useLocalSearchParams();
  if (typeof(username) !== 'string') {
    Alert.alert('Internal error encountered.', 'Unable to parse your information.');
    /* The user's username couldn't be parsed properly.
     * This means something's wrong with useLocalSearchParams.
     * This is not expected to happen, but signal an error by logging the user out. */
    return <Redirect href='../login' />
  }

  /** 
   * Renders an individual item row in the list.
   * 
   * @param projID A project's unique ID "number".
   * Takes the user to the "Submit Proof" page corresponding to the projID.
   */
  const goToProofSubmission = (projID: string) => {
    console.log(`Going to submit proof for project number: ${projID}`);
    router.navigate(`./media_options?username=${username}&projID=${projID}`);
  }

  return (
    <ListOfProjects 
      username={username}
      handleProjectPress={(projID: string) => {goToProofSubmission(projID)}}
    />
  );
}