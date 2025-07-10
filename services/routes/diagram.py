from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from dto.diagram import DiagramUpdateDTO, CreateDiagramDTO
from dao.diagram import DiagramDAO

router = APIRouter(prefix="/diagrams", tags=["diagrams"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_diagrams(db: Session = Depends(get_db)):
    return DiagramDAO(db).get_all()

@router.get("/{diagram_id}")
def get_diagram(diagram_id: str, db: Session = Depends(get_db)):
    diagram = DiagramDAO(db).get_by_id(diagram_id)
    if not diagram:
        raise HTTPException(status_code=404, detail="Diagram not found")
    return diagram

@router.post("/")
def create_diagram(diagram: CreateDiagramDTO, db: Session = Depends(get_db)):
    return DiagramDAO(db).create_with_title(title=diagram.title)

@router.patch("/{diagram_id}")
def patch_diagram(
    diagram_id: str,
    diagram: DiagramUpdateDTO,
    db: Session = Depends(get_db)
):
    updated = DiagramDAO(db).update_partial(diagram_id, diagram)
    if not updated:
        raise HTTPException(status_code=404, detail="Diagram not found")
    return updated

@router.delete("/{diagram_id}")
def delete_diagram(diagram_id: str, db: Session = Depends(get_db)):
    success = DiagramDAO(db).delete(diagram_id)
    if not success:
        raise HTTPException(status_code=404, detail="Diagram not found")
    return {"message": "Diagram deleted"}