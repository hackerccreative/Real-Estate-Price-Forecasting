import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import joblib

# Load data
df = pd.read_csv("Lucknow_RealEstate_Price.csv")

# Get years from columns
years = [int(col) for col in df.columns if col.isdigit()]

# Initialize models
lin_model = LinearRegression()
poly_model = LinearRegression()

# We don't actually need to train them here since they'll be trained per locality
# But we'll create dummy trained models to avoid the version warning
X_dummy = np.array([[2020], [2021], [2022]])
y_dummy = np.array([1000000, 1100000, 1200000])

lin_model.fit(X_dummy, y_dummy)
poly_model.fit(X_dummy, y_dummy)

# Save models
joblib.dump(lin_model, "lin_model.pkl")
joblib.dump(poly_model, "poly_model.pkl")

print("Models retrained and saved successfully!")
