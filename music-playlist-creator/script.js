const playlistCards = document.getElementById('playlist-cards')
const modal = document.getElementsByClassName('modal-content')
const modalOverlay = document.getElementsByClassName('modal-overlay')[0]
const shuffleBtn = document.getElementById('shuffle-btn')

function loadPlaylist() {
    fetch("./data/data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network issue')
            }
            
            return response.json()
        })
        .then(playlists => {
            playlists.forEach(playlist => {
                createPlaylistElement(playlist)
            });

            const cards = document.querySelectorAll('.playlist-card-container')
            let selectedPlaylist;

            cards.forEach(card => {
                card.addEventListener('click', (event) => {
                    selectedPlaylist = card;

                    if (event.target.className.includes('playlist-card-heart-icon')) {
                        increaseLikeCount(selectedPlaylist)
                    } else {
                        openModal(playlists[selectedPlaylist.id - 1])
                    }
                })

            })

            modalOverlay.addEventListener('click', (event) => {
                if (event.target.className.trim() === 'modal-overlay') {
                    closeModal()
                }
            })

            shuffleBtn.addEventListener('click', () => {
                shuffleSongs(playlists[selectedPlaylist.id - 1])
                closeModal()
                openModal(playlists[selectedPlaylist.id - 1])
            })
            
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

    console.log(heartIcon.className)
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
    playlistCardImg.setAttribute('src', './assets/img/playlist.png')
    playlistCardImg.setAttribute('alt', 'playlist image')
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

    modalPlaylistImg.setAttribute('src', './assets/img/playlist.png')
    modalPlaylistImg.setAttribute('alt', 'Playlist image')
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
        modalSongImg.setAttribute('src', './assets/img/song.png')
        modalSongImg.setAttribute('alt', 'Song image')
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

// function selectNavigationLink() {
//     const featureLink = document.getElementById('feature-link')
//     const homeLink = document.getElementById('home-link')

//     featureLink.addEventListener('click', () => {
//         console.log(featureLink.classList)
//     })
// }

loadPlaylist()