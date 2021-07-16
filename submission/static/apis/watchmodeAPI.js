



const watchmode = {
    defaultSize : 480,
    defaultWidth : 200,
    defaultHeight : 200,

    API_URL : `https://api.watchmode.com/v1/search/`,
    API_KEY : `zKR3HiaUhxnU4UZ1iVtw1NfAtv2lu1Zkoz6GUsOi`,

    async search(searchTerm){
        const response = await axios.get(this.API_URL, {
            params: {
                apiKey: this.API_KEY,
                search_field: 'name',
                search_value: searchTerm,
            },
        }).catch(err => {
            console.log('caught ',err);
        });
        // return response;
        const paidResults = [];
        const results = response.data.title_results;
        for(let result of results){
            const titleId = result.id;
            const name = result.name;
            const url = `https://api.watchmode.com/v1/title/${titleId}/sources/?apiKey=${this.API_KEY}`;
            const sourceRequest = await axios.get(url).catch(err => {
                console.log('caught ',err);
            });
            let sources = sourceRequest.data.map(source=>source.web_url);
            sources = [...new Set(sources)].sort();///-remove duplicates
            const paidResult = {
                titleId:titleId,
                name:name,
                sources:sources,
            };
            paidResults.push(paidResult);
        }
        // console.log(paidResults);
        return paidResults;
    },
    async getTitleIds(searchTerm){
        const response = await axios.get(this.API_URL, {
            params: {
                apiKey: this.API_KEY,
                search_field: 'name',
                search_value: searchTerm,
            },
        }).catch(err => {
            console.log('caught ',err);
        });
        const ids = response.data.title_results.map(title => title.id);
        return ids;
    },
    async getTitleSources(titleId){
        const url = `https://api.watchmode.com/v1/title/${titleId}/sources/?apiKey=${this.API_KEY}`;
        const response = await axios.get(url).catch(err => {
            console.log('caught ',err);
        });
        const sources = response.data.map(source => source.web_url);
        return sources;
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

