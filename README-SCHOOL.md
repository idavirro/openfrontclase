# OpenFront School Edition

A simplified version of OpenFront designed for school environments with multiple students connecting from the same network.

## Features

- **Single Game Mode**: Everyone joins the same game instance
- **Simple Interface**: Just enter your name, pick a flag, and join
- **No Account Required**: No signup or login needed
- **Multiple Players**: Supports multiple players from the same IP address
- **Spectator Mode**: Students can watch games in progress
- **GitHub Codespaces Ready**: Easy deployment in cloud environment

## Quick Start on GitHub Codespaces

1. **Fork this repository** to your GitHub account
2. **Open in Codespaces**:
   - Go to your forked repository
   - Click the green "Code" button
   - Select "Codespaces" tab
   - Click "Create codespace on main"

3. **Automatic Setup**:
   - Codespaces will automatically install dependencies
   - The game will start automatically
   - You'll see two ports forwarded:
     - Port 8080: Web interface (will open automatically)
     - Port 3001: Game server

4. **Share with Students**:
   - Copy the public URL for port 8080
   - Share this URL with your students
   - Students can access the game from any device with a web browser

## Local Development

If you want to run this locally instead of on Codespaces:

```bash
# Install dependencies
npm install

# Run the school edition (starts both client and server)
npm run school

# Or run components separately:
npm run school:serve  # Client on port 8080
npm run school:server # Server on port 3001
```

## How to Play

1. **Enter Your Name**: Type your name (max 20 characters)
2. **Choose a Flag**: Select your country flag from the dropdown
3. **Join Game**: Click "Join Game" to play or "Spectate Game" to watch
4. **Game Rules**: Same as regular OpenFront - capture territory, eliminate opponents

## Configuration

### Environment Variables

You can customize the server by setting these environment variables in Codespaces:

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

### Game Settings

The school edition includes these modifications:

- **No Player Limit from Same IP**: Multiple students can join from school network
- **Simplified UI**: Removed complex lobby features and account system
- **Auto-Game Management**: Games start automatically when 2+ players join
- **Quick Reconnection**: Handles network interruptions gracefully

## Troubleshooting

### Common Issues

1. **"Failed to connect to server"**
   - Make sure both ports (3001 and 8080) are running
   - Check if Codespaces is still starting up
   - Try refreshing the page

2. **"Name already taken"**
   - Each student needs a unique name
   - Try adding numbers or initials to make names unique

3. **Students can't connect**
   - Ensure you're sharing the correct public URL (port 8080)
   - Check if the Codespace is still running
   - Verify ports are publicly accessible

### Performance Tips

- **Maximum Players**: Recommended 6-8 players per game for best performance
- **Network**: Works best on stable school WiFi or ethernet
- **Browsers**: Tested on Chrome, Firefox, Safari, Edge

## Deployment Options

### Option 1: GitHub Codespaces (Recommended)
- Free tier available for education
- No setup required
- Automatic HTTPS and port forwarding
- Easy to share with students

### Option 2: Local Network
- Run on teacher's computer
- Share local IP address with students
- Requires network configuration

### Option 3: Cloud Hosting
- Deploy to services like Heroku, Railway, or DigitalOcean
- Permanent URL for repeated use
- May require basic cloud knowledge

## Educational Use

This version is perfect for:

- **Computer Science Classes**: Teaching multiplayer game concepts
- **Geography Lessons**: Using country flags and territorial concepts  
- **Team Building**: Collaborative and competitive gameplay
- **Technology Demonstrations**: Real-time web applications

## Technical Details

### Architecture
- **Frontend**: TypeScript + HTML5 Canvas + WebSockets
- **Backend**: Node.js + Express + WebSocket Server
- **Game Engine**: Simplified version of OpenFront core
- **Build System**: Webpack with development server

### Security
- No personal data collection
- No account creation required
- Safe for school environments
- COPPA compliant (no data storage)

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Create an issue in the GitHub repository
3. Make sure to include:
   - Error messages
   - Browser and device information
   - Number of students trying to connect

## License

Same license as the original OpenFront project. See LICENSE file for details.

---

**Happy Gaming! 🎮🏫**