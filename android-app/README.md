# Android Portfolio Companion App

A native Android application built with **Kotlin** and **Jetpack Compose** that connects directly to the Authoy Portfolio REST API. It serves as both a public portfolio viewer for visitors and a private dashboard for the administrator.

---

## Features

- **Teal & Cyan Dark Theme**: Matches the premium design language of the web portfolio.
- **Dynamic Profile Viewer**: Displays detailed bio, profile stats, and quick links.
- **Skills Grid**: View expertise grouped by category with animated progress bars.
- **Projects & Timelines**: Staggered work experiences, academic timeline, and clickable project lists (GitHub/Live Demo).
- **Articles & Detail View**: Browse published articles and read their full contents inside the app.
- **Contact Form**: Validate and send administrative messages directly to the server.
- **Admin Portal**: Secure JWT authentication, analytics dashboard, recent activity logs, and real-time message management (read/reply).

---

## Authentication Credentials

Use these credentials to access the Admin Dashboard inside the app:
- **Admin Email**: `authoy@email.com`
- **Password**: `AuthoyAdmin@2026!` (Connects to the same database backend API)

---

## Setup & Configuration

### 1. Start the Backend Server
Make sure the Express backend is running.
```bash
# From the server folder
npm install
node server.js
```
The server will start on port `5000`.

### 2. Configure API Endpoint
The app uses a Gradle configuration to bind the API base URL:

- **Emulator running on the same machine**:
  By default, `android-app/app/build.gradle.kts` uses:
  ```kotlin
  buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:5000/api/\"")
  ```
  `10.0.2.2` is the alias pointing to the host machine's loopback interface.

- **Physical Android Device**:
  If running on a physical phone, you must change this URL to point to your computer's local IP address (e.g. `192.168.1.100`):
  1. Find your local IP (Windows: `ipconfig`, Mac/Linux: `ifconfig` or `ip a`).
  2. Open `android-app/app/build.gradle.kts`.
  3. Replace the `API_BASE_URL` with:
     ```kotlin
     buildConfigField("String", "API_BASE_URL", "\"http://<YOUR_LOCAL_IP>:5000/api/\"")
     ```
  4. Ensure both your computer and your Android device are connected to the **same Wi-Fi network**.

---

## How to Run the App

### A. Run on Android Emulator (Android Studio)
1. Open the project root (`android-app`) in **Android Studio**.
2. Create or start an Android Virtual Device (AVD) from the **Device Manager**.
3. Click the **Run** button (green play icon) or press `Shift + F10` to compile and deploy.

### B. Run on a Physical Android Device
To run the app directly on your personal phone:
1. **Enable Developer Options**:
   - Go to **Settings** -> **About Phone**.
   - Scroll down and tap **Build number** 7 times until you see the message "You are now a developer!".
2. **Enable USB Debugging**:
   - Go back to the main **Settings** screen.
   - Navigate to **System** -> **Developer options** (or search for it).
   - Scroll down and toggle on **USB debugging**.
3. **Connect and Run**:
   - Connect your phone to your PC via a USB cable.
   - If prompted on the device, choose **Always allow USB debugging from this computer**.
   - In Android Studio, select your physical device from the device dropdown list and click **Run**.

---

## How to Build the APK File

If you don't want to use Android Studio, you can compile the APK from the command line:

1. Open a terminal and navigate to the `android-app` directory.
2. Run the Gradle build task:
   - **Windows PowerShell**:
     ```powershell
     $env:JAVA_HOME="C:\Users\SBD - Commercial 23\.android\jdk17\jdk-17.0.19+10"; ./gradlew.bat assembleDebug
     ```
   - **macOS / Linux**:
     ```bash
     ./gradlew assembleDebug
     ```
3. Locate the compiled APK at:
   `android-app/app/build/outputs/apk/debug/app-debug.apk`

---

## Installation via APK
1. Transfer `app-debug.apk` to your phone via USB, email, or cloud storage.
2. Open the file on your device using a File Manager.
3. Allow installation from **Unknown Sources** when prompted by Android, and tap **Install**.
