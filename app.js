// Last.fm Stats Dashboard

class LastFmAPI {
    constructor() {
        this.baseUrl = 'https://ws.audioscrobbler.com/2.0/';
        this.username = null;
        this.apiKey = null;
    }

    setCredentials(username, apiKey) {
        this.username = username;
        this.apiKey = apiKey;
        localStorage.setItem('lastfm_username', username);
        localStorage.setItem('lastfm_apikey', apiKey);
    }

    clearCredentials() {
        this.username = null;
        this.apiKey = null;
        localStorage.removeItem('lastfm_username');
        localStorage.removeItem('lastfm_apikey');
    }

    loadCredentials() {
        const username = localStorage.getItem('lastfm_username');
        const apiKey = localStorage.getItem('lastfm_apikey');
        if (username && apiKey) {
            this.username = username;
            this.apiKey = apiKey;
            return true;
        }
        return false;
    }

    async makeRequest(method, params = {}) {
        const url = new URL(this.baseUrl);
        url.searchParams.append('method', method);
        url.searchParams.append('user', this.username);
        url.searchParams.append('api_key', this.apiKey);
        url.searchParams.append('format', 'json');

        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getUserInfo() {
        return await this.makeRequest('user.getInfo');
    }

    async getTopArtists(period = '7day', limit = 50) {
        return await this.makeRequest('user.getTopArtists', { period, limit });
    }

    async getTopTracks(period = '7day', limit = 50) {
        return await this.makeRequest('user.getTopTracks', { period, limit });
    }

    async getTopAlbums(period = '7day', limit = 50) {
        return await this.makeRequest('user.getTopAlbums', { period, limit });
    }

    async getRecentTracks(limit = 50) {
        return await this.makeRequest('user.getRecentTracks', { limit });
    }
}

class Dashboard {
    constructor() {
        this.api = new LastFmAPI();
        this.currentTab = 'overview';
        this.currentPeriod = {
            artists: '7day',
            tracks: '7day',
            albums: '7day'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();

        // Check if user is already logged in
        if (this.api.loadCredentials()) {
            this.showStats();
            this.loadAllData();
        }
    }

    setupEventListeners() {
        // Connection form
        document.getElementById('connectionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleConnection();
        });

        // Disconnect button
        document.getElementById('disconnectBtn').addEventListener('click', () => {
            this.handleDisconnect();
        });

        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Period selectors
        document.querySelectorAll('.period-selector').forEach(selector => {
            selector.addEventListener('click', (e) => {
                if (e.target.classList.contains('period-btn')) {
                    this.handlePeriodChange(e.target);
                }
            });
        });
    }

    async handleConnection() {
        const username = document.getElementById('username').value.trim();
        const apiKey = document.getElementById('apiKey').value.trim();

        if (!username || !apiKey) {
            alert('Please enter both username and API key');
            return;
        }

        this.api.setCredentials(username, apiKey);

        try {
            this.showLoading();
            await this.api.getUserInfo();
            this.showStats();
            await this.loadAllData();
        } catch (error) {
            alert('Failed to connect: ' + error.message);
            this.api.clearCredentials();
            this.hideLoading();
        }
    }

    handleDisconnect() {
        this.api.clearCredentials();
        this.showConnection();
        document.getElementById('connectionForm').reset();
    }

    showConnection() {
        document.getElementById('connectionSection').classList.remove('hidden');
        document.getElementById('statsSection').classList.add('hidden');
    }

    showStats() {
        document.getElementById('connectionSection').classList.add('hidden');
        document.getElementById('statsSection').classList.remove('hidden');
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === tabName);
        });
    }

    handlePeriodChange(button) {
        const period = button.dataset.period;
        const parentSelector = button.closest('.period-selector');

        // Update active button
        parentSelector.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn === button);
        });

        // Determine which tab we're in and reload data
        if (this.currentTab === 'artists') {
            this.currentPeriod.artists = period;
            this.loadTopArtists(period);
        } else if (this.currentTab === 'tracks') {
            this.currentPeriod.tracks = period;
            this.loadTopTracks(period);
        } else if (this.currentTab === 'albums') {
            this.currentPeriod.albums = period;
            this.loadTopAlbums(period);
        }
    }

    async loadAllData() {
        try {
            await this.loadUserInfo();
            await this.loadTopArtists();
            await this.loadTopTracks();
            await this.loadTopAlbums();
            await this.loadRecentTracks();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading data: ' + error.message);
            this.hideLoading();
        }
    }

    async loadUserInfo() {
        const data = await this.api.getUserInfo();
        const user = data.user;

        // Update user header
        document.getElementById('userAvatar').src = user.image[2]['#text'] || 'https://via.placeholder.com/100';
        document.getElementById('displayName').textContent = user.realname || user.name;
        document.getElementById('userStats').textContent = `@${user.name}`;

        // Update overview stats
        document.getElementById('totalScrobbles').textContent = parseInt(user.playcount).toLocaleString();

        const registeredDate = new Date(parseInt(user.registered.unixtime) * 1000);
        document.getElementById('memberSince').textContent = registeredDate.toLocaleDateString();

        document.getElementById('country').textContent = user.country || 'N/A';
    }

    async loadTopArtists(period = this.currentPeriod.artists) {
        const data = await this.api.getTopArtists(period);
        const artists = data.topartists.artist;

        const container = document.getElementById('topArtists');
        container.innerHTML = artists.map((artist, index) => `
            <div class="item">
                <div class="item-rank">${index + 1}</div>
                <img src="${artist.image[1]['#text'] || 'https://via.placeholder.com/64'}" alt="${artist.name}" class="item-image">
                <div class="item-info">
                    <div class="item-name">${artist.name}</div>
                    <div class="item-stats">${parseInt(artist.playcount).toLocaleString()} plays</div>
                </div>
            </div>
        `).join('');

        // Update quick stats if on overview
        if (this.currentTab === 'overview') {
            this.updateQuickStats(artists.slice(0, 5), 'artists');
        }
    }

    async loadTopTracks(period = this.currentPeriod.tracks) {
        const data = await this.api.getTopTracks(period);
        const tracks = data.toptracks.track;

        const container = document.getElementById('topTracks');
        container.innerHTML = tracks.map((track, index) => `
            <div class="item">
                <div class="item-rank">${index + 1}</div>
                <img src="${track.image[1]['#text'] || 'https://via.placeholder.com/64'}" alt="${track.name}" class="item-image">
                <div class="item-info">
                    <div class="item-name">${track.name}</div>
                    <div class="item-artist">${track.artist.name}</div>
                    <div class="item-stats">${parseInt(track.playcount).toLocaleString()} plays</div>
                </div>
            </div>
        `).join('');
    }

    async loadTopAlbums(period = this.currentPeriod.albums) {
        const data = await this.api.getTopAlbums(period);
        const albums = data.topalbums.album;

        const container = document.getElementById('topAlbums');
        container.innerHTML = albums.map((album, index) => `
            <div class="item">
                <div class="item-rank">${index + 1}</div>
                <img src="${album.image[2]['#text'] || 'https://via.placeholder.com/64'}" alt="${album.name}" class="item-image">
                <div class="item-info">
                    <div class="item-name">${album.name}</div>
                    <div class="item-artist">${album.artist.name}</div>
                    <div class="item-stats">${parseInt(album.playcount).toLocaleString()} plays</div>
                </div>
            </div>
        `).join('');
    }

    async loadRecentTracks() {
        const data = await this.api.getRecentTracks();
        const tracks = data.recenttracks.track;

        const container = document.getElementById('recentTracks');
        container.innerHTML = tracks.map((track) => {
            const isNowPlaying = track['@attr'] && track['@attr'].nowplaying;
            const date = track.date ? new Date(parseInt(track.date.uts) * 1000) : new Date();

            return `
                <div class="item ${isNowPlaying ? 'now-playing' : ''}">
                    ${isNowPlaying ? '<div class="now-playing-indicator">Now Playing</div>' : ''}
                    <img src="${track.image[1]['#text'] || 'https://via.placeholder.com/64'}" alt="${track.name}" class="item-image">
                    <div class="item-info">
                        <div class="item-name">${track.name}</div>
                        <div class="item-artist">${track.artist['#text'] || track.artist.name}</div>
                        <div class="item-stats">${isNowPlaying ? 'Listening now' : this.formatDate(date)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateQuickStats(artists, type) {
        const container = document.getElementById('quickStats');
        container.innerHTML = `
            <h4>Top 5 Artists (7 days)</h4>
            <div class="quick-stats-list">
                ${artists.map((artist, index) => `
                    <div class="quick-stat-item">
                        <span class="quick-stat-rank">${index + 1}.</span>
                        <span class="quick-stat-name">${artist.name}</span>
                        <span class="quick-stat-count">${parseInt(artist.playcount).toLocaleString()} plays</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }
}

// Initialize the dashboard
const dashboard = new Dashboard();
