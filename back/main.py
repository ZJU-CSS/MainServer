from flask import Flask
import pandas as pd
from flask import jsonify
from flask_cors import *
# data=[]
# with open('didi_data_feature.csv') as csvfile:
#     csv_reader=csv.reader(csvfile)
#     header=next(csvfile)
#     for row in csvfile:
#         data.append(row)

csv_data=pd.read_csv('didi_oneDay.csv')
print(csv_data)
dic={}
for index,value in enumerate(csv_data['DepTime']):
    if value in dic :
        dic[value].append(str(csv_data['Origin'][index])+','+str(csv_data['Destination'][index])+','+str(csv_data['Trips'][index]))
    else:
        dic[value]=[]
app= Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/data/<time>')
def get_data(time):
    result={}
    # for i in dic[time]:
    print(len(dic[time]))
    return jsonify([route for route in dic[time]])
