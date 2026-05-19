import requests
import json
import random

# Generate mock data for training
# We simulate a mix of normal voters (95%) and bot/fraudulent voters (5%)

training_data = []

# 1. Normal Voters (950 samples)
for _ in range(950):
    training_data.append({
        "time_to_vote_seconds": random.uniform(15.0, 120.0), # Takes 15s to 2 mins to vote
        "ip_vote_count_1h": random.randint(1, 3),            # Normal household (1-3 votes per IP)
        "user_vote_count_24h": 1,                            # Normal user votes once
        "is_known_proxy": 0                                  # No proxy
    })

# 2. Fraudulent Voters / Bots (50 samples)
for _ in range(50):
    training_data.append({
        "time_to_vote_seconds": random.uniform(0.1, 3.0),    # Bots vote incredibly fast
        "ip_vote_count_1h": random.randint(10, 50),          # Botnet hitting from same IP many times
        "user_vote_count_24h": random.randint(2, 5),         # Attempting multiple votes
        "is_known_proxy": random.choice([0, 1])              # Often uses proxies
    })

print(f"Generated {len(training_data)} training samples.")

# Send to API to train
url = "http://localhost:5001/api/v1/train-fraud"
headers = {"Content-Type": "application/json"}

print("Sending data to train Isolation Forest model...")
try:
    response = requests.post(url, data=json.dumps(training_data), headers=headers)
    if response.status_code == 200:
        print("Success:", response.json())
    else:
        print("Failed:", response.status_code, response.text)
except requests.exceptions.ConnectionError:
    print("Error: Could not connect to the API. Is it running on port 5001?")
