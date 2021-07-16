

const vimeo = {
    defaultSize : 480,
    defaultWidth : 200,
    defaultHeight : 200,

    API_URL : `https://api.vimeo.com/videos`,
    CLIENT_IDENTIFIER : `dd51c5c1b053aa43ea5fe4d6dbf3140a001299b7`,
    CLIENT_SECRET : `ed5Cyq92SC4LGYaDfHOoIv8ZBZxWAUW4qt1XB+n4YKHlEbuQACsAPpfryYY0WGtCWn/NlumrsiEV5M6ZypeXc7/J+90cobmEZjH8KArFIfZhQVt33ILgdWx+Vz0m24Zh`,
    TOKEN : `2064193fee8f19769da5932f808365ed`,

    authorization : 'Bearer 2064193fee8f19769da5932f808365ed',

    async search(searchTerm){
        const response = await axios.get(this.API_URL, {
            headers: {
                Authorization: this.authorization,
            },
            params: {
                query: searchTerm,
                per_page:6,
            },
        }).catch(err => {
            console.log('caught ',err);
        });
        // console.log('vimeo response : ', response);
        const videos = response.data.data;
        const tiles = await this.createVidTiles(videos);
        return tiles;
    },
    getThumbnail(video){
        return video.pictures.sizes[2].link;
    },
    getThumbnailURL(video){
        return video.thumbnailURL.link;
    },
    getVideoId(video){
        return video.uri.slice(7);//-cut off /videos/...
    },
    getVideoURL(video){
        const uri = video.uri;
        return `https://www.vimeo.com/${uri}`;
    },
    getVideoTitle(video){
        return video.name;
    },
    getVideosFromResults(searchResults){
        const videos = searchResults.data.data;
        return videos;
    },
    async createVidTiles(videos){
        const tiles = [];
        for(let video of videos){
            const thumbnail = this.getThumbnail(video);
            const id = this.getVideoId(video);
            const videoURL = this.getVideoURL(video);
            const title = this.getVideoTitle(video);
            const tile = new VideoTile(id,videoURL,thumbnail,"vimeo",title);
            tiles.push(tile);
        }
        return tiles;
    }, 
    getIframeSource(id){
        return `https://player.vimeo.com/video${id}`;
    }
};   

