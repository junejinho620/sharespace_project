from flask import Flask, request, jsonify
from model_loader import *

app = Flask(__name__)

@app.route('/match_profiles', methods=['POST'])
def match_profiles():
    data = request.get_json()
    profiles = data.get("profiles", {})
    
    #result = find_best_matches(profiles)
    result = find_similarity_matrix(profiles)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
