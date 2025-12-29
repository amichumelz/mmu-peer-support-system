from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template(
        "home.html",
        active_page="home"
    )

@app.route("/forum")
def forum():
    return render_template(
        "forum.html",
        active_page="forums"
    )

@app.route("/chats")
def chats():
    return render_template(
        "chats.html",
        active_page="chats"
    )

@app.route("/matchup")
def matchup():
    return render_template(
        "matchup.html",
        active_page="matchup"
    )

@app.route("/counselor")
def counselor():
    return render_template(
        "counselor.html",
        active_page="counselor"
    )

@app.route('/announcement')
def announcement():
    return render_template(
        'announcement.html', 
        active_page='announcement'
    
    )

@app.route('/profile')
def profile():
    return render_template(
        'profile.html', 
        active_page='profile'
    
    )

if __name__ == "__main__":
    app.run(debug=True)
