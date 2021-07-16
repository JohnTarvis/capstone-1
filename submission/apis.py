import json
from models import *
import requests
# import vimeo
import re

def get_site(site):
    back = re.sub("\.com.+","",(re.sub(".+www\.", "", site)))
    back = re.sub(".+//","",back)
    return back

def dailymotion_search(search_term, limit = 6):
    url = 'https://api.dailymotion.com/videos'
    params = {'search':search_term,'limit':limit}
    response = requests.get(url,params)
    JSON = response.json()
    json_text = response.text
    json_dict = json.loads(json_text)
    raw_video_data = json_dict['list']
    video_results = []
    for video in raw_video_data:
        video_id = video['id']
        video_url = f'https://www.dailymotion.com/video/{video_id}'  

        thumbnail_url_req = f'https://api.dailymotion.com/video/{video_id}?fields=thumbnail_480_url'
        thumbnail_response = requests.get(thumbnail_url_req)

        thumbnail_json = thumbnail_response.json()

        json_tn_text = thumbnail_response.text
        # print(f'response {json_tn_text}')

        json_tn_dict = json.loads(json_tn_text)
        # print(f'response {json_tn_dict}')

        thumbnail_url = json_tn_dict['thumbnail_480_url']

        title = video['title']
        description = 'dailymotion video'
        video_result_ = video_result('dailymotion',video_id,video_url,thumbnail_url,title,description)
        video_results.append(video_result_)
    return video_results[0:limit]

def youtube_search(search_term, limit = 6):
    api_key = 'AIzaSyABILuTbD68uo2ZU4MKY0lTw4RFzDSs2PE'
    url = 'https://www.googleapis.com/youtube/v3/search'
    params = {'part':'snippet', 'q':search_term, 'maxResults':limit, 'key':api_key}
    response = requests.get(url,params)
    JSON = response.json()
    json_text = response.text
    json_dict = json.loads(json_text)
    raw_video_data = json_dict['items']
    video_results = []
    for video in raw_video_data:
        if 'videoId' not in video['id']:
            continue
        if video['kind'] == 'youtube#searchResult':
            video_id = video['id']['videoId']
            video_url = f'https://www.youtube.com/watch?v={id}'
            thumbnail_url = video['snippet']['thumbnails']['default']['url']
            title = video['snippet']['title']
            description = video['snippet']['description']
            video_result_ = video_result('youtube',video_id,video_url,thumbnail_url,title,description)
            video_results.append(video_result_)
    # print(f'YOUTUBE -- {video_results}')
    return video_results[0:limit]

def vimeo_search(search_term, limit = 6):
    api_key = 'AIzaSyABILuTbD68uo2ZU4MKY0lTw4RFzDSs2PE'
    url = 'https://api.vimeo.com/videos'
    client_identifier = 'dd51c5c1b053aa43ea5fe4d6dbf3140a001299b7'
    client_secret = 'ed5Cyq92SC4LGYaDfHOoIv8ZBZxWAUW4qt1XB+n4YKHlEbuQACsAPpfryYY0WGtCWn/NlumrsiEV5M6ZypeXc7/J+90cobmEZjH8KArFIfZhQVt33ILgdWx+Vz0m24Zh'
    token = '2064193fee8f19769da5932f808365ed'
    authorization = f'bearer {token}'
    headers = {'Authorization':authorization}
    params = {'query':search_term,'per_page':6}
    response = requests.get(url,headers=headers,params=params)
    JSON = response.json()
    json_text = response.text
    json_dict = json.loads(json_text)
    raw_video_data = json_dict['data']
    video_results = []
    for video in raw_video_data:
        video_id = video['uri'].replace('/videos/','')
        video_url = video['link']
        thumbnail_url = video['pictures']['sizes'][3]['link']
        title = video['name']
        description = video['description']
        video_result_ = video_result('vimeo',video_id,video_url,thumbnail_url,title,description)
        video_results.append(video_result_)
    return video_results[0:limit]

def watchmode_search(search_term, limit = 6):
    url = 'https://api.watchmode.com/v1/search/'
    key = 'zKR3HiaUhxnU4UZ1iVtw1NfAtv2lu1Zkoz6GUsOi'
    params = {'apiKey':key,'search_field':'name','search_value':search_term}
    response = requests.get(url,params=params)
    JSON = response.json()
    json_text = response.text
    json_dict = json.loads(json_text)
    raw_video_data = json_dict['title_results']
    video_results = []
    for video in raw_video_data:
        video_id = video['id']
        source_api_url = f'https://api.watchmode.com/v1/title/{video_id}/sources/?apiKey={key}'
        sources_response = requests.get(source_api_url)
        sources_text = sources_response.text
        sources_dict = json.loads(sources_text)
        for source in sources_dict:
            source_id = source['source_id']
            thumbnail_url = ''
            title = video['name']
            description = ''
            video_url = source['web_url']
            site = get_site(video_url)
            video_result_ = video_result(site,source_id,video_url,thumbnail_url,title,description,True,True)
            video_results.append(video_result_)
    return video_results[0:limit * 2]

def search_videos(search_term,limit = 6):
    # print('searching')
    youtube_results = youtube_search(search_term,limit)
    dailymotion_results = dailymotion_search(search_term,limit)
    vimeo_results = vimeo_search(search_term,limit)
    watchmode_results = watchmode_search(search_term,limit)
    video_results = youtube_results + dailymotion_results + vimeo_results + watchmode_results
    return video_results




class video_result:
    def __init__(self,site,video_id,video_url,thumbnail_url,title = '',description = '',show_site = False,paid=False):
        self.paid = paid
        self.video_url = video_url
        self.thumbnail_url = thumbnail_url
        self.site = site
        self.show_site = show_site
        self.video_id = video_id
        self.title = title
        self.description = description

    def __str__(self):
        return f'''
            site:{self.site} 
            video_id:{self.video_id}
            video_url:{self.video_url}
            thumbnail_url:{self.thumbnail_url}
            title:{self.title}
            description:{self.description}
            show_site:{self.show_site}   
            paid:{self.paid}     
        '''

    def serialize(self):
        return {
            'site':self.site,
            'video_id':self.video_id,
            'video_url':self.video_url,
            'thumbnail_url':self.thumbnail_url,
            'title':self.title,
            'description':self.description,
            'show_site':self.show_site,   
            'paid':self.paid  
        }

    def make_database_entry(self):
        if not self.paid:
            self.paid = False
        result =  Video_Result(
            site=self.site,
            video_id=self.video_id,
            video_url=self.video_url,
            thumbnail_url=self.thumbnail_url,
            title=self.title,
            description=self.description,
            show_site=self.show_site,
            paid=self.paid)
        return result


# class video_result(db.Model):
#     '''results stored for faster display'''
#     __tablename__ = 'video_results'
#     id = db.Column(db.Integer, primary_key=True,autoincrement=True)
#     video_url = db.Column(db.Text, nullable=False)
#     thumbnail_url = db.Column(db.Text, nullable=False)
#     site = db.Column(db.Text, nullable=False)
#     show_site = db.Column(db.Boolean, nullable=False)
#     video_id = db.Column(db.Text, nullable=False)    
#     object = db.Column(db.Text, nullable=False)
#     sources = db.Column(db.Text, nullable = False)


# def vr_to_VR(video_result_):
#     back = Video_Result(video_id = video_result_.video_id, )
