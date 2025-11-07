import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder
from typing import List, Dict
import numpy as np

def detect_anomalies(df: pd.DataFrame) -> List[Dict]:
    """
    Detect anomalies in invoice data using:
    1. Duplicate invoice_id detection
    2. Rule-based checks (amount > 10000)
    3. IsolationForest for anomaly scoring
    """
    anomalies = []
    
    # 1. Detect duplicate invoice_ids
    duplicates = df[df.duplicated(subset=['invoice_id'], keep=False)]
    for _, row in duplicates.iterrows():
        anomalies.append({
            'invoice_id': row['invoice_id'],
            'vendor': row['vendor'],
            'amount': float(row['amount']),
            'score': 1.0,
            'reason': 'Duplicate invoice_id detected'
        })
    
    # 2. Rule-based: Flag large amounts (> 10000)
    large_amounts = df[df['amount'] > 10000]
    for _, row in large_amounts.iterrows():
        # Only add if not already flagged as duplicate
        if row['invoice_id'] not in [a['invoice_id'] for a in anomalies]:
            anomalies.append({
                'invoice_id': row['invoice_id'],
                'vendor': row['vendor'],
                'amount': float(row['amount']),
                'score': 0.8,
                'reason': f'Large amount detected: ₹{row["amount"]:,.2f}'
            })
    
    # 3. IsolationForest for anomaly detection
    if len(df) > 1:  # Need at least 2 samples for IsolationForest
        # Prepare features: amount and encoded vendor
        le = LabelEncoder()
        df_encoded = df.copy()
        df_encoded['vendor_encoded'] = le.fit_transform(df['vendor'])
        
        # Features: amount and vendor_encoded
        features = df_encoded[['amount', 'vendor_encoded']].values
        
        # Fit IsolationForest
        iso_forest = IsolationForest(contamination=0.1, random_state=42)
        anomaly_scores = iso_forest.fit_predict(features)
        anomaly_scores_float = iso_forest.score_samples(features)
        
        # Flag anomalies (score = -1 means anomaly)
        for idx, (score, score_float) in enumerate(zip(anomaly_scores, anomaly_scores_float)):
            if score == -1:
                row = df.iloc[idx]
                # Normalize score to 0-1 range (lower is more anomalous)
                normalized_score = 1 - (1 / (1 + np.exp(-score_float)))
                
                # Only add if not already flagged
                if row['invoice_id'] not in [a['invoice_id'] for a in anomalies]:
                    anomalies.append({
                        'invoice_id': row['invoice_id'],
                        'vendor': row['vendor'],
                        'amount': float(row['amount']),
                        'score': float(normalized_score),
                        'reason': 'ML anomaly detection (IsolationForest)'
                    })
    
    return anomalies

