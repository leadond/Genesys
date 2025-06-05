# Genesys Cloud Users Dashboard

This application fetches user information from Genesys Cloud and displays it in a web-based dashboard.

## Features

- Display users in grid or list view
- Filter users by department and state
- Search users by name, email, department, or title
- View detailed user information
- Display statistics and charts
- Responsive design for desktop and mobile

## Prerequisites

- Node.js installed on your system
- Genesys Cloud organization with API credentials
- Internet connectivity to access Genesys Cloud API

## Setup

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Genesys Cloud credentials:
   ```
   CLIENT_ID=your_client_id
   CLIENT_SECRET=your_client_secret
   REGION=your_region
   USE_MOCK_DATA=true
   ```

## Usage

### Fetching Users

To fetch users from Genesys Cloud and save them to a JSON file:

```
npm run fetch
```

This will:
1. Authenticate with Genesys Cloud
2. Fetch all users with pagination
3. Save all user information to a file named `genesys_users.json`

### Running the Web Dashboard

To start the web server and access the dashboard:

```
npm run serve
```

Then open your browser to `http://localhost:3000`

### Development Mode

To run both the API fetcher and web server with auto-restart on file changes:

```
npm run dev
```

## Important Note About WebContainer

This application requires access to external APIs, which may be limited in WebContainer environments. If you encounter "socket hang up" errors, try running the application in a local Node.js environment outside of WebContainer.

## Mock Data Mode

By default, the application runs in mock data mode to allow for development and testing without requiring actual Genesys Cloud credentials. To use real data:

1. Set `USE_MOCK_DATA=false` in your `.env` file
2. Ensure your Genesys Cloud credentials are correct
3. Run the application in a local Node.js environment

## Customization

- Modify the number of mock users by changing `MOCK_USER_COUNT` in the `.env` file
- Customize the UI by editing the CSS in `public/css/styles.css`
- Add additional features by extending the JavaScript in `public/js/app.js`

## Troubleshooting

### Socket Hang Up Error
If you encounter a "socket hang up" error, this is likely due to network connectivity issues or WebContainer limitations. Try running the application in a local Node.js environment.

### Authentication Errors
Verify your CLIENT_ID, CLIENT_SECRET, and REGION in the .env file. Make sure your API credentials have the necessary permissions to access user information.

### Rate Limiting
Genesys Cloud API has rate limits. If you hit these limits, the application will report an error. Consider adding delays between requests if needed.
