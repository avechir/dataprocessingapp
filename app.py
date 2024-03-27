from flask import Flask, request, send_file
from clusterizationfuntion import *
from meancalculationfuntion import *
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app, resources={r"/foo": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route("/clustering/<hasId>/<feature1>/<feature2>/<n_clusters>", methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type'])
def clusterplotting(hasId, feature1, feature2, n_clusters):
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        return 'No selected file'
    filename = file.filename
    print('feature1', feature1)
    print('feature2', feature2)
    print('filename', filename)
    kmeans_cluster = KMeansClustering(filename, bool(int(hasId)))
    image = kmeans_cluster.clusterizationFunction(feature1, feature2, int(n_clusters))
    kmeans_cluster = None
    return send_file(image, mimetype='image/png')
    
@app.route("/calculations/<hasId>", methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type'])
def characteristics_calc(hasId):
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        return 'No selected file'
    filename = file.filename
    datacharacteristics = DataCharacteristics(filename, bool(int(hasId)))
    mean = datacharacteristics.calculation()
    return mean