# app.py
from flask import Flask, render_template, Response
from data import mock_students, mock_appointments, mock_availability, pending_assignments, action_plans
import io
import csv

app = Flask(__name__)

@app.route('/')
def dashboard():
    alerts_list = [s for s in mock_students if s['alertLevel'] in ['critical', 'high']]
    total_caseload = len(mock_students)
    at_risk_count = len([s for s in mock_students if s['alertLevel'] != 'none'])
    avg_mood = sum(s['averageMood'] for s in mock_students) / total_caseload if total_caseload > 0 else 0
    
    return render_template('dashboard.html', 
                           total_caseload=total_caseload,
                           at_risk_count=at_risk_count,
                           avg_mood=round(avg_mood, 1),
                           alerts=alerts_list,
                           appointments=mock_appointments,
                           pending_count=len(pending_assignments))

@app.route('/plans')
def plans():
    """SRS 4.0: Personalized roadmaps and progress tracking."""
    return render_template('plans.html', plans=action_plans)

@app.route('/caseload')
def caseload():
    return render_template('caseload.html', students=mock_students)

@app.route('/schedule')
def schedule():
    return render_template('schedule.html', appointments=mock_appointments)

@app.route('/availability')
def availability():
    return render_template('availability.html', slots=mock_availability)

@app.route('/assignments')
def assignments():
    return render_template('assignments.html', requests=pending_assignments)

@app.route('/export-data')
def export_data():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Student_ID', 'Major', 'Alert_Level', 'Avg_Mood'])
    for s in mock_students:
        writer.writerow([s['id'], s['major'], s['alertLevel'], s['averageMood']])
    
    response = Response(output.getvalue(), mimetype="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=counselor_report.csv"
    return response

if __name__ == '__main__':
    app.run(debug=True)