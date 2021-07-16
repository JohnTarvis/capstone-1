

const hulu = {
    defaultSize : 480,
    defaultWidth : 200,
    defaultHeight : 200,

    API_URL : `https://www.hulu.com/api/2.0/video`,

    // async search(searchTerm){
    //     console.log('apiurl',this.API_URL);
    //     const response = await axios.get(this.API_URL, {
    //         params: {
    //             query: searchTerm,
    //         },
    //     }).catch(err => {
    //         console.log('caught ',err);
    //     });
    //     console.log('vimeo response : ', response);
    // },
    
    async search(searchTerm, limit=10){
        const response = await axios({
            method:'GET',
            url:this.API_URL,
            params:{
                search:searchTerm,
                // limit:limit,
            }
        });
        return response;
        // const videos = response.data.list;
        // const tiles = await this.createVidTiles(videos);
        // return tiles;
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

