from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import PolynomialFeatures
import traceback

# Initialize FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the models and data
try:
    df = pd.read_csv("Lucknow_RealEstate_Price.csv")
    lin_model = joblib.load("lin_model.pkl")
    poly_model = joblib.load("poly_model.pkl")
    localities = list(df['Locality'].unique())
    years = [int(col) for col in df.columns if col.isdigit()]
except Exception as e:
    raise RuntimeError(f"Error loading model or data: {e}")

# Request body model
class TrendRequest(BaseModel):
    locality: str
    model_type: str # 'linear' or 'polynomial'

# Endpoints
@app.get("/localities")
async def get_localities():
    return {"localities": localities}

@app.post("/predict_trend")
async def predict_trend(request: TrendRequest):
    try:
        # Find the row that matches the requested locality
        locality_rows = df[df['Locality'] == request.locality]
        if locality_rows.empty:
            raise HTTPException(status_code=404, detail="Locality not found")

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
                error_detail = f"Error processing data for {request.locality}, year {year}. Price value was '{price_str}'. Error: {e}"
                raise HTTPException(status_code=400, detail=error_detail)


        # Prepare data for modeling
        X = np.array([item['year'] for item in historical_data]).reshape(-1, 1)
        y = np.array([item['price'] for item in historical_data])

        # Generate future years for prediction
        future_years = np.array(range(max(years) + 1, max(years) + 6)).reshape(-1, 1)
        
        predicted_data = []

        if request.model_type == 'linear':
            lin_model.fit(X, y)
            future_predictions = lin_model.predict(future_years)
            for i, year in enumerate(future_years.flatten()):
                predicted_data.append({"year": year, "price": future_predictions[i]})

        elif request.model_type == 'polynomial':
            # Assuming degree 3 polynomial features, which results in 4 features [1, x, x^2, x^3]
            poly_features = PolynomialFeatures(degree=3, include_bias=True)
            X_poly = poly_features.fit_transform(X)
            
            poly_model.fit(X_poly, y)
            
            future_years_poly = poly_features.transform(future_years)
            future_predictions = poly_model.predict(future_years_poly)
            
            for i, year in enumerate(future_years.flatten()):
                predicted_data.append({"year": year, "price": future_predictions[i]})
        
        else:
            raise HTTPException(status_code=400, detail="Invalid model_type specified")

        return {"historical_data": historical_data, "predicted_data": predicted_data, "model_used": request.model_type.capitalize()}

    except HTTPException as e:
        # Re-raise HTTPException to be caught by FastAPI's handler
        raise e
    except Exception as e:
        # Catch any other unexpected errors and return a detailed message
        tb = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}\nTraceback:\n{tb}")