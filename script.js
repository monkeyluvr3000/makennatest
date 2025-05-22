document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // MANUALLY ADD YOUR SONGS HERE
    // =============================================
    const songs = [
        {
            title: "party 4 u",
            artist: "charli xcx",
            imageUrl: "https://i.scdn.co/image/ab67616d0000b273e0eb48bfaef0253e2777e8de",
            audioUrl: "audio/party_4_u.mp3",
            snippetReference: "1:31 - 2:01"
        },
        {
            title: "Closer to You",
            artist: "Sammy Rae & The Friends",
            imageUrl: "https://i.scdn.co/image/ab67616d0000b273d8d9926c6c87708a5ce0ca31",
            audioUrl: "audio/closer_to_you.mp3",
            snippetReference: "2:45 - 3:23"
        },
        {
            title: "What's up",
            artist: "BETWEEN FRIENDS",
            imageUrl: "https://i.scdn.co/image/ab67616d0000b2734a7c7affc116a75eb2106670", 
            audioUrl: "audio/whats_up.mp3",
            snippetReference: "1:24 - 2:10"
        },
        {
            title: "Just One Day",
            artist: "BTS",
            imageUrl: "https://i.scdn.co/image/ab67616d0000b2738136ed97ee79331e5267546e", 
            audioUrl: "audio/just_one_day.mp3",
            snippetReference: "0:47 - 1:43"
        },
        {
            title: "American Bitch",
            artist: "BETWEEN FRIENDS",
            imageUrl: "https://i.scdn.co/image/ab67616d0000b273bd4193770d70414e61f6bcc4", 
            audioUrl: "audio/american_bitch.mp3",
            snippetReference: "1:20 - 1:52"
        },
        {
            title: "Why Is It Light Out?",
            artist: "The Kilans",
            imageUrl: "https://i.scdn.co/image/ab67616d0000b273b97bf03aa574e9a37e71c4c7", 
            audioUrl: "audio/why_is_it_light_out.mp3",
            snippetReference: "0:54 - 1:43"
        },
        {
            title: "as long as you care",
            artist: "Ruel",
            imageUrl: "https://i.scdn.co/image/ab67616d0000b2735e2c5053282f63f4e71cafb4", 
            audioUrl: "audio/as_long_as_you_care.mp3",
            snippetReference: "0:30 - 1:02"
        },
        {
            title: "COuGhDrOPs (,,Ծ‸Ծ,,)",
            artist: "1999 WRITE THE FUTURE",
            imageUrl: "https://i.scdn.co/image/ab67616d0000b273381f1782afe75c9e3a81a8dd", 
            audioUrl: "audio/coughdrops.mp3",
            snippetReference: "1:06 - 1:31"
        },
        {
            title: "Always",
            artist: "Rex Orange County",
            imageUrl: "https://i.scdn.co/image/ab67616d0000b273733e6d7818eef87d20df86b5", 
            audioUrl: "audio/always.mp3",
            snippetReference: "1:10 - 1:40"
        },
        {
            title: "Fear of Flying",
            artist: "Amine",
            imageUrl: "https://i.scdn.co/image/ab67616d00001e025459cc03cf4ddcf0e52ed69a", 
            audioUrl: "audio/fearofflying.mp3",
            snippetReference: "1:15 - 1:30"
        }
    ];
    
    // =============================================
    // MANUALLY ADD YOUR BACKGROUNDS HERE
    // =============================================
    const backgrounds = [
        {
            name: "friggin goat",
            imageUrl: "images/goat.png"
        },
        {
            name: "pizza",
            imageUrl: "images/pizza.jpeg"
        },
        {
            name: "mclovin",
            imageUrl: "images/mclovin.jpeg"
        },
        {
            name: "tomated",
            imageUrl: "images/tomated.jpeg"
        },
        {
            name: "sam's house",
            imageUrl: "images/sam.jpeg"
        },
        {
            name: "general",
            imageUrl: "images/general.jpeg"
        },
        {
            name: "hyperpigmentation",
            imageUrl: "images/hyperpigmentation.jpeg"
        },
        {
            name: "owned",
            imageUrl: "images/owned.jpeg"
        },
        {
            name: "jeff",
            imageUrl: "images/jeff.jpeg"
        },
        {
            name: "that moment when",
            imageUrl: "images/map.jpeg"
        },
        {
            name: "feminism",
            imageUrl: "images/feminism.jpeg"
        },
        {
            name: "gliderport",
            imageUrl: "images/gliderport.jpeg"
        }
    ];

    // App state
    const state = {
        songs: songs,
        backgrounds: backgrounds,
        currentSongIndex: 0,
        isPlaying: false,
        isLooping: false,
        isShuffling: false,
        playOrder: [],
        audioContext: null,
        currentSource: null,
        currentGainNode: null,
        activeSources: [],
        activeGainNodes: [],
        buffers: {},
        currentBuffer: null,
        startTime: 0,
        playbackPosition: 0,
        audioInitialized: false // Track if audio has been initialized
    };

    // DOM elements
    const songList = document.getElementById('songList');
    const bgList = document.getElementById('bgList');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const songImage = document.getElementById('songImage');
    const snippetTimestamp = document.getElementById('snippetTimestamp');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const loopBtn = document.getElementById('loopBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');

    // Initialize the Web Audio API - ONLY after user interaction
    function initAudioContext() {
        if (!state.audioContext) {
            try {
                console.log("Initializing AudioContext");
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                state.audioContext = new AudioContext();
                state.audioInitialized = true;
                console.log("AudioContext state:", state.audioContext.state);
            } catch (e) {
                console.error('Web Audio API is not supported in this browser', e);
            }
        }
        return state.audioContext;
    }

    // Ensure audio context is resumed - returns a promise
    async function ensureAudioContextResumed() {
        if (!state.audioContext) {
            initAudioContext();
        }
        
        if (state.audioContext && state.audioContext.state === 'suspended') {
            try {
                console.log("Resuming suspended AudioContext...");
                await state.audioContext.resume();
                console.log("AudioContext resumed:", state.audioContext.state);
            } catch (e) {
                console.error("Failed to resume AudioContext:", e);
            }
        }
        return state.audioContext;
    }

    // Handler for user interaction events
    async function handleUserInteraction(event) {
        console.log(`User interaction: ${event.type}`);
        if (!state.audioInitialized) {
            initAudioContext();
            
            // Preload the first song after user interaction
            if (state.songs.length > 0) {
                preloadAudio(state.songs[state.currentSongIndex].audioUrl);
            }
        } else {
            await ensureAudioContextResumed();
        }
    }

    // Initialize the player
    function initPlayer() {
        // Create the song list
        if (songList) {
            updateSongList();
        }
        
        // Create the background list if we're on the music page
        if (bgList) {
            createBackgroundList();
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Load the first song if we're on the music page
        if (state.songs.length > 0 && songTitle) {
            updateDisplay(0);
            // NOTE: We now wait for user interaction before initializing audio
        }
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Only set up these listeners if we're on the music page
        if (playPauseBtn) {
            // Play/Pause button with user interaction handling
            playPauseBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                await handleUserInteraction(e);
                togglePlayPause();
            });

            // Previous and Next buttons with user interaction handling
            prevBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                await handleUserInteraction(e);
                playPrevious();
            });
            
            nextBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                await handleUserInteraction(e);
                playNext();
            });

            // Loop and Shuffle buttons
            loopBtn.addEventListener('click', toggleLoop);
            shuffleBtn.addEventListener('click', toggleShuffle);
            
            // Add touch event listeners for mobile devices
            document.addEventListener('touchstart', handleUserInteraction);
            document.addEventListener('touchend', handleUserInteraction);
            
            // Standard click listener for desktop
            document.addEventListener('click', handleUserInteraction);
        }
    }
    
    // Create the background list
    function createBackgroundList() {
        state.backgrounds.forEach((bg, index) => {
            // Create a background list item
            const bgItem = document.createElement('div');
            bgItem.classList.add('bg-item');
            bgItem.textContent = bg.name;
            
            // Add click handler to change background
            bgItem.addEventListener('click', () => {
                // Remove active class from all items
                document.querySelectorAll('.bg-item.active').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to selected item
                bgItem.classList.add('active');
                
                // Set the background image
                document.body.style.backgroundImage = `url('${bg.imageUrl}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
            });
            
            bgList.appendChild(bgItem);
        });
    }
    
    // Preload audio file and store in buffer cache
    function preloadAudio(url, callback) {
        // Check if audio context is available
        if (!state.audioContext) {
            console.log("Cannot preload audio - AudioContext not initialized");
            if (callback) callback(false);
            return;
        }
        
        // Check if we already have this audio in cache
        if (state.buffers[url]) {
            console.log("Audio already cached:", url);
            if (callback) callback(true);
            return;
        }
        
        console.log("Preloading audio:", url);
        
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        
        request.onload = function() {
            console.log("Audio file loaded, decoding:", url);
            state.audioContext.decodeAudioData(
                request.response,
                function(buffer) {
                    console.log("Audio decoded successfully:", url);
                    state.buffers[url] = buffer;
                    if (callback) callback(true);
                },
                function(error) {
                    console.error('Error decoding audio data:', error);
                    if (callback) callback(false);
                }
            );
        };
        
        request.onerror = function(e) {
            console.error('Error loading audio file:', e);
            if (callback) callback(false);
        };
        
        request.send();
    }

    // Create a new audio source with gain control
    function createSource(buffer) {
        const source = state.audioContext.createBufferSource();
        const gainNode = state.audioContext.createGain();
        
        source.buffer = buffer;
        source.loop = false;
        
        source.connect(gainNode);
        gainNode.connect(state.audioContext.destination);
        
        state.activeSources.push(source);
        state.activeGainNodes.push(gainNode);
        
        return { source, gainNode };
    }
    
    // Stop and clean up all active audio sources
    function stopAllAudio() {
        state.activeSources.forEach(source => {
            try {
                source.stop();
            } catch (e) {
                // Source might have already stopped
            }
        });
        
        state.activeSources = [];
        state.activeGainNodes = [];
        
        state.currentSource = null;
        state.currentGainNode = null;
    }

    // Play audio buffer with Web Audio API - now async to ensure AudioContext is ready
    async function playAudioBuffer(buffer) {
        try {
            // Ensure audio context is resumed before playing
            await ensureAudioContextResumed();
            
            // Stop any currently playing audio
            stopAllAudio();
            
            // Create a new source and gain node
            const { source, gainNode } = createSource(buffer);
            
            // Store references
            state.currentSource = source;
            state.currentGainNode = gainNode;
            state.currentBuffer = buffer;
            
            // Set volume to full for mobile
            gainNode.gain.setValueAtTime(1, state.audioContext.currentTime);
            
            // Start playback
            state.startTime = state.audioContext.currentTime;
            state.playbackPosition = 0;
            source.start(0);
            console.log("Audio playback started");
            
            state.isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            
            // Set up ended event handler for when song naturally ends
            source.onended = function() {
                if (source === state.currentSource && state.isPlaying) {
                    if (state.isLooping) {
                        playAudioBuffer(buffer);
                    } else {
                        playNext();
                    }
                }
            };
            
            return { source, gainNode };
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    }

    // Pause current playback
    function pauseAudio() {
        if (!state.isPlaying) return;
        
        stopAllAudio();
        
        state.isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        if (state.currentBuffer) {
            state.playbackPosition = (state.audioContext.currentTime - state.startTime) % state.currentBuffer.duration;
        }
    }

    // Toggle play/pause - updated to handle async operations
    async function togglePlayPause() {
        if (state.songs.length === 0) return;
        
        if (state.isPlaying) {
            pauseAudio();
        } else {
            if (state.currentBuffer) {
                await playAudioBuffer(state.currentBuffer);
            } else {
                const url = state.songs[state.currentSongIndex].audioUrl;
                preloadAudio(url, async function(success) {
                    if (success) {
                        await playAudioBuffer(state.buffers[url]);
                    } else {
                        console.error("Failed to load audio:", url);
                    }
                });
            }
        }
    }

    // Play previous song
    function playPrevious() {
        if (state.songs.length === 0) return;
        
        const prevIndex = state.isShuffling
            ? getPrevShuffleIndex()
            : (state.currentSongIndex - 1 + state.songs.length) % state.songs.length;
        
        changeSong(prevIndex);
    }

    // Play next song
    function playNext() {
        if (state.songs.length === 0) return;
        
        const nextIndex = state.isShuffling
            ? getNextShuffleIndex()
            : (state.currentSongIndex + 1) % state.songs.length;
        
        changeSong(nextIndex);
    }
    
    // Get next song index in shuffle mode
    function getNextShuffleIndex() {
        // If we haven't created a shuffle order, create one
        if (state.playOrder.length === 0) {
            createShuffleOrder();
        }
        
        // Find the current position in the shuffle order
        const currentPos = state.playOrder.indexOf(state.currentSongIndex);
        return state.playOrder[(currentPos + 1) % state.playOrder.length];
    }
    
    // Get previous song index in shuffle mode
    function getPrevShuffleIndex() {
        // If we haven't created a shuffle order, create one
        if (state.playOrder.length === 0) {
            createShuffleOrder();
        }
        
        // Find the current position in the shuffle order
        const currentPos = state.playOrder.indexOf(state.currentSongIndex);
        return state.playOrder[(currentPos - 1 + state.playOrder.length) % state.playOrder.length];
    }

    // Change to a different song
    function changeSong(newIndex) {
        if (newIndex < 0 || newIndex >= state.songs.length) return;
        
        const newUrl = state.songs[newIndex].audioUrl;
        
        // Update display immediately
        updateDisplay(newIndex);
        
        // Preload the new song if needed
        preloadAudio(newUrl, async function(success) {
            if (success) {
                // If we're playing, switch to the new song
                if (state.isPlaying) {
                    await playAudioBuffer(state.buffers[newUrl]);
                } else {
                    // Just prepare the buffer for later playback
                    state.currentBuffer = state.buffers[newUrl];
                    state.currentSongIndex = newIndex;
                }
            }
        });
    }

    // Toggle loop mode
    function toggleLoop() {
        state.isLooping = !state.isLooping;
        loopBtn.classList.toggle('active', state.isLooping);
    }

    // Toggle shuffle mode
    function toggleShuffle() {
        state.isShuffling = !state.isShuffling;
        shuffleBtn.classList.toggle('active', state.isShuffling);
        
        if (state.isShuffling) {
            createShuffleOrder();
        }
    }
    
    // Create a shuffled play order
    function createShuffleOrder() {
        state.playOrder = [...Array(state.songs.length).keys()];
        
        // Fisher-Yates shuffle algorithm
        for (let i = state.playOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [state.playOrder[i], state.playOrder[j]] = [state.playOrder[j], state.playOrder[i]];
        }
        
        // Make sure current song is included
        if (!state.playOrder.includes(state.currentSongIndex)) {
            // Replace a random position with current song
            const pos = Math.floor(Math.random() * state.playOrder.length);
            state.playOrder[pos] = state.currentSongIndex;
        }
    }

    // Update the song list in the sidebar
    function updateSongList() {
        songList.innerHTML = '';
        
        state.songs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.classList.add('song-item');
            if (index === state.currentSongIndex) {
                songItem.classList.add('active');
            }
            songItem.textContent = song.title;
            songItem.addEventListener('click', async (e) => {
                await handleUserInteraction(e);
                changeSong(index);
            });
            
            songList.appendChild(songItem);
        });
    }

    // Update display elements
    function updateDisplay(index) {
        // Update current song index
        state.currentSongIndex = index;
        
        const song = state.songs[index];
        
        // Update display
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        songImage.src = song.imageUrl;
        
        // Display snippet timestamp as reference only
        snippetTimestamp.textContent = `${song.snippetReference}`;
        
        // Update active song in list
        const prevActiveSong = document.querySelector('.song-item.active');
        if (prevActiveSong) {
            prevActiveSong.classList.remove('active');
        }
        
        const songItems = document.querySelectorAll('.song-item');
        if (songItems[index]) {
            songItems[index].classList.add('active');
        }
    }

    // Initialize the player
    initPlayer();
});
