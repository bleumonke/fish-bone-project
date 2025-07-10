from fastapi import FastAPI
from routes import diagram
from fastapi.middleware.cors import CORSMiddleware
from database import init_db

app = FastAPI(
    lifespan=init_db
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(diagram.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}