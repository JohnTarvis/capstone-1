const YOUTUBE_API_KEY = 'AIzaSyABILuTbD68uo2ZU4MKY0lTw4RFzDSs2PE';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';



async function SearchYouTube(searchTerm, maxResults = 10) {
    const response = await axios({
        method: 'GET',
        url: YOUTUBE_API_URL,
        params: {
            part: 'snippet',
            q: searchTerm,
            key: YOUTUBE_API_KEY,
            maxResults: maxResults,
        }
    });
    return response;
}

async function getYoutubeEmbeds(searchTerm, maxResults = 10) {
    const response = await SearchYouTube(searchTerm, maxResults);
    console.log(response);
    const vidObjects = response.data.items;
    const vidIds = vidObjects.map(video => video.id.videoId);
    const embeds = vidIds.map(id => generateYouTubeMarkupFromId(id));
    return embeds;
}

function generateYouTubeMarkupFromId(videoId,w=200,h=200){
    return `
    <div class="vidtile" width="${w}" height="${h}">
        <strong class='vidtileLink'>
            <a href='https://www.youtube.com/watch?v=${videoId}'>YouTube</a>
        </strong>
        <iframe src="https://www.youtube.com/embed/${videoId}"> </iframe>
    </div>`;
}


///////////////////////////////////////////////////////////////////////////////


const youtube = {
    defaultSize : 480,
    defaultWidth : 200,
    defaultHeight : 200,

    API_KEY : 'AIzaSyABILuTbD68uo2ZU4MKY0lTw4RFzDSs2PE',
    API_URL : 'https://www.googleapis.com/youtube/v3/search',
    BaseURL : 'https://www.youtube.com/video/',

    async search(searchTerm, maxResults = 10) {
        const response = await axios({
            method: 'GET',
            url: YOUTUBE_API_URL,
            params: {
                part: 'snippet',
                q: searchTerm,
                key: YOUTUBE_API_KEY,
                maxResults: maxResults,
            }
        });
        const videos = this.getVideosFromResults(response);
        const tiles = await this.createVidTiles(videos);
        return tiles;
    },
    getThumbnail(video){
        return video.snippet.thumbnails.default.url;
    },
    getVideoId(video){
        return video.id.videoId;
    },
    getVideoURL(video){
        const id = this.getVideoId(video);
        return `https://www.youtube.com/watch?v=${id}`;
    },
    getVideoTitle(video){
        return video.snippet.title;
    },
    getVideosFromResults(searchResults){
        const videos = searchResults.data.items;
        return videos;
    },
    async createVidTiles(videos){
        const tiles = [];
        for(let video of videos){
            const thumbnail = this.getThumbnail(video);
            const id = this.getVideoId(video);
            const videoURL = this.getVideoURL(video);
            const title = this.getVideoTitle(video);
            const tile = new VideoTile(id,videoURL,thumbnail,"youtube",title);
            tiles.push(tile);
        }
        return tiles;
    }, 

    getIframeSource(id){
        return `https://www.youtube.com/embed/${id}`;
    }
};   