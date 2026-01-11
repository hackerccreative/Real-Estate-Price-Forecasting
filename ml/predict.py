import sys
import json
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
import os

# Set working directory to the script's directory to ensure file paths work
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def load_data():
    try:
        df = pd.read_csv("Lucknow_RealEstate_Price.csv")
        lin_model = joblib.load("lin_model.pkl")
        poly_model = joblib.load("poly_model.pkl")
        return df, lin_model, poly_model
    except Exception as e:
        print(json.dumps({"error": f"Error loading model or data: {str(e)}"}))
        sys.exit(1)

def get_localities(df):
    localities = list(df['Locality'].unique())
    return localities

def predict(df, lin_model, poly_model, locality, model_type, data):
    years = [int(col) for col in df.columns if col.isdigit()]
    
    # Find the row that matches the requested locality
    locality_rows = df[df['Locality'] == locality]
    if locality_rows.empty:
        return {"error": "Locality not found"}

    # Take the first row if multiple exist for the same locality name
    locality_row = locality_rows.iloc[[0]]

    # Extract historical data and clean it
    historical_data = []
    for year in years:
        try:
            price_str = locality_row[str(year)].values[0]
            price = float(str(price_str).replace('₹', '').replace(',', ''))
            historical_data.append({"year": year, "price": price})
        except (ValueError, IndexError) as e:
            return {"error": f"Error processing data for {locality}, year {year}. Error: {str(e)}"}

    # Prepare data for modeling
    X = np.array([item['year'] for item in historical_data]).reshape(-1, 1)
    y = np.array([item['price'] for item in historical_data])

    # Generate future years for prediction
    base_year = data.get('base_year')
    if base_year:
        start_year = int(base_year)
    else:
        start_year = max(years) + 1
        
    future_years = np.array(range(start_year, start_year + 5)).reshape(-1, 1)
    
    predicted_data = []

    if model_type == 'linear':
        lin_model.fit(X, y)
        future_predictions = lin_model.predict(future_years)
        for i, year in enumerate(future_years.flatten()):
            predicted_data.append({"year": int(year), "price": float(future_predictions[i])})

    elif model_type == 'polynomial':
        # Explicitly use Degree 3
        poly_features = PolynomialFeatures(degree=3, include_bias=False)
        X_poly = poly_features.fit_transform(X)
        
        # Use a fresh LinearRegression model to ensure no interference from loaded pipelines
        new_poly_model = LinearRegression()
        new_poly_model.fit(X_poly, y)
        
        future_years_poly = poly_features.transform(future_years)
        future_predictions = new_poly_model.predict(future_years_poly)
        
        for i, year in enumerate(future_years.flatten()):
            predicted_data.append({"year": int(year), "price": float(future_predictions[i])})
    
    else:
        return {"error": "Invalid model_type specified"}

    return {
        "historical_data": historical_data,
        "predicted_data": predicted_data,
        "model_used": "Polynomial (Degree 3)" if model_type == 'polynomial' else "Linear"
    }

if __name__ == "__main__":
    try:
        if len(sys.argv) > 1:
            input_json = sys.argv[1]
            data = json.loads(input_json)
        else:
            # Fallback for testing or pipe
            input_json = sys.stdin.read()
            if not input_json.strip():
                print(json.dumps({"error": "No input provided"}))
                sys.exit(1)
            data = json.loads(input_json)

        df, lin_model, poly_model = load_data()

        task = data.get("task", "predict") # Default to predict if not specified
        
        if task == "get_localities":
            result = {"localities": get_localities(df)}
        elif task == "predict":
            locality = data.get("locality")
            model_type = data.get("model_type")
            if not locality or not model_type:
                result = {"error": "Missing locality or model_type"}
            else:
                result = predict(df, lin_model, poly_model, locality, model_type, data)
        else:
            result = {"error": "Invalid task"}

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}))
        sys.exit(1)
