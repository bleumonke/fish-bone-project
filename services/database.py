from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from contextlib import asynccontextmanager
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://subramanyammogili:password@localhost:5432/subramanyammogili")


engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

from models.diagram import Diagram, Bone

@asynccontextmanager
async def init_db(app):
    Base.metadata.create_all(bind=engine)
    yield