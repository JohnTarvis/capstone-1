// req.query({
// 	"q": "get:new7-!1900,2018-!0,5-!0,10-!0-!Any-!Any-!Any-!gt100-!{downloadable}",
// 	"t": "ns",
// 	"cl": "all",
// 	"st": "adv",
// 	"ob": "Relevance",
// 	"p": "1",
// 	"sa": "and"
// });


const netflix = {
    defaultSize : 480,
    defaultWidth : 200,
    defaultHeight : 200,
    API_URL : "https://unogsng.p.rapidapi.com/search",
    async search(searchTerm){
        const response = await axios({
            method:'GET',
            url: this.API_URL,
            headers: {
                "x-rapidapi-key": "735ded71aamsh4481de707c1f84dp1c94f7jsn60691550738d",
                "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
                "useQueryString": true
            },
            params: {
                "start_year": "1972",
                "orderby": "rating",
                "audiosubtitle_andor": "and",
                "limit": "100",
                "subtitle": "english",
                "countrylist": "78,46",
                "audio": "english",
                "country_andorunique": "unique",
                "offset": "0",
                "end_year": "2019"
            },
        });
        return response;
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
            const tile = new VideoTile(video.id,`${this.BaseURL}${video.id}`,thumbnail,"netflix",video.title);
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
            src="https://www.netflix.com/embed/video/${id}?autoplay=1" 
            allowfullscreen allow="autoplay"> 
        </iframe> `;
    },
    
    getIframeSource(id){
        return `https://www.netflix.com/embed/video/${id}?autoplay=1`
    }
};   

