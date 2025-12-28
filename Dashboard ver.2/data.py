# data.py

mock_students = [
    {"id": "1", "name": "Alex Johnson", "avatar": "AJ", "averageMood": 4.2, "status": "In Session", "alertLevel": "critical", "lastActive": "2h ago", "major": "Psychology"},
    {"id": "2", "name": "Jordan Smith", "avatar": "JS", "averageMood": 5.8, "status": "Pending", "alertLevel": "high", "lastActive": "5h ago", "major": "Computer Science"},
    {"id": "3", "name": "Sam Wilson", "avatar": "SW", "averageMood": 7.1, "status": "Stable", "alertLevel": "medium", "lastActive": "1d ago", "major": "Engineering"},
    {"id": "4", "name": "Maya Rodriguez", "avatar": "MR", "averageMood": 8.5, "status": "Stable", "alertLevel": "none", "lastActive": "3h ago", "major": "Biology"}
]

mock_appointments = [
    {"id": "1", "studentName": "Maya Rodriguez", "time": "10:30 AM", "date": "2025-12-28", "duration": 45, "location": "Room 204", "type": "follow-up", "status": "scheduled"},
    {"id": "2", "studentName": "Alex Johnson", "time": "1:15 PM", "date": "2025-12-28", "duration": 60, "location": "Main Office", "type": "crisis", "status": "scheduled"},
]

mock_availability = [
    {"id": 1, "day": "Monday", "start_time": "09:00 AM", "end_time": "12:00 PM", "status": "Available"},
    {"id": 2, "day": "Wednesday", "start_time": "01:00 PM", "end_time": "04:00 PM", "status": "Available"},
]

pending_assignments = [
    {"id": "req_101", "name": "Casey Blair", "major": "Art History", "reason": "Academic Stress", "priority": "Medium"},
    {"id": "req_102", "name": "Riley Quinn", "major": "Physics", "reason": "Anxiety symptoms", "priority": "High"}
]

# New: Therapeutic Action Plans (SRS Section 4)
action_plans = [
    {
        "student_id": "1",
        "student_name": "Alex Johnson",
        "goal": "Reduce anxiety during exams",
        "progress": 45,
        "interventions": ["Mindfulness breathing", "Study schedule management"]
    },
    {
        "student_id": "3",
        "student_name": "Sam Wilson",
        "goal": "Improve social engagement",
        "progress": 70,
        "interventions": ["Join one campus club", "Weekly peer check-in"]
    }
]