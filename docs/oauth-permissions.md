# Genesys Cloud OAuth Permissions

## Required OAuth Scopes

For the MD Anderson Cancer Center Genesys Cloud Reporting Tool, the following OAuth scopes are required:

### Analytics Permissions
- `analytics:read` - Allows access to all analytics data (this is a broader permission that may include several analytics capabilities)

### User and Organization Data
- `user:read` - Allows reading user information (note: singular "user" instead of "users")
- `organization:read` - Allows reading organization information

### Routing Data
- `routing:read` - Allows reading routing configuration and queue information

### Conversation Data
- `conversation:read` - Allows reading conversation data (note: singular "conversation" instead of "conversations")

## Alternative Permissions
If specific permissions aren't available, look for these broader permissions that might include the needed access:

- `analytics` - May include all analytics permissions
- `reporting:read` - May provide access to reporting functionality
- `quality:read` - May provide access to quality management data

## Setting Up OAuth Client

1. Log in to your Genesys Cloud Admin account
2. Navigate to Admin &gt; Integrations &gt; OAuth
3. Click "Add Client"
4. Enter a name for your client (e.g., "MD Anderson Reporting Tool")
5. Select "Client Credentials" as the Grant Type
6. Add all the required scopes that are available in your environment
7. Save the client configuration
8. Copy the Client ID and Client Secret to use in your application

## Security Considerations

- Store the Client ID and Client Secret securely
- Consider implementing token rotation for enhanced security
- Limit the OAuth client to only the permissions needed for your application
- Review and audit access regularly
