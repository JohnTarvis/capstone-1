from flask_sqlalchemy import *

db = SQLAlchemy()

def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)

class Search_Phrase(db.Model):
    '''search phrase to find results'''
    __tablename__ = 'search_phrases'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    phrase = db.Column(db.Text, nullable=False)

class Video_Result(db.Model):
    '''results stored for faster display'''
    __tablename__ = 'video_results'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    video_url = db.Column(db.Text, nullable=False)
    thumbnail_url = db.Column(db.Text, nullable=False)
    site = db.Column(db.Text, nullable=False)
    show_site = db.Column(db.Boolean, nullable=False)
    video_id = db.Column(db.Text, nullable=False)   
    paid = db.Column(db.Boolean, nullable = False)
    description = db.Column(db.Text)
    title = db.Column(db.Text)

    def serialize(self):
        return {
            'id':self.id,
            'video_url':self.video_url,
            'thumbnail_url':self.thumbnail_url,
            'site':self.site,
            'show_site':self.show_site,
            'video_id':self.video_id,
            'paid':self.paid,
            'description':self.description,
            'title':self.title
        }

        # this.videoURL = videoURL;
        # this.thumbnailURL = thumbnailURL;
        # this.site = site;
        # this.title = title;
        # this.showSite = false;
        # this.videoId = videoId;
        # this.object = object;

    # object = db.Column(db.Text, nullable=False)
    # sources = db.Column(db.Text, nullable = False)

class Phrase_Result(db.Model):
    """Connect Results with Search Terms"""
    __tablename__ = "phrase_results"
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    search_phrase_id = db.Column(db.Integer, db.ForeignKey('search_phrases.id'), primary_key=True)
    search_result_id = db.Column(db.Integer, db.ForeignKey('video_results.id'), primary_key=True)


    
# class Tag(db.Model):
# '''cupcake'''
# __tablename__ = 'tags'
# id = db.Column(db.Integer, primary_key=True,autoincrement=True)
# name = db.Column(db.Text, nullable=False)

# def serialize(self):
#     return {
#         'id':self.id,
#         'flavor':self.flavor,
#         'size':self.size,
#         'rating':self.rating,
#         'image':self.image
# }