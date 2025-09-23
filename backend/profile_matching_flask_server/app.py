from flask import Flask, request, jsonify
from model_loader import *
from fomi_matcher import match_fomi

app = Flask(__name__)

@app.route('/recommend_profiles', methods=['POST'])
def recommend_profiles():
    data = request.get_json()
    profiles = data.get("profiles", {})
    
    #result = find_best_recommendations(profiles)
    result = find_similarity_matrix(profiles)
    return jsonify(result)

@app.route('/api/match_fomi', methods=['POST'])
def match_fomi_route():
    try:
        user_answers = request.json  # Expected format: {"Q12": "a", "Q23": "b", ...}
        print("Incoming user answers:", user_answers)

        matched = match_fomi(user_answers)
        print("Matched Fomi:", matched)

        return jsonify({ "matchedFomi": matched }), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({ "error": str(e) }), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
