# ProofTrack

UW CSE403 Project

Current Operational User Cases:
Current Users updating and submitting to their project.

Summary
- The goal of this app is to provide a productivity platform that requires users to capture pictures and/or videos of their practice sessions to hold themselves accountable.
- This would prevent users from forming new habits without following through with them.
- The notifications and reminders to practice often would motivate users to keep up with their goals, as well as allowing them to revisit their progress over time.

Abstract
- “Practice is everything” – Periander
- We all know that consistent practice is the cornerstone of developing any new skill. Setting aside regular times to practice is crucial for growth—but let’s face it, just adding a reminder to your calendar or setting a recurring alarm often falls flat. Without a coach or instructor, it’s far too easy to dismiss those alerts and move on.
- But what if there was an app that not only reminded you to practice, but actually held you accountable? Imagine an app that requires you to capture a photo, video, or audio recording of your practice session before you can dismiss the day’s reminder. This is more than just an alarm clock; it's a personal accountability partner that keeps you on track and motivated.
- In addition, this app lets you visually track your progress over time. Not only can you see a calendar showing which days you completed your practice, but you can also revisit each day’s effort to see just how far you’ve come. It’s like having a timeline of your growth—transforming your practice sessions from routine to rewarding.

Goal
- The goal of this app is to provide a productivity platform that requires users to capture pictures and/or videos of their practice sessions to hold themselves accountable. This would prevent users from forming new habits without following through with them. The notifications and reminders to practice often would motivate users to keep up with their goals, as well as allowing them to revisit their progress over time.

Current Practice
- This app is similar to Alarmy, an alarm clock which requires the user to prove they are awake by completing “missions” before the alarm can be dismissed.
- There are also a number of apps which use monetary commitments or community review to ensure that the user is meeting goals. This is similar to traditional coaching, which is a proven way to learn, but which has associated costs and the downside of creating a feeling of pressure which might discourage users.


Novelty
- The twist for ProofTrack is how it requires the user to provide proof of practice. By capturing a post-workout selfie, a recording of a song played on guitar, or a video of the user skateboarding, the user is pushed to document their progress beyond a boring check mark with tangible evidence of their work and growth.


Effects
- If successful, this software would help users to stick to a consistent routine while cultivating new talents. The ability to revisit their growth over the course of previous sessions would help them to celebrate their improvement over time.

// User Manual

High-Level Description:
- Our app acts as a project management tool. It displays and maintains a project by forcing its users to be consistent with their initial goals.
- It not only displays information but also takes information from a user to gain consistent submissions for their project.

How to install/run the software:

 0. Prerequisites

    Node.js: Ensure that Node.js is installed (recommend version 14.x or higher).

    Expo CLI: Install the Expo CLI globally if not already installed. Run:

    npm install -g expo-cli

    Expo Go app: For mobile testing, download Expo Go on an Android or iOS device.

 2. Clone the Repository: Start by cloning the project repository:
    
    git clone https://github.com/Revenantsghost/ProofTrack.git
  
    cd ProofTrack
  
    Install Dependencies: Install all project dependencies by running: npm install

Running the Project:

    Start the Expo Development Server: To start the Expo server, run: npx expo start

    This will open a new tab in your browser where you can scan a QR code with the Expo Go app on your mobile device.

    Open Expo Go, scan the QR code in the browser tab, and the app should launch on your device.

How to use the app:

Once a user opens up the app, they will see a login page, where one is able to make a new account or login to their existing account by inputting a username and password. After sucessfully logging in, a user will be taken to the homepage with the welcome screen. 

To create a new project, go to the New Project tab, where a user can fill out the fields to create a new project. Pressing the create button will make a new project. 

To view existing projects, go to the Projects tab, where users can see all of their projects, as well as any proof they submitted for a specific project. 

To look at a user's profile, go to the Profile tab, where a user is able to edit their username or password, and see some statistics like the number of projects, as well as being able to logout of their account and return to the Login page. 

