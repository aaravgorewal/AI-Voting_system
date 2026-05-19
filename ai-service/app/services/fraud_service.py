import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

class FraudDetectionService:
    def __init__(self, model_path='fraud_model.pkl'):
        self.model_path = model_path
        self.model = None
        self._load_or_init_model()

    def _load_or_init_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        else:
            # Initialize with default parameters if model doesn't exist
            # Contamination is the expected proportion of outliers (fraud)
            self.model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
            # Train a dummy model just so it's ready, ideally you train it with real data
            dummy_data = np.random.rand(100, 4) 
            self.model.fit(dummy_data)
            joblib.dump(self.model, self.model_path)

    def train_model(self, training_data):
        """
        Train the Isolation Forest model.
        training_data: list of dicts with keys: 
        ['time_to_vote_seconds', 'ip_vote_count_1h', 'user_vote_count_24h', 'is_known_proxy']
        """
        df = pd.DataFrame(training_data)
        features = ['time_to_vote_seconds', 'ip_vote_count_1h', 'user_vote_count_24h', 'is_known_proxy']
        
        # Ensure we have the right features
        X = df[features].values
        
        # Fit the model
        self.model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
        self.model.fit(X)
        
        # Save model
        joblib.dump(self.model, self.model_path)
        return {"message": "Model trained successfully", "samples": len(X)}

    def analyze_vote(self, vote_data: dict) -> dict:
        """
        Analyze a single vote for fraud.
        vote_data expects: time_to_vote_seconds, ip_vote_count_1h, user_vote_count_24h, is_known_proxy (0 or 1)
        """
        features = [
            float(vote_data.get('time_to_vote_seconds', 30.0)),
            float(vote_data.get('ip_vote_count_1h', 1.0)),
            float(vote_data.get('user_vote_count_24h', 1.0)),
            float(vote_data.get('is_known_proxy', 0.0))
        ]
        
        X = np.array([features])
        
        # Predict: 1 for normal, -1 for anomaly (fraud)
        prediction = self.model.predict(X)[0]
        
        # Anomaly score: lower score -> more abnormal
        # We can map it to a fraud score 0-100 (where 100 is high fraud risk)
        score = self.model.score_samples(X)[0]
        # Typically scores are negative. E.g. -0.5 is very anomalous, -0.3 is less anomalous.
        # We normalize roughly to 0-100 for ease of use.
        normalized_fraud_score = max(0, min(100, (abs(score) - 0.3) * 200))
        
        is_fraudulent = bool(prediction == -1)
        
        # Heuristic overrides (if bot moves too fast or IP voted 100 times)
        if features[0] < 2.0 or features[1] > 20.0:
            is_fraudulent = True
            normalized_fraud_score = max(normalized_fraud_score, 90.0)

        return {
            "is_suspicious": is_fraudulent,
            "fraud_score": round(normalized_fraud_score, 2),
            "anomaly_score_raw": round(score, 4),
            "reason": "Anomaly detected by AI" if is_fraudulent else "Normal"
        }

fraud_service_instance = FraudDetectionService()
