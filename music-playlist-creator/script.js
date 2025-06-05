const main = document.querySelector('main')

const modal = document.getElementsByClassName('modal-content')
const modalOverlay = document.getElementsByClassName('modal-overlay')[0]
const shuffleBtn = document.getElementById('shuffle-btn')

const homeLink = document.getElementById('home-link')
const featureLink = document.getElementById('feature-link')

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

            const loadPlaylistScreen = () => {
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
            }

            // const cards = document.querySelectorAll('.playlist-card-container')
            // let selectedPlaylist;

            // cards.forEach(card => {
            //     card.addEventListener('click', (event) => {
            //         selectedPlaylist = card;

            //         if (event.target.className.includes('playlist-card-heart-icon')) {
            //             increaseLikeCount(selectedPlaylist)
            //         } else {
            //             openModal(playlists[selectedPlaylist.id - 1])
            //         }
            //     })

            // })

            homeLink.addEventListener('click', () => {
                loadPlaylistScreen()
            })

            featureLink.addEventListener('click', () => {
                loadFeaturePage(playlists[Math.floor(Math.random() * playlists.length)])
            })

            loadPlaylistScreen()
            
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

    const featureTitle = document.createElement('div')
    featureTitle.id = 'feature-playlist-title'

    const playlistImage = document.createElement('img')
    const name = document.createElement('h1')
    const author = document.createElement('h2')

    playlistImage.src = './assets/img/song.png'
    playlistImage.alt = 'Playlist image'
    name.textContent = playlist.playlist_name
    author.textContent = playlist.playlist_author

    featureTitle.appendChild(name)
    featureTitle.appendChild(author)

    featureHeader.appendChild(playlistImage)
    featureHeader.appendChild(featureTitle)
    main.appendChild(featureHeader)

    const featureSongsContainer = document.createElement('div')
    featureSongsContainer.id = 'feature-songs-container'

    songs.forEach(song => {
        const featureSong = document.createElement('div')
        featureSong.className = 'feature-song'

        const featureSongImage = document.createElement('img')
        featureSongImage.src = './assets/img/playlist.png'
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

        main.appendChild(featureSong)
    })
}

function clearScreen() {
    playlistCards.innerHTML = ''
    main.innerHTML = ''
}

featureLink.addEventListener('click', () => {
    loadFeaturePage({
    "playlistID": 10,
    "playlist_name": "Jazz Standards",
    "playlist_author": "Lisa Nguyen",
    "playlist_art": "https://example.com/jazz-standards-art.jpg",
    "songs": [
      {
        "songID": 43,
        "song_title": "My Funny Valentine",
        "song_artist": "Chet Baker",
        "song_duration": "2:17"
      },
      {
        "songID": 44,
        "song_title": "Fly Me to the Moon",
        "song_artist": "Frank Sinatra",
        "song_duration": "2:30"
      },
      {
        "songID": 45,
        "song_title": "Summertime",
        "song_artist": "Louis Armstrong",
        "song_duration": "3:23"
      },
      {
        "songID": 46,
        "song_title": "Moon River",
        "song_artist": "Henry Mancini",
        "song_duration": "2:41"
      },
      {
        "songID": 47,
        "song_title": "The Way You Look Tonight",
        "song_artist": "Frank Sinatra",
        "song_duration": "3:22"
      },
      {
        "songID": 48,
        "song_title": "Night and Day",
        "song_artist": "Billie Holiday",
        "song_duration": "3:04"
      },
      {
        "songID": 49,
        "song_title": "I'll Be Seeing You",
        "song_artist": "Billie Holiday",
        "song_duration": "3:27"
      },
      {
        "songID": 50,
        "song_title": "My Heart Belongs to Daddy",
        "song_artist": "Marilyn Monroe",
        "song_duration": "2:17"
      },
      {
        "songID": 51,
        "song_title": "Feelin' Good",
        "song_artist": "Nina Simone",
        "song_duration": "2:53"
      },
      {
        "songID": 52,
        "song_title": "Sway",
        "song_artist": "Dean Martin",
        "song_duration": "2:42"
      }
    ]
  })
})

loadPlaylist()