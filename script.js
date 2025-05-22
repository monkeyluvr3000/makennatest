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

    // App state - removed crossfade properties
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
        activeSources: [], // Keep track of all active audio sources
        activeGainNodes: [], // Keep track of all active gain nodes
        buffers: {}, // Cache for loaded audio buffers
        currentBuffer: null,
        startTime: 0, // When the current source started playing
        playbackPosition: 0 // Current playback position in seconds
    };

    // DOM elements
    const songList = document.getElementById('songList');
    const bgList = document.getElementById('bgList'); // New background list
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const songImage = document.getElementById('songImage');
    const snippetTimestamp = document.getElementById('snippetTimestamp');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const loopBtn = document.getElementById('loopBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    // Removed crossfade slider references

    // Initialize the Web Audio API
    function initAudioContext() {
        try {
            // Create an audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            state.audioContext = new AudioContext();
        } catch (e) {
            console.error('Web Audio API is not supported in this browser', e);
        }
    }

    // Initialize the player
    function initPlayer() {
        // Initialize audio context
        initAudioContext();
        
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
            // Preload first song
            preloadAudio(state.songs[0].audioUrl, () => {
                updateDisplay(0);
            });
        }
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Only set up these listeners if we're on the music page
        if (playPauseBtn) {
            // Play/Pause button
            playPauseBtn.addEventListener('click', togglePlayPause);

            // Previous and Next buttons
            prevBtn.addEventListener('click', playPrevious);
            nextBtn.addEventListener('click', playNext);

            // Loop and Shuffle buttons
            loopBtn.addEventListener('click', toggleLoop);
            shuffleBtn.addEventListener('click', toggleShuffle);
            
            // Removed crossfade slider event listeners
            
            // Resume audio context on user interaction (needed for some browsers)
            document.addEventListener('click', () => {
                if (state.audioContext && state.audioContext.state === 'suspended') {
                    state.audioContext.resume();
                }
            });
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
    
    // Removed crossfade-related functions and kept essential audio playback functions
    // Preload audio file and store in buffer cache
    function preloadAudio(url, callback) {
        // Check if we already have this audio in cache
        if (state.buffers[url]) {
            if (callback) callback();
            return;
        }
        
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        
        request.onload = function() {
            state.audioContext.decodeAudioData(
                request.response,
                function(buffer) {
                    state.buffers[url] = buffer;
                    if (callback) callback();
                },
                function(error) {
                    console.error('Error decoding audio data', error);
                }
            );
        };
        
        request.onerror = function() {
            console.error('Error loading audio file');
        };
        
        request.send();
    }

    // Create a new audio source with gain control
    function createSource(buffer) {
        const source = state.audioContext.createBufferSource();
        const gainNode = state.audioContext.createGain();
        
        source.buffer = buffer;
        source.loop = false; // We'll handle looping manually
        
        // Connect source to gain node then to destination
        source.connect(gainNode);
        gainNode.connect(state.audioContext.destination);
        
        // Keep track of active sources and gain nodes for cleanup
        state.activeSources.push(source);
        state.activeGainNodes.push(gainNode);
        
        return { source, gainNode };
    }
    
    // Stop and clean up all active audio sources
    function stopAllAudio() {
        // Stop all active sources
        state.activeSources.forEach(source => {
            try {
                source.stop();
            } catch (e) {
                // Source might have already stopped
            }
        });
        
        // Clear and reset tracking arrays
        state.activeSources = [];
        state.activeGainNodes = [];
        
        // Clear current references
        state.currentSource = null;
        state.currentGainNode = null;
    }

    // Play audio buffer with Web Audio API
    function playAudioBuffer(buffer) {
        // Resume audio context if suspended
        if (state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }
        
        // Stop any currently playing audio
        stopAllAudio();
        
        // Create a new source and gain node
        const { source, gainNode } = createSource(buffer);
        
        // Store references
        state.currentSource = source;
        state.currentGainNode = gainNode;
        state.currentBuffer = buffer;
        
        // Set full volume
        gainNode.gain.setValueAtTime(1, state.audioContext.currentTime);
        
        // Start playback
        state.startTime = state.audioContext.currentTime;
        state.playbackPosition = 0;
        source.start(0);
        
        state.isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        // Set up ended event handler for when song naturally ends
        source.onended = function() {
            // Only handle ending if this is still the current source
            if (source === state.currentSource && state.isPlaying) {
                if (state.isLooping) {
                    // Just restart the same song if loop is on
                    playAudioBuffer(buffer);
                } else {
                    // Move to the next song
                    playNext();
                }
            }
        };
        
        return { source, gainNode };
    }

    // Pause current playback
    function pauseAudio() {
        if (!state.isPlaying) return;
        
        stopAllAudio();
        
        state.isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // Store position for resume
        if (state.currentBuffer) {
            state.playbackPosition = (state.audioContext.currentTime - state.startTime) % state.currentBuffer.duration;
        }
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (state.songs.length === 0) return;
        
        if (state.isPlaying) {
            pauseAudio();
        } else {
            // Resume playing current buffer if available
            if (state.currentBuffer) {
                playAudioBuffer(state.currentBuffer);
            } else {
                // Load current song if no buffer is available
                const url = state.songs[state.currentSongIndex].audioUrl;
                preloadAudio(url, function() {
                    playAudioBuffer(state.buffers[url]);
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
        preloadAudio(newUrl, function() {
            // If we're playing, switch to the new song
            if (state.isPlaying) {
                playAudioBuffer(state.buffers[newUrl]);
            } else {
                // Just prepare the buffer for later playback
                state.currentBuffer = state.buffers[newUrl];
                state.currentSongIndex = newIndex;
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
            songItem.addEventListener('click', () => {
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
