const playlistCards = document.getElementById('playlist-cards')
const modal = document.getElementsByClassName('modal-content')

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
        })
        .catch(error => {
            console.error('There was a problem:', error)
        })
}

function createPlaylistElement(playlist) {
    let playlistCard = document.createElement('div')
    let playlistCardImg = document.createElement('img')
    let playlistCardInformation = document.createElement('div')
    let playlistCardName = document.createElement('h3')
    let playlistCardArtist = document.createElement('p')
    let playlistCardLikes = document.createElement('span')
    let playlistCardHeart = document.createElement('span')

    playlistCard.className ='playlist-card-container'
    playlistCardImg.setAttribute('src', './assets/img/playlist.png')
    playlistCardImg.setAttribute('alt', 'playlist image')
    playlistCardInformation.className = 'playlist-card-information'
    playlistCardHeart.className = 'playlist-card-heart-icon'
    playlistCardName.textContent = playlist.playlist_name
    playlistCardArtist.textContent = playlist.playlist_author
    playlistCardLikes.textContent = 0 // to be implemented later
    playlistCardHeart.textContent = '♡ '

    playlistCardInformation.appendChild(playlistCardName)
    playlistCardInformation.appendChild(playlistCardArtist)
    playlistCardInformation.appendChild(playlistCardHeart)
    playlistCardInformation.appendChild(playlistCardLikes)

    playlistCard.appendChild(playlistCardImg)
    playlistCard.appendChild(playlistCardInformation)

    playlistCards.appendChild(playlistCard)
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

    let modalSongsContainer = document.getElementsByClassName('modal-songs-container')[0]

    songs.forEach((song) => {
        let modalSong = document.createElement('div')
        let modalSongImg = document.createElement('img')
        let modalSongContent = document.createElement('div')
        let modalSongTitle = document.createElement('h4')
        let modalSongArtist = document.createElement('p')
        let modalSongRuntime = document.createElement('p')

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

    // let modalHeader = document.createElement('modal-header')
    // let modalHeaderTitle = document.createElement('modal-header-title')
    // let modalSongContainer = document.createElement('modal-songs-container')

    // let modalAlbumTitle = document.createElement('h2')
    // let modalAlbumName = document.createElement('h3')
    // let modalSong = document.createElement('div')
    // let modalSongImg = document.createElement('img')
    // let modalSongContent = document.createElement('div')
    // let modalSongTitle = document.createElement('h4')
    // let modalSongArtist = document.createElement('p')
    // let modalSongRuntime = document.createElement('p')
    // // images will have to be implemented

    // modalAlbumTitle.textContent = playlist.playlist_name
    // modalAlbumName.textContent = playlist.playlist_author

    // modalHeaderTitle.appendChild(modalAlbumTitle)
    // modalHeaderTitle.appendChild(modalAlbumName)
    // modalHeader.appendChild(modalHeaderTitle)

    // modal.appendChild(modalHeader)

    // songs.forEach(song => {
    //     modalSong.className = 'modal-song'
    //     modalSongImg.setAttribute('src', './assets/img/song.png')
    //     modalSongImg.setAttribute('alt', 'Song Image')
    //     modalSongContent.className = 'modal-song-content'
    //     modalSongTitle.textContent = song.song_title
    //     modalSongArtist.textContent = song.song_artist
    //     modalSongRuntime = song.song_duration

    //     modalSongContent.appendChild(modalSongTitle)
    //     modalSongContent.appendChild(modalSongArtist)
    //     modalSong.appendChild(modalSongImg)
    //     modalSong.appendChild(modalSongContent)
    //     modalSong.appendChild(modalSongRuntime)
    //     modalSongContainer.appendChild(modalSong)
    // })

    // modal.appendChild(modalSongContainer)

}

loadPlaylist()
populateModal({
    "playlistID": 1,
    "playlist_name": "Summer Vibes",
    "playlist_author": "John Doe",
    "playlist_art": "https://example.com/summer-vibes-art.jpg",
    "songs": [
      {
        "songID": 1,
        "song_title": "Happy",
        "song_artist": "Pharrell Williams",
        "song_duration": "3:53"
      },
      {
        "songID": 2,
        "song_title": "Can't Stop the Feeling!",
        "song_artist": "Justin Timberlake",
        "song_duration": "3:56"
      },
      {
        "songID": 3,
        "song_title": "Uptown Funk",
        "song_artist": "Mark Ronson ft. Bruno Mars",
        "song_duration": "4:38"
      }
    ]
  })