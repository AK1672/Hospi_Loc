from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Hospital
from . import db
import json

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
def home():
    return render_template("home.html", user=current_user)


@views.route('/delete-note', methods=['POST'])
def delete_note():  
    note = json.loads(request.data) 
    noteId = note['noteId']
    note = Hospital.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()

    return jsonify({})

@views.route('/show-hosp', methods=['POST'])
def show_hosp(): 
    locid = json.loads(request.data) 
    lat = locid['lat']
    lon = locid['lon']
    hosp = Hospital.query.filter(Hospital.lat >= float(lat)-2, Hospital.lat <= float(lat)+2,Hospital.long >= float(lon)-2, Hospital.long <= float(lon)+2).all()
    hosp_data =[{'name': hosp.name, 'lat': hosp.lat, 'long':hosp.long} for hosp in hosp]
    return jsonify(hosp_data)


@views.route('/find_hospital', methods=['GET', 'POST'])
def find_hospital():
    return render_template("find_hospital.html", user=current_user)



@views.route('/add_hosp', methods=['GET', 'POST'])
def add_hosp():
    if request.method == 'POST': 
        name = request.form.get('Name')
        lat = request.form.get('Latitude')
        long = request.form.get('Longitude')

        new_note = Hospital(name=name, lat=lat, long=long, user_id=current_user.id)  
        db.session.add(new_note) 
        db.session.commit()
        flash('Hospital added!', category='success')

    return render_template("add_hosp.html", user=current_user)