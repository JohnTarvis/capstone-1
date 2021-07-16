const defaults = {
    width:240,
    height:240
}

function generateVideoEmbed(baseURL,videoId, w=200,h=200, displayName=''){
    return `<iframe width="${w}" height="${h}"
    src="${baseURL}/${videoId}"> ${displayName}
    </iframe>`;
}

class Video {
  constructor(videoId,videoURL,thumbnails,title='',site='',object = false){
    this.videoId = videoId;
    this.videoURL = videoURL;
    this.thumbnails = thumbnails;
    this.title = title;
    this.object = object;
    this.site = site;
  }
  
}

class VideoTile {
    constructor(videoId, videoURL,thumbnailURL,site,title='title',object = false){
        this.videoURL = videoURL;
        this.thumbnailURL = thumbnailURL;
        this.site = site;
        this.title = title;
        this.showSite = false;
        this.videoId = videoId;
        this.object = object;
    }
    setIframeSource(source){
      this.iframeSource = source;
    }
    insertInRow($Element){
      let top = ` 
        <a href="${this.videoURL}">
          <strong>${this.site}</strong>
        </a>`
      if(!this.showSite){top = `<hr>`;}
      const imageCol = 
      `<div class="col-md-2 thumbnail" 
        data-url="${this.videoURL}" 
        data-id="${this.videoId}"
        data-site="${this.site}"
        data-title="${this.title}">
          <div class="thumbnailIMG">
              ${top}
              <img src="${this.thumbnailURL}" alt="Lights" style="width:100%; height:100%;">
              <div class="caption">
                <strong class='title'>${this.title}</strong>
              </div>
          </div>
      </div>`;
      $Element.append(imageCol);
    }
    insertInCol($Element){
      let top = ` 
      <a href="${this.videoURL}">
        <strong>${this.site}</strong>
      </a>`
      if(!this.showSite){top = `<hr>`;}
      const imageRow = 
      `<div class="row-md-2 thumbnail" 
        data-url="${this.videoURL}" 
        data-id="${this.videoId}"
        data-site="${this.site}"
        data-title="${this.title}">
          <div class="thumbnailIMG">
              ${top}
              <img src="${this.thumbnailURL}" alt="Lights" style="width:100%; height:100%;">
              <div class="caption">
                <strong class='title'>${this.title}</strong>
              </div>
          </div>
      </div>`;
      $Element.append(imageRow);
    }
}

