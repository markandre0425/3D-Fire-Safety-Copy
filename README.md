How to Extract and Run the Program
Step 1: Extract the Files
Use 7-Zip or WinRAR to extract the downloaded files.

Right-click the compressed file (.zip or .rar) and select "Extract Here" or choose a destination folder.

Step 2: Install Node.js (Required)
Before running the program, make sure you have Node.js installed.

Download it from the official website: https://nodejs.org

Run the installer and follow the setup instructions.

Step 3: Install Dependencies
Open the program folder in File Explorer.

Navigate to the root folder (main folder) of the program you want to run.

Open Terminal (Command Prompt/PowerShell) or VS Code Terminal in that folder.

Run the following command to install required modules:

sh
npm install, or npm install package.json to be specific.
(This reads package.json and installs all necessary dependencies.)

Step 4: Run the Program
After installation completes, start the program with:

sh
npm run dev
(This will launch the application in development mode.)

⚠️ Important Note: Errors in VS Code
When you first open the program folder in VS Code, you may see errors or warnings in the "Problems" tab.

Don’t worry! These errors appear because the required modules are not yet installed.

Once you run npm install, most errors should resolve automatically.

