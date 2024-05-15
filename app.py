from flask import Flask, request, jsonify, render_template
import requests
import json

app = Flask(__name__)

def get_google_suggestions(query):
    url = "http://suggestqueries.google.com/complete/search"
    params = {
        'client': 'firefox',
        'q': query
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        suggestions = json.loads(response.text)
        keywords = suggestions[1]
        return keywords
    except (requests.exceptions.RequestException, json.JSONDecodeError, IndexError) as e:
        return []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/suggest', methods=['GET'])
def suggest():
    query = request.args.get('q', '')
    if query:
        suggestions = get_google_suggestions(query)
        return jsonify(suggestions)
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
