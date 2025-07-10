import uuid
from sqlalchemy.orm import Session
from models.diagram import Diagram, Bone
from dto.diagram import DiagramUpdateDTO


class DiagramDAO:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        diagrams = self.db.query(Diagram).all()
        for diagram in diagrams:
            self._filter_root_bones(diagram)
        return diagrams

    def get_by_id(self, diagram_id: str):
        diagram = self.db.query(Diagram).filter(Diagram.id == diagram_id).first()
        if diagram:
            self._filter_root_bones(diagram)
        return diagram

    def create_with_title(self, title: str):
        diagram = Diagram(
            id=str(uuid.uuid4()),
            title=title,
            createdBy="user",
            status=None,
            tags=[],
        )
        self.db.add(diagram)
        self.db.commit()
        self.db.refresh(diagram)
        return diagram

    def update_partial(self, diagram_id: str, dto: DiagramUpdateDTO):
        diagram = self.db.query(Diagram).filter(Diagram.id == diagram_id).first()
        if not diagram:
            return None

        for field, value in dto.dict(exclude_unset=True).items():
            if field == "bones":
                # Delete all existing bones
                for bone in diagram.bones:
                    self.db.delete(bone)
                self.db.flush()

                # Build new bone tree
                self._build_bones_from_update(value, diagram, parent_id=None)
            else:
                setattr(diagram, field, value)

        self.db.commit()
        self.db.refresh(diagram)

        # Filter bones to only root-level bones for response
        self._filter_root_bones(diagram)

        return diagram

    def delete(self, diagram_id: str):
        diagram = self.db.query(Diagram).filter(Diagram.id == diagram_id).first()
        if not diagram:
            return False
        self.db.delete(diagram)
        self.db.commit()
        return True

    def _build_bones_from_update(self, bones_data, diagram, parent_id=None):
        bones = []
        for bone_data in bones_data:
            bone_id = bone_data.get("id") or str(uuid.uuid4())
            bone = Bone(id=bone_id)

            bone.name = bone_data.get("name", "")
            bone.createdBy = bone_data.get("createdBy", "user")
            bone.diagram = diagram
            bone.parent_id = parent_id

            self.db.add(bone)  # <-- Add to DB session

            print(f"Creating bone: {bone.name}, id: {bone.id}, parent_id: {parent_id}")

            # Recursively build and add children
            children_data = bone_data.get("children", [])
            self._build_bones_from_update(children_data, diagram, parent_id=bone.id)

            bones.append(bone)

        return bones

    def _eager_load_bones(self, bones):
        for bone in bones:
            # This will recursively access children so they are loaded
            if bone.children:
                self._eager_load_bones(bone.children)

    def _filter_root_bones(self, diagram):
        # Keep only root bones (parent_id is None)
        root_bones = [bone for bone in diagram.bones if bone.parent_id is None]
        self._eager_load_bones(root_bones)
        diagram.bones = root_bones