The homepage also includes a blue button with a camera icon, which leads to the page where a user can submit proof. Select the project you would like to submit proof for. Then choose whether you would like to upload media from your library on your device, or take a photo/video in the app to use. After uploading your medi, it should be visible on the page, and a user can press the submit button to successfully submit proof of their progress on their project!


How to report a bug:
- Go to Issues within our main repository and copy our template.
- Within the template there will be simple directions to mention your bug.
- Please be as specific as possible and check if the issue you are bringing up has been listed before.

Known Bugs:
- Currently known bugs are listed in the Issues folder.







// Developer Documentation

The source code of the project is located in the github ProofTrack repository (link: https://github.com/Revenantsghost/ProofTrack).

The layout of our directory structure includes a .expo directory, .github/workflows directory, ProofTrack directory, back-end directory, reports directory, as well as our README.md file, package-lock.json file, and .env file. The .expo directory was created and added to our project repository since we are using the ExpoGo app to run the application. The .github/workflows directory provides functionality for having workflows in github. The ProofTrack directory contains our app folder, which has a layout file, the submit proof page file, a file defining the types that we use in our project, and the (tabs) directory for the tab pages of our app, like the home/index, new project page, profile page, project list page, and layout file. The ProofTrack folder also contains the default app-example, assets folder (for fonts and images), components folder (which includes defined components, app navigation, and frontend tests. The constants folder, hooks folder, and scripts folder also contain some files for frontend use.

The backend directory contains a tests directory which contains a current basic.test.js, a blobservice.js meant to hold blob storage variables, a mediainteraction.js that is meant to insert and extract from blob storage. It also has a server.js which sets up a Node.js backend with express, a index.js that sets up a basic express server, and a basic package.json that holds information about the backends dependencies and helps with setting up jest tests.
The reports directory contains weekly project reports to help plan and reflect on tasks as a team. The reports are named as YYYMMDD.md and contain two sections, one for the team report and one for contributions of team members.

Build Instructions for ProofTrack:

- Prerequisites
  1. Node.js: Ensure that Node.js is installed (recommend version 14.x or higher).
  2. Expo CLI: Install the Expo CLI globally if not already installed. Run:

    npm install -g expo-cli
  
  3. Expo Go app: For mobile testing, download Expo Go on an Android or iOS device.
- Setting Up the Project
  1. Clone the Repository: Start by cloning the project repository:
    git clone https://github.com/Revenantsghost/ProofTrack.git
    cd ProofTrack
  2. Install Dependencies: Install all project dependencies by running: npm install
- Running the Project
  1. Start the Expo Development Server: To start the Expo server, run: npx expo start
  2. This will open a new tab in your browser where you can scan a QR code with the Expo Go app on your mobile device.
- Testing on a Physical Device: Open Expo Go, scan the QR code in the browser tab, and the app should launch on your device.


To run the system’s test cases, first go into either the ProofTrack (to test frontend, "cd ProofTrack") or back-end folder (to test back-end, "cd back-end"). If you have not installed the necessary dependencies yet, run "npm install" in the folder. Then run the command: “npm run test” in the terminal. Another way to test is by debugging directly in the package.json file in VSCode. Frontend testing also includes testing the functionality of components in the ExpoGo app. To add tests, add another test file in the __tests__/ directory in the ProofTrack directory for frontend tests and add a file in the tests directory for backend tests. (Note: some backend tests may not work since they rely on the .env file to access the Azure database, which have been removed for security purposes.)


Both frontend and backend utilize jest for testing. Test file naming conventions as of right now, we have one test suite for all components. This includes very basic naming conventions.


In the release of our software, a developer will focus on the simulation through expo go as a reference to some sanity checks. Before build, checking node.js version number within app.json could be a sanity check. More importantly, a focus that all dependencies are installed and properly running would also be a good step. During the build of our app with expo go, a developer should simulate and check that the app is properly running in which they will be testing their build. After build, and thorough sanity checks,  a developer may focus on expanding to android and ios users and further on.
