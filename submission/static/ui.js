const $searchSection = $('#search-section');
const $searchResults = $('#search-results');
const $searchResultsRow = $('#search-results-row');
const $searchResultsCol = $('#search-results-col');
const $searchButton = $('#search-button');
const $searchInput = $('#search-input');
const $videoPlayer = $('#video-player');
const $spinner = $('#spinner');
const displayTiles = [];

$spinner.hide();

function hostFromURL(url){
    const startIndex = url.search(/\..*\.com/);
    // console.log('start',startIndex);
    const endIndex = url.search(/\.com/);
    // console.log('end',endIndex);
    return url.slice(startIndex+1,endIndex);
}

//////////////////////////////////////////////////////

var TEST;
const $testButton = $('#testButton');
$testButton.click(test);
async function test(){
    params = {search_term:'dogs'};
    const searchTerm = $searchInput.val();
    const result = await axios.get(`api/search/${searchTerm}`);
    console.log(result);
}
//////////////////////////////////////////////////////

function showOnly($element){
    $searchSection.hide();
    $videoPlayer.hide();
    $element.show();
}

function showVideo(){
    $searchSection.hide();
    $searchResults.hide();
    $videoPlayer.show();
}

function hideVideo(){
    $videoPlayer.empty();
    $videoPlayer.hide();
    $searchResults.show();
    $searchSection.show();
}

// function showLoadingView() {
//     // $searchSection.hide();
//     $searchResults.hide();
//     document.getElementById('spinner').classList.add('loader');
// }

// function hideLoadingView() {
//     // $searchResults.show();
//     $searchResults.show();
//     document.getElementById('spinner').classList.remove('loader');
// }

function clearSearchResults(){
    $searchResults.empty();
}

// showLoadingView();


async function searchVideos(){
    console.clear();
    clearSearchResults();

    // showLoadingView();
    $spinner.show();

    const searchTerm = $searchInput.val();
    const result = await axios.get(`api/search/${searchTerm}`);

    const data = result.data[0];

    const youtubeResults = [];
    const vimeoResults = [];
    const dailymotionResults = [];
    const watchmodeResults = [];

    const paidResults = [];

    for (item of data){
        if (item.paid == true){
            watchmodeResults.push(item);
        } else {
            if (item.site == 'youtube'){
                youtubeResults.push(item);
            }
            if (item.site == 'vimeo'){
                vimeoResults.push(item);
            }
            if (item.site == 'dailymotion'){
                dailymotionResults.push(item);
            }
        }
    }

    watchmodeResults.forEach(function(watchmodeResult){
        const index = paidResults.findIndex(paidResult=>paidResult.site == watchmodeResult.site);
        if(index == -1){
            paidResults.push({  site:[watchmodeResult.site],
                                sources:[watchmodeResult.video_url],
                            });
        } else {
            paidResults[index].sources.push(watchmodeResult.video_url);
        }
    });

    // hideLoadingView();
    $spinner.hide();

    appendAsColumn(youtubeResults,'youtube');
    appendAsColumn(dailymotionResults,'dailymotion');
    appendAsColumn(vimeoResults,'vimeo');

    appendPaidResultsAsColumn(paidResults);



}

//////////////////////////////////////////////////////////////////////


function appendPaidResultsAsColumn(results){
    let rows = `<div class="row-sm mont-font paid-site-name"><strong>Pay To Watch</strong></div>`;
    const noResults =             
    `<div class="row-sm " 
        <div class="thumbnailIMG">
            <div class="caption">
                <strong class='title mont-font'>NO PAID RESULTS</strong>
            </div>
        </div>
    </div>`;
    const length = results.length;
    if(length != 0){
        for(let result of results){
            let sources = ``;
            for(let count = 0; count < result.sources.length; count++){
                const hostName = hostFromURL(result.sources[count]);
                sources += `<div class="mont-font paid-link"><strong>
                    <a href="${result.sources[count]}">&nbsp ${count + 1} &nbsp</a>
                </strong></div>`;

            }
            const row = 

            `<div class="row-sm " 

                <strong class='mont-font paid-site-name'>

                    <a href = "${result.sources[0]}">${result.site}</a>
                    
                    
                </strong><br>
                ${sources}

            </div>`;            

            rows += '<br>' + row;
        }
    } else {
        rows += noResults;
    }
    const column =  `<div class="col-sm"> ${rows} </div>`;
    $searchResults.append(column);
}

function appendAsColumn(tiles,site=tiles[0].site){
    let rows = `<div class="row-sm mont-font site-name"><strong>${site}</strong></div>`;
    // console.log(rows);
    for(let tile of tiles){
        const thumbnailRow = 
        `<div class="row-sm thumbnail" 
            data-url="${tile.video_url}" 
            data-id="${tile.video_id}"
            data-site="${tile.site}"
            data-title="${tile.title}">
            <div class="thumbnailIMG">
                <img src="${tile.thumbnail_url}" class="video-thumbnail">
                <div class="caption">
                    <strong class='title mont-font'>${tile.title}</strong>
                </div>
            </div>
        </div>`;
        rows += thumbnailRow;
    }
    const column =  `<div class="col-sm"> ${rows} </div>`;
    $searchResults.append(column);
}



function playVideo(src,title){
    console.log('src',src);
    const div = 
    `<div class="video-popup">
        <button type="button" 
            class="btn btn-danger btn-sm exit-button" 
            id='exit-button'>X
        </button>
        <iframe class="video-frame"
            frameborder="0" 
            type="text/html" 
            src="${src}" 
            allow="autoplay"
            allowfullscreen > 
        </iframe>
        <div>${title}</div>
    </div>`;
    $videoPlayer.append(div);
}

$searchButton.click(searchVideos);

$videoPlayer.click(function(e){
    e.preventDefault();
    const target = e.target;
    if(target.id = "exit-button"){
        hideVideo();
    }
});

$searchResults.click(function(e){

    // e.preventDefault();

    const target = e.target;
    const closest = target.closest('.thumbnail');


    // console.log('closest',closest.dataset['url']);

    if(!!closest){

        console.log('closest',closest.dataset['url']);

        const url = closest.dataset['url'];
        const title = closest.dataset['title'];
        console.log('strong',title);
        const id = closest.dataset['id'];
        console.log('id',id);
        const site = closest.dataset['site'];
        const src = getIframeSource(id,site);

        console.log(closest.dataset);

        showVideo();
        playVideo(src,title);

    }
});

function getIframeSource(id,site){
    switch (site){
        case 'dailymotion':
            // return dailymotion.getIframeSource(id);
            return `https://www.dailymotion.com/embed/video/${id}?autoplay=1`;
        case 'youtube':
            //return youtube.getIframeSource(id);
            return `https://www.youtube.com/embed/${id}`;
        case 'vimeo':
            // return vimeo.getIframeSource(id);
            return `https://player.vimeo.com/video${id}`;
    }
}
