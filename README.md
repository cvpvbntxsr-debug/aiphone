# Last.fm Stats Dashboard

A beautiful, modern web application to view your Last.fm listening statistics. Connect your Last.fm account and explore your music listening habits with detailed stats and visualizations.

## Features

- **User Profile Overview**: View your total scrobbles, member since date, and country
- **Top Artists**: See your most-listened-to artists across different time periods
- **Top Tracks**: Discover your favorite tracks with play counts
- **Top Albums**: Browse your most-played albums
- **Recent Tracks**: View your listening history in real-time
- **Now Playing**: See what you're currently listening to
- **Multiple Time Periods**: Filter stats by 7 days, 1 month, 3 months, 6 months, 12 months, or all time
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Persistent Login**: Your credentials are saved locally for convenience

## Getting Started

### Prerequisites

- A Last.fm account
- A Last.fm API key

### Getting Your Last.fm API Key

1. Visit [Last.fm API Account Creation](https://www.last.fm/api/account/create)
2. Fill in the application form:
   - **Application name**: Choose any name (e.g., "My Stats Dashboard")
   - **Application description**: Brief description of personal use
   - **Callback URL**: Not required for this application, you can leave it blank or use `http://localhost`
3. Submit the form
4. Copy your API key (you won't need the shared secret for this application)

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd lastfm-stats-dashboard
   ```

2. No build process or dependencies required! This is a pure HTML/CSS/JavaScript application.

### Running the Application

#### Option 1: Using Python (Recommended)

```bash
npm start
# or
python3 -m http.server 8000
```

Then open your browser and navigate to `http://localhost:8000`

#### Option 2: Using Node.js HTTP Server

```bash
npx http-server
```

#### Option 3: Using any other local web server

You can use any local web server of your choice, or simply open the `index.html` file directly in your browser (though some features may not work due to CORS restrictions).

### Using the Dashboard

1. **Connect Your Account**:
   - Enter your Last.fm username
   - Paste your API key
   - Click "Connect"

2. **Explore Your Stats**:
   - Navigate between different tabs (Overview, Top Artists, Top Tracks, Top Albums, Recent Tracks)
   - Change time periods using the period selector buttons
   - View detailed statistics and play counts

3. **Disconnect**:
   - Click the "Disconnect" button in the top right to log out
   - Your credentials are stored locally in your browser for convenience

## Features Overview

### Overview Tab
- Total scrobbles count
- Account creation date
- Country
- Quick view of top 5 artists from the last 7 days

### Top Artists Tab
- Ranked list of your most-listened-to artists
- Artist images
- Play counts
- Filterable by time period

### Top Tracks Tab
- Your favorite songs
- Album artwork
- Artist names
- Play counts
- Filterable by time period

### Top Albums Tab
- Most-played albums
- Album artwork
- Artist information
- Play counts
- Filterable by time period

### Recent Tracks Tab
- Real-time listening history
- "Now Playing" indicator for current track
- Timestamps showing when tracks were played
- Album artwork and artist information

## Technical Details

- **Pure JavaScript**: No frameworks or build tools required
- **Last.fm API**: Uses the official Last.fm Web Services API
- **Local Storage**: Credentials are stored locally for persistent sessions
- **Responsive CSS**: Mobile-first design with flexbox and grid
- **Modern Browser Support**: Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## API Methods Used

- `user.getInfo` - Fetch user profile information
- `user.getTopArtists` - Get top artists by time period
- `user.getTopTracks` - Get top tracks by time period
- `user.getTopAlbums` - Get top albums by time period
- `user.getRecentTracks` - Get recently played tracks

## Privacy & Security

- Your API key and username are stored only in your browser's local storage
- No data is sent to any server other than Last.fm's official API
- You can disconnect at any time to clear your stored credentials
- This is a client-side only application - no backend server

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Troubleshooting

### Connection Fails
- Verify your username is correct (case-sensitive)
- Ensure your API key is valid and hasn't expired
- Check that you have an active internet connection

### Stats Not Loading
- Make sure you have scrobbles in your Last.fm account
- Try refreshing the page
- Check the browser console for any error messages

### Images Not Showing
- Some artists/albums may not have images in the Last.fm database
- Placeholder images will be shown for missing artwork

## Future Enhancements

Potential features for future versions:
- Artist/album/track detail pages
- Listening trends over time with charts
- Compare stats with friends
- Export data to CSV/JSON
- Custom themes and color schemes
- Listening milestones and achievements

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

- Music data provided by [Last.fm](https://www.last.fm/)
- Built with vanilla HTML, CSS, and JavaScript

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Enjoy exploring your music listening stats! 🎵
