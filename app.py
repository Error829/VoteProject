from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

# 确保数据文件存在
if not os.path.exists('data'):
    os.makedirs('data')
    
VOTES_FILE = 'data/votes.json'

# 初始化投票数据
def init_votes():
    if not os.path.exists(VOTES_FILE):
        initial_data = {
            "candidate1": {"name": "选手1", "votes": 0, "image": "你的图片1.jpg"},
            "candidate2": {"name": "选手2", "votes": 0, "image": "你的图片2.jpg"},
            "candidate3": {"name": "选手3", "votes": 0, "image": "你的图片3.jpg"}
        }
        with open(VOTES_FILE, 'w', encoding='utf-8') as f:
            json.dump(initial_data, f, ensure_ascii=False)

init_votes()

@app.route('/')
def index():
    with open(VOTES_FILE, 'r', encoding='utf-8') as f:
        votes_data = json.load(f)
    return render_template('index.html', candidates=votes_data)

@app.route('/ranking')
def ranking():
    with open(VOTES_FILE, 'r', encoding='utf-8') as f:
        votes_data = json.load(f)
    return render_template('ranking.html', candidates=votes_data)

@app.route('/vote/<candidate_id>', methods=['POST'])
def vote(candidate_id):
    with open(VOTES_FILE, 'r', encoding='utf-8') as f:
        votes_data = json.load(f)
    
    if candidate_id in votes_data:
        votes_data[candidate_id]['votes'] += 1
        
        with open(VOTES_FILE, 'w', encoding='utf-8') as f:
            json.dump(votes_data, f, ensure_ascii=False)
        
        return jsonify({"success": True, "votes": votes_data[candidate_id]['votes']})
    return jsonify({"success": False})

if __name__ == '__main__':
    app.run(host='0.0.0.0',port='8888')