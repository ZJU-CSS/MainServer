from flask import Flask
import pandas as pd
from flask import jsonify
from flask_cors import *
import socket
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

    # for i in dic[time]:
    result=[]

    list = time.split(':')
    if len(list)==1:
        list.append(int(list[0]))
    if len(list) > 1:
        for i in range(int(list[0]),int(list[1])+1,1):
            for route in dic[str(i)+':00:00']:
                result.append(route+','+str(i))
    # print(len(dic[time]))
    return jsonify(result)

if __name__=='__main__':

    hostname = socket.gethostname()
    # 获取本机IP1111
    ip = socket.gethostbyname(hostname)
    print(ip)
    app.run(host=ip,port=8888,debug=False)
