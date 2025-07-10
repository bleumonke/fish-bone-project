from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BoneChild(BaseModel):
    id: str
    name: str
    createdBy: str

    class Config:
        from_attributes = True

class Bone(BaseModel):
    id: str
    name: str
    createdBy: Optional[str]
    children: List[BoneChild] = []

    class Config:
        from_attributes = True

class CreateDiagramDTO(BaseModel):
    title: str
    createdBy: Optional[str] = "user"

    class Config:
        from_attributes = True

class DiagramDTO(BaseModel):
    id: str
    title: str
    createdBy: str
    createdAt: datetime
    updatedAt: datetime
    status: str
    tags: List[str]
    bones: List[Bone]

    class Config:
        from_attributes = True

class BoneChildUpdate(BaseModel):
    id: Optional[str] = None
    name: Optional[str]
    createdBy: Optional[str]
    children: Optional[List['BoneChildUpdate']] = []

    class Config:
        from_attributes = True

class BoneUpdate(BaseModel):
    id: Optional[str] = None
    name: Optional[str]
    createdBy: Optional[str]
    children: Optional[List[BoneChildUpdate]] = []

    class Config:
        from_attributes = True

class DiagramUpdateDTO(BaseModel):
    title: Optional[str] = None
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = None
    bones: Optional[List[BoneUpdate]] = None

    class Config:
        from_attributes = True

BoneChildUpdate.model_rebuild()