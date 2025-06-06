const main = document.querySelector('main')

const modal = document.getElementsByClassName('modal-content')
const modalOverlay = document.getElementsByClassName('modal-overlay')[0]
const playlistModalOverlay = document.getElementById('add-playlist-form-modal')
const shuffleBtn = document.getElementById('shuffle-btn')

const homeLink = document.getElementById('home-link')
const featureLink = document.getElementById('feature-link')
const addBtn = document.getElementById('add-btn')
const searchBtn = document.getElementById('search-btn')
const submitPlaylistBtn = document.getElementById('submit-playlist-btn')
const addSongBtn = document.getElementById('add-song')
const submitSongBtn = document.getElementById('submit-song')

const playlistCards = document.createElement('div')
playlistCards.id = 'playlist-cards'

function loadPlaylist() {
    fetch("./data/data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network issue')
            }
            
            return response.json()
        })
        .then(playlists => {

            let newSongs = []
            let currentPlaylists = [...playlists]

            const loadPlaylistScreen = (playlists) => {
                clearScreen()

                playlists.forEach(playlist => {
                    createPlaylistElement(playlist)
                });

                main.appendChild(playlistCards)

                const cards = document.querySelectorAll('.playlist-card-container')
                let selectedPlaylist;

                cards.forEach(card => {
                    card.addEventListener('click', (event) => {
                        selectedPlaylist = card;

                        console.log(selectedPlaylist)

                        if (event.target.className.includes('playlist-card-heart-icon')) {
                            increaseLikeCount(selectedPlaylist)
                        } else if (event.target.id === "delete-btn" || event.target.id === "delete-btn-content") {
                            // delete from playlists
                            currentPlaylists = deletePlaylist(currentPlaylists, playlists[selectedPlaylist.id - 1])
                        } else {
                            targetId = selectedPlaylist.id
                            openModal(currentPlaylists.find(p => String(p.playlistID) === String(targetId)))
                        }
                    })

                })

                modalOverlay.addEventListener('click', (event) => {
                    if (event.target.className.trim() === 'modal-overlay') {
                        closeModal()
                    }
                })

                playlistModalOverlay.addEventListener('click', (event) => {
                    if (event.target.className.trim() === 'modal-overlay') {   
                        closeAddPlaylistForm()
                    }
                })

                shuffleBtn.addEventListener('click', () => {
                    shuffleSongs(currentPlaylists[selectedPlaylist.id - 1])
                    closeModal()
                    openModal(currentPlaylists[selectedPlaylist.id - 1])
                })
            }

            loadPlaylistScreen(currentPlaylists)

            homeLink.addEventListener('click', () => {
                loadPlaylistScreen(currentPlaylists)
                homeLink.classList.add('active')
                featureLink.classList.remove('active')
            })

            featureLink.addEventListener('click', () => {
                loadFeaturePage(currentPlaylists[Math.floor(Math.random() * currentPlaylists.length)])
                homeLink.classList.remove('active')
                featureLink.classList.add('active')
            })

            addBtn.addEventListener('click', () => {
                openAddPlaylistForm()
            })

            submitPlaylistBtn

            searchBtn.addEventListener('click', () => {
                const searchBar = document.getElementById('search')
                searchBar.classList.remove('hidden')

                // searchBar.addEventListener('input', event => {
                //     let filteredPlaylists = playlists.filter((playlist) => 
                //         playlist.playlist_name.toLowerCase().startsWith(searchBar.value) ||
                //         playlist.playlist_author.toLowerCase().startsWith(searchBar.value))
                //     loadPlaylistScreen(filteredPlaylists)
                // })

                // if i want search "button"
                let filteredPlaylists = currentPlaylists.filter((playlist) => 
                    playlist.playlist_name.toLowerCase().startsWith(searchBar.value) ||
                    playlist.playlist_author.toLowerCase().startsWith(searchBar.value))
                
                if (searchBar.value) {
                    loadPlaylistScreen(filteredPlaylists)
                }
            })

            document.addEventListener('click', event => {
                const searchBar = document.getElementById('search')
                const target = event.target.id
                if (target !== "search-btn" && 
                    target !== "search" && 
                    target !== "search-btn-a" && 
                    target !== "search-btn-svg" && 
                    target !== "search-btn-path") {
                    searchBar.classList.add('hidden')
                }
            })

            submitPlaylistBtn.addEventListener('click', () => {
                // add playlist
                const currentPlaylist = submitPlaylist(currentPlaylists)

                // add songs
                currentPlaylist.songs.push(...newSongs)
                newSongs = []

                loadPlaylistScreen(currentPlaylists)

            })

            // +
            addSongBtn.addEventListener('click', () => {
                const songUploadForm = document.getElementById('songs-upload-form')
                songUploadForm.classList.remove("hidden")
            })

            submitSongBtn.addEventListener('click', () => {
                addSong(newSongs)
                closeSongForm()
            })

            // const deleteBtn = document.getElementById('delete-btn')
            // deleteBtn.addEventListener('click', event => {

            // })
            
        })
        .catch(error => {
            console.error('There was a problem:', error)
        }) 
}

function shuffleSongs(playlist) {
    let songs = playlist.songs
    let i = songs.length
    let j
    let temp

    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1))
        temp = songs[j]
        songs[j] = songs[i]
        songs[i] = temp
    }
}

function increaseLikeCount(card) {
    const likeCount = document.getElementById('playlist-' + card.id + '-like-count')
    const heartIcon = document.getElementById('playlist-' + card.id + '-card-heart')
    amount = 1

    if (heartIcon.className.includes('liked')) { 
        heartIcon.className = heartIcon.className.replace('liked', '')
        amount *= -1
    } else {
        heartIcon.className += ' liked'
    }

    likeCount.textContent = Number(likeCount.textContent) + amount
}

function openModal(playlist) {
    populateModal(playlist)

    modalOverlay.className = modalOverlay.className.replace('hidden', '')
}

function closeModal() {
    clearModal()
    modalOverlay.className += 'hidden'
}

function createPlaylistElement(playlist) {
    const playlistCard = document.createElement('div')
    const playlistCardImg = document.createElement('img')
    const playlistCardInformation = document.createElement('div')
    const playlistCardName = document.createElement('h3')
    const playlistCardArtist = document.createElement('p')
    const playlistCardLikes = document.createElement('span')
    const playlistCardHeart = document.createElement('span')

    playlistCard.className ='playlist-card-container'
    playlistCardImg.setAttribute('src', playlist.playlist_art)
    playlistCardImg.setAttribute('alt', 'playlist image')
    playlistCardImg.onerror = './assets/img/playlist.png'
    playlistCardInformation.className = 'playlist-card-information'
    playlistCardHeart.className = 'playlist-card-heart-icon'
    playlistCardName.textContent = playlist.playlist_name
    playlistCardArtist.textContent = playlist.playlist_author
    playlistCardLikes.textContent = Math.floor(Math.random() * 10)
    playlistCardHeart.textContent = '♡ '

    playlistCardInformation.appendChild(playlistCardName)
    playlistCardInformation.appendChild(playlistCardArtist)
    playlistCardInformation.appendChild(playlistCardHeart)
    playlistCardInformation.appendChild(playlistCardLikes)

    /* delete element */
    const deleteBtn = document.createElement('div')
    const deleteBtnContent = document.createElement('div')
    deleteBtn.id = 'delete-btn'
    deleteBtnContent.id = 'delete-btn-content'
    deleteBtnContent.textContent = 'x'
    deleteBtn.appendChild(deleteBtnContent)

    playlistCard.appendChild(deleteBtn)
    playlistCard.appendChild(playlistCardImg)
    playlistCard.appendChild(playlistCardInformation)
    playlistCard.id = playlist.playlistID
    playlistCardHeart.className = 'playlist-card-heart-icon'
    playlistCardLikes.className = 'playlist-like-count'
    playlistCardHeart.id = 'playlist-' + playlist.playlistID + '-card-heart'
    playlistCardLikes.id = 'playlist-' + playlist.playlistID + '-like-count'

    playlistCards.appendChild(playlistCard)
    return playlistCards
}

function clearModal() {
    const modalSongsContainer = document.getElementsByClassName('modal-songs-container')[0]
    modalSongsContainer.innerHTML = ''
}

function populateModal(playlist) {
    const songs = playlist.songs

    const modalPlaylistImg = document.getElementById('modal-playlist-img')
    const modalPlaylistTitle = document.getElementById('modal-playlist-title')
    const modalPlaylistCreator = document.getElementById('modal-creator-name')

    modalPlaylistImg.setAttribute('src', playlist.playlist_art)
    modalPlaylistImg.setAttribute('alt', 'Playlist image')
    modalPlaylistImg.onerror = './assets/img/playlist.png'
    modalPlaylistTitle.textContent = playlist.playlist_name
    modalPlaylistCreator.textContent = playlist.playlist_author

    const modalSongsContainer = document.getElementsByClassName('modal-songs-container')[0]

    songs.forEach(song => {
        const modalSong = document.createElement('div')
        const modalSongImg = document.createElement('img')
        const modalSongContent = document.createElement('div')
        const modalSongTitle = document.createElement('h4')
        const modalSongArtist = document.createElement('p')
        const modalSongRuntime = document.createElement('p')

        modalSong.className = 'modal-song'
        modalSongContent.className = 'modal-song-content'
        modalSongRuntime.className = 'album-runtime'
        modalSongImg.setAttribute('src', song.song_art)
        modalSongImg.setAttribute('alt', 'Song image')
        modalSongImg.onerror = './assets/img/song.png'
        modalSongTitle.textContent = song.song_title
        modalSongArtist.textContent = song.song_artist
        modalSongRuntime.textContent = song.song_duration

        modalSongContent.appendChild(modalSongTitle)
        modalSongContent.appendChild(modalSongArtist)

        modalSong.appendChild(modalSongImg)
        modalSong.appendChild(modalSongContent)
        modalSong.appendChild(modalSongRuntime)

        modalSongsContainer.appendChild(modalSong)
    })
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function loadFeaturePage(playlist) {
    clearScreen()
    const songs = playlist.songs

    const featureHeader = document.createElement('div')
    featureHeader.id = 'feature-playlist-header'
    featureHeader.style.backgroundImage = 'linear-gradient(to bottom, ' + getRandomColor() + ', var(--ourwhite))'

    const featureTitle = document.createElement('div')
    featureTitle.id = 'feature-playlist-title'

    const playlistImage = document.createElement('img')
    const name = document.createElement('h1')
    const author = document.createElement('h2')

    playlistImage.src = playlist.playlist_art
    playlistImage.alt = 'Playlist image'
    playlistImage.onerror = './assets/img/playlist.png'
    name.textContent = playlist.playlist_name
    author.textContent = playlist.playlist_author

    featureTitle.appendChild(name)
    featureTitle.appendChild(author)

    const featureSongsContainer = document.createElement('div')
    featureSongsContainer.id = 'feature-songs-container'

    featureHeader.appendChild(playlistImage)
    featureHeader.appendChild(featureTitle)

    const featureContainer = document.createElement('div')
    featureContainer.id = 'feature-container'

    featureContainer.appendChild(featureHeader)

    songs.forEach(song => {
        const featureSong = document.createElement('div')
        featureSong.className = 'feature-song'

        const featureSongImage = document.createElement('img')
        featureSongImage.src = song.song_art
        featureSong.onerror = './assets/img/song.png'
        featureSongImage.alt = 'Song image'

        const featureSongTitle = document.createElement('div')
        featureSongTitle.className = 'feature-song-title'

        const songTitle = document.createElement('h3')
        const songArtist = document.createElement('p')
        songTitle.textContent = song.song_title
        songArtist.textContent = song.song_artist

        const featureSongRuntime = document.createElement('p')
        featureSongRuntime.className = 'feature-song-runtime'
        featureSongRuntime.textContent = song.song_duration

        featureSongTitle.appendChild(songTitle)
        featureSongTitle.appendChild(songArtist)
        featureSong.appendChild(featureSongImage)
        featureSong.appendChild(featureSongTitle)
        featureSong.appendChild(featureSongRuntime)

        featureSongsContainer.appendChild(featureSong)
    })

    featureContainer.appendChild(featureSongsContainer)
    main.appendChild(featureContainer)
}

function clearScreen() {
    playlistCards.innerHTML = ''
    main.innerHTML = ''
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function openAddPlaylistForm() {
    const addPlaylistFormModal = document.getElementById('add-playlist-form-modal')
    addPlaylistFormModal.classList.remove('hidden')
}

function closeAddPlaylistForm() {
    const addPlaylistFormModal = document.getElementById('add-playlist-form-modal')
    addPlaylistFormModal.classList.add('hidden')
}

function submitPlaylist(playlists) {
    const playlistNameInput = document.getElementById('playlist-name')
    const playlistAuthorInput = document.getElementById('author-name')
    const playlistCoverInput = document.getElementById('playlist-cover')

    playlists.push(
        {
            "playlistID": playlists.length + 1,
            "playlist_name": playlistNameInput.value ? playlistNameInput.value : "Playlist",
            "playlist_author": playlistAuthorInput.value ? playlistAuthorInput.value : "Some dude who didn't fill out the form",
            "playlist_art": playlistCoverInput.value ? playlistCoverInput.value : "./assets/img/playlist.png",
            "songs" : []
        }
    )

    closeSongForm()
    closeAddPlaylistForm()

    playlistNameInput.value = ''
    playlistAuthorInput.value = ''
    playlistCoverInput.value = ''

    return playlists[playlists.length - 1]
}

function addSong(newSongs) {
    const songNameInput = document.getElementById('song-name').value
    const songAuthorInput = document.getElementById('song-artist').value

    newSongs.push(
        {
            "song_title": songNameInput,
            "song_artist": songAuthorInput,
            "song_duration": '0:00',
            "song_art": "./assets/img/song.png"
        }
    )
}

function closeSongForm() {
    const songUploadForm = document.getElementById('songs-upload-form')
    songUploadForm.classList.add("hidden")
    
    let songNameInput = document.getElementById('song-name')
    let songAuthorInput = document.getElementById('song-artist')

    songNameInput.value = ''
    songAuthorInput.value = ''
}

function deletePlaylist(playlists, currentPlaylist) {
    playlists = playlists.filter(playlist => playlist.playlistID !== currentPlaylist.playlistID)

    const playlistContiner = document.getElementById(currentPlaylist.playlistID)
    playlistContiner.style.display = "none"

    return playlists
}

loadPlaylist()