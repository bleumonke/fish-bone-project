from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from contextlib import asynccontextmanager

DATABASE_URL = "postgresql+psycopg2://subramanyammogili:password@localhost:5432/subramanyammogili"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# Import all models here so they are registered before table creation
from models.diagram import Diagram, Bone

@asynccontextmanager
async def init_db(app):
    # This runs at startup
    Base.metadata.create_all(bind=engine)
    yield
    # You could put cleanup code here if needed
