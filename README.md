# **ProofTrack**

### UW CSE403 Project

---

## **Current Operational User Cases**
- **Current Users** updating and submitting to their project.

---

## **Summary**

- The goal of this app is to provide a productivity platform that requires users to capture pictures and/or videos of their practice sessions to hold themselves accountable.
- This would prevent users from forming new habits without following through with them.

---

## **Abstract**

> “Practice is everything” – Periander

- We all know that consistent practice is the cornerstone of developing any new skill. Setting aside regular times to practice is crucial for growth—but let’s face it, just adding a reminder to your calendar or setting a recurring alarm often falls flat. Without a coach or instructor, it’s far too easy to dismiss those alerts and move on.
- **Imagine an app that not only reminds you to practice but actually holds you accountable.** This app requires you to capture a photo, video, or audio recording of your practice session before you can dismiss the day’s reminder. It’s a personal accountability partner that keeps you on track and motivated.
- In addition, this app lets you visually track your progress over time. Not only can you see a calendar showing which days you completed your practice, but you can also revisit each day’s effort to see just how far you’ve come. It’s like having a timeline of your growth—transforming your practice sessions from routine to rewarding.

---

## **Goal**

- To provide a productivity platform that requires users to capture pictures and/or videos of their practice sessions to hold themselves accountable. This would prevent users from forming new habits without following through with them.

---

## **Current Practice**

- This app is similar to **Alarmy**, an alarm clock that requires the user to prove they are awake by completing “missions” before the alarm can be dismissed.
- Other apps use monetary commitments or community review to ensure that users meet their goals. **ProofTrack** offers similar benefits without the pressure of monetary costs or social expectations.

---

## **Novelty**

- The twist for **ProofTrack** is its requirement for proof of practice. By capturing a post-workout selfie, a recording of a song played on guitar, or a video of skateboarding, **users document their progress with tangible evidence** rather than a simple check mark.

---

## **Effects**

- If successful, this software would help users stick to a consistent routine while cultivating new talents. The ability to revisit their growth over previous sessions would help celebrate their improvement over time.

---

# **User Manual**

## **High-Level Description**

- **ProofTrack** acts as a project management tool that enforces consistency with initial user goals by requiring regular proof of effort.
  
## **Installation**

### Prerequisites

1. **Node.js**: Install Node.js (recommend version 14.x or higher).
2. **Expo CLI**: Install globally:
    ```bash
    npm install -g expo-cli
    ```
3. **Expo Go app**: Download on an Android or iOS device for mobile testing.

### Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Revenantsghost/ProofTrack.git
    cd ProofTrack
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Running the Project**:
    ```bash
    npx expo start
    ```
    - Open the new tab in your browser and scan the QR code with the **Expo Go** app.

---

## **Using the App**

1. **Login Page**: Create a new account or log in with existing credentials.
2. **Creating a Project**: Navigate to the **New Project** tab, fill out project details, and press **Create**.
3. **Viewing Projects**: Go to the **Projects** tab to see all projects and submitted proof.
4. **Profile**: In the **Profile** tab, edit your username or password, view project stats, or log out.
5. **Submit Proof**:
   - Press the camera icon on the homepage.
   - Choose a project, upload media from your device, or capture a new photo/video.
   - Press **Submit** to log your proof of progress.

---

## **Reporting Bugs**

1. Go to **Issues** in the repository.
2. Copy and fill out the provided bug report template.
3. Describe the bug in detail and check if it has already been reported.

## **Known Bugs**

- Known bugs are documented in the **Issues** folder.

---

# **Developer Documentation**

- **Source Code**: Located in the [ProofTrack GitHub repository](https://github.com/Revenantsghost/ProofTrack).

## **Directory Structure**

- `.expo/` - ExpoGo app configuration
- `.github/workflows/` - GitHub workflows
- `ProofTrack/` - Contains the main app files (layout, pages, components)
- `backend/` - Backend files and scripts, including `blobservice.js` and `server.js`
- `reports/` - Weekly team reports in `YYYYMMDD.md` format
- **README.md**, **package-lock.json**, **.env** - Essential files for setup

## **Build Instructions**

1. **Clone and Install Dependencies**:
    ```bash
    git clone https://github.com/Revenantsghost/ProofTrack.git
    cd ProofTrack
    npm install
    ```

2. **Start the Expo Server**:
    ```bash
    npx expo start
    ```
    - Scan the QR code with the **Expo Go** app.

3. **Testing**:
    - **Frontend**: Go to the `ProofTrack` directory, then run:
        ```bash
        npm run test
        ```
    - **Backend**: Go to the `backend` directory, then run:
        ```bash
        npm run test
        ```

**Note**: Some backend tests require the `.env` file for Azure database access (excluded for security).

---

## **Testing and Release**

- Use **Jest** for both frontend and backend testing.
- Test files are located in `__tests__/` (frontend) and `tests/` (backend).
- Perform sanity checks on dependencies, Node.js version, and ExpoGo simulation before release.

--- 

