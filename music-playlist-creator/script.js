const playlistCards = document.getElementById('playlist-cards')

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

loadPlaylist()