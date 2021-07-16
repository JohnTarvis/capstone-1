from typing import AsyncGenerator
from flask import *
from flask_debugtoolbar import *
from models import *
from forms import *
from werkzeug.utils import *

from apis import *

app = Flask(__name__)

if __name__ == 'app':
    try:
        app.run(host='0.0.0.0', port=8001 ,threaded=True)
    except:
        print('ERROR ERROR DANGER WILL ROBINSON!!!')


app.config["SECRET_KEY"] = "password"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///tubeumbrella_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#delete these later----------------------------------------------
UPLOAD_FOLDER = '/static/images'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# ----------------------------------------------------------------

toolbar = DebugToolbarExtension(app)
app.debug = True

connect_db(app)
db.create_all()

def add_to_database(video_result,search_phrase):
    """add video to database"""
    db.session.add_all(video_result, search_phrase)
    db.session.commit()

    

#--------------------------------------------------------------------

@app.route('/api/search/<search_phrase>',methods=['GET'])
def search(search_phrase):
    """
    search videos. 
    Start by combing the database for previous searches with this search term.  
    If there are results in the database, display those results
    to the user while new results are queried from selected sites in the background
    """

    phrase = Search_Phrase.query.filter_by(phrase = search_phrase).first()
    



    # print(f'phrase-id==================================={phrase_id}')

    if phrase is None:
        results = []
    
        phrase = Search_Phrase(phrase = search_phrase)
        db.session.add(phrase)
        db.session.commit()

        results = search_videos(search_phrase)

        for result in results:
            entry = result.make_database_entry()
            db.session.add(entry)
            db.session.commit()

            new_phrase_id = Search_Phrase.query.filter_by(phrase=search_phrase).first().id
            new_result_id = Video_Result.query.all()[-1].id

            # print(f'phrase id---------------------------{new_phrase_id}')

            phrase_result = Phrase_Result(  search_phrase_id = new_phrase_id, 
                                            search_result_id = new_result_id)

            db.session.add(phrase_result)
            db.session.commit()

    else:
        # results = []

        phrase_id = Search_Phrase.query.filter_by(phrase = search_phrase).first().id

        phrase_results = Phrase_Result.query.filter_by(search_phrase_id=phrase_id)

        results = [Video_Result.query.get(result.search_result_id) for result in phrase_results]

        # for result in phrase_results:
        #     results = results.append(Video_Result.query.get(result.search_result_id))


    serialized_results = [result.serialize() for result in results]
    return jsonify(serialized_results,200)



@app.route('/')
def home_page():
    return render_template('/videos/index.html')

