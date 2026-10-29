from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)  # JavaScript frontend se request allow karega

# PostgreSQL Database Connection
conn = psycopg2.connect(
    dbname="health_chatbot",
    user="postgres",
    password="root",
    host="localhost",
    port="5432"
)

@app.route("/get_suggestions", methods=["POST"])
def get_suggestions():
    data = request.json
    symptoms = [s.strip().lower() for s in data.get("symptoms", [])]

    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    cur = conn.cursor()
    query = """
        SELECT d.disease_name, m.medicine_name, h.tip, dt.specialization 
        FROM diseases d
        LEFT JOIN disease_symptoms ds ON d.id = ds.disease_id
        LEFT JOIN symptoms s ON ds.symptom_id = s.id
        LEFT JOIN medicines m ON d.id = m.id
        LEFT JOIN health_tips h ON h.id = (SELECT id FROM health_tips ORDER BY RANDOM() LIMIT 1)
        LEFT JOIN doctor_types dt ON dt.id = d.id
        WHERE LOWER(s.symptom_name) = ANY(%s)
        LIMIT 1
    """
    cur.execute(query, (symptoms,))
    result = cur.fetchone()
    
    if result:
        response = {
            "disease": result[0],
            "medicine": result[1],
            "healthTip": result[2],
            "doctorType": result[3]
        }
    else:
        response = {"message": "No match found"}

    cur.close()
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
