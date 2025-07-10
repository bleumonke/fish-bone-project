import uuid
import enum
from sqlalchemy import Column, String, ForeignKey, Enum, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from database import Base

class StatusEnum(str, enum.Enum):
    Published = "Published"
    Draft = "Draft"
    Archived = "Archived"

class Diagram(Base):
    __tablename__ = "diagrams"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    createdBy = Column(String, nullable=False)
    status = Column(Enum(StatusEnum), nullable=True)
    tags = Column(ARRAY(String), nullable=True)
    createdAt = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
    bones = relationship("Bone", back_populates="diagram", cascade="all, delete-orphan")

class Bone(Base):
    __tablename__ = "bones"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    createdBy = Column(String, nullable=False)
    diagram_id = Column(String, ForeignKey("diagrams.id"), nullable=False)
    parent_id = Column(String, ForeignKey("bones.id"), nullable=True)

    diagram = relationship("Diagram", back_populates="bones")
    parent = relationship("Bone", remote_side=[id], backref="children")