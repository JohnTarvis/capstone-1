const DAILYMOTION_API_URL = 'https://api.dailymotion.com/videos';
const DailyMotionVidBaseURL = 'https://www.dailymotion.com/video/';

const dailymotion = {
    defaultSize : 480,
    defaultWidth : 200,
    defaultHeight : 200,
    API_URL : 'https://api.dailymotion.com/videos',
    API_THUMBNAIL_URL : 'https://api.dailymotion.com/video',
    BaseURL : 'https://www.dailymotion.com/video/',

    async search(searchTerm, limit=10){
        const response = await axios({
            method:'GET',
            url:DAILYMOTION_API_URL,
            params:{
                search:searchTerm,
                limit:limit,
            }
        });
        const videos = response.data.list;
        const tiles = await this.createVidTiles(videos);
        return tiles;
    },

    async getThumbnail(id, size=this.defaultSize){
        const response = await axios.get(`${this.API_THUMBNAIL_URL}/${id}?fields=thumbnail_${size}_url`);
        const thumbnail = response.data[`thumbnail_${size}_url`];
        return thumbnail;
    },

    async getThumbnails(ids,size=this.defaultSize){
        let thumbnails = [];
        for(let id of ids){
            const thumbnail = await this.getThumbnail(id,size);
            thumbnails.push(thumbnail);
        }
        return thumbnails;
    },

    async createVidTiles(videos){
        const tiles = [];
        for(let video of videos){
            const thumbnail = await this.getThumbnail(video.id);
            const tile = new VideoTile(video.id,`${this.BaseURL}${video.id}`,thumbnail,"dailymotion",video.title);
            tiles.push(tile);
        }
        return tiles;

    }, 

    getIframe(id){
        return `<iframe 
            style=
            "width:90%;
            height:90%;
            position:absolute;
            left:5%;
            top:5%;
            overflow:hidden" 
            frameborder="0" 
            type="text/html" 
            src="https://www.dailymotion.com/embed/video/${id}?autoplay=1" 
            allowfullscreen allow="autoplay"> 
        </iframe> `;
    },
    
    getIframeSource(id){
        return `https://www.dailymotion.com/embed/video/${id}?autoplay=1`;
    }
};   

