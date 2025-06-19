# Payment Integration Troubleshooting Guide

## ERR_NAME_NOT_RESOLVED Error

If you encounter the error `Failed to load resource: net::ERR_NAME_NOT_RESOLVED` or `Error generating PayOS checkout URL: TypeError: Failed to fetch` during payment processing, follow these steps:

### Check Network Connectivity

1. Verify your internet connection is working properly
2. Try accessing other websites to confirm general connectivity

### Check PayOS Configuration

1. Open your configuration file and verify these settings:
   - `payosApiUrl` - Should be a valid URL (e.g., `https://api.payos.vn/v1/payment-requests`)
   - `payosClientId` - Verify this is correct
   - `payosApiKey` - Verify this is correct

### Check DNS Settings

1. Try flushing your DNS cache:
   - Windows: Run `ipconfig /flushdns` in Command Prompt
   - macOS: Run `sudo killall -HUP mDNSResponder` in Terminal
   - Linux: Run `sudo systemd-resolve --flush-caches` in Terminal

### Check if PayOS is Available

1. Visit the PayOS status page or contact their support to verify the service is operational

### Developer Debugging

1. Open the browser's developer console (F12)
2. Look for detailed error messages
3. Check the Network tab to see the specific request that's failing

If the problem persists, contact your system administrator or PayOS support for further assistance.
