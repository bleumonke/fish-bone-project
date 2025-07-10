import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, TextField, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import TreeStructure from '../components/TreeStructure';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import { Bone } from '../types';
import IshikawaDiagram from '../components/IshikawaDiagram';
import { useDiagramStore } from '../store/useDiagramStore';

import { v4 as uuidv4 } from 'uuid';

const DiagramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    diagrams,
    updateDiagram,
    deleteDiagram,
    getDiagram,
    error,
  } = useDiagramStore();

  const diagram = diagrams.find((d) => d.id === id);

  const [bones, setBones] = useState<Bone[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) getDiagram(id);
  }, [id, getDiagram]);

  useEffect(() => {
    if (diagram) {
      setBones(diagram.bones);
      setTitleInput(diagram.title);
    }
  }, [diagram]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const deleteBoneById = useCallback(
    (nodes: Bone[], idToDelete: string): Bone[] =>
      nodes
        .filter((node) => node.id !== idToDelete)
        .map((node) => ({
          ...node,
          children: deleteBoneById(node.children ?? [], idToDelete),
        })),
    []
  );

  const updateBoneName = useCallback(
    (nodes: Bone[], idToUpdate: string, newName: string): Bone[] =>
      nodes.map((node) => ({
        ...node,
        name: node.id === idToUpdate ? newName : node.name,
        children: updateBoneName(node.children ?? [], idToUpdate, newName),
      })),
    []
  );

  const saveTitle = () => {
    if (!diagram) return;
    const trimmedTitle = titleInput.trim();
    if (!trimmedTitle) {
      resetTitleEditing();
      return;
    }
    if (trimmedTitle !== diagram.title) {
      updateDiagram(diagram.id, { title: trimmedTitle });
    }
    setIsEditingTitle(false);
  };

  const cancelEditing = () => {
    resetTitleEditing();
  };

  const resetTitleEditing = () => {
    setTitleInput(diagram?.title || '');
    setIsEditingTitle(false);
  };

  const handleTitleClick = () => {
    if (!isEditingTitle) {
      setIsEditingTitle(true);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') saveTitle();
    else if (e.key === 'Escape') cancelEditing();
  };

  const handleAddRootBone = () => {
    const newBone: Bone = {
      id: uuidv4(),
      name: 'New Bone',
      children: [],
      createdBy: 'user',
    };
    const updatedBones = [...bones, newBone];
    setBones(updatedBones);
    if (diagram) updateDiagram(diagram.id, { bones: updatedBones });
  };

  const handleAddChild = (parentId: string) => {
    const newChild: Bone = {
      id: uuidv4(),
      name: 'New Child Bone',
      children: [],
      createdBy: 'user',
      parentId,
    };

    const addChild = (list: Bone[]): Bone[] =>
      list.map((bone) => {
        if (bone.id === parentId) {
          return {
            ...bone,
            children: [...(bone.children || []), newChild],
          };
        }
        return {
          ...bone,
          children: addChild(bone.children || []),
        };
      });

    const updatedBones = addChild(bones);
    setBones(updatedBones);
    if (diagram) updateDiagram(diagram.id, { bones: updatedBones });
  };

  const handleDeleteBoneRequest = (boneId: string) => {
    setDeleteTarget(boneId);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || !diagram) return;
    const updatedBones = deleteBoneById(bones, deleteTarget);
    setBones(updatedBones);
    updateDiagram(diagram.id, { bones: updatedBones });
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleLabelChange = (id: string, newName: string) => {
    const updatedBones = updateBoneName(bones, id, newName);
    setBones(updatedBones);
    if (diagram) updateDiagram(diagram.id, { bones: updatedBones });
  };

  const handleDeleteDiagram = async () => {
    if (!diagram) return;
    await deleteDiagram(diagram.id);
    navigate('/');
  };

  if (!diagram) {
    return (
      <Box p={4}>
        <Typography variant="h6">Diagram not found</Typography>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 2, m: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Tooltip title="Go Back">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
        </Tooltip>
        <Tooltip title="Delete Diagram">
          <Button
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={handleDeleteDiagram}
            variant="outlined"
          >
            Delete
          </Button>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, cursor: 'pointer' }} onClick={handleTitleClick}>
        {isEditingTitle ? (
          <TextField
            inputRef={titleInputRef}
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={handleTitleKeyDown}
            size="medium"
            variant="outlined"
            sx={{ minWidth: 200 }}
            autoFocus
          />
        ) : (
          <Tooltip title="Click to edit title">
            <Typography variant="h5" sx={{ fontWeight: 'bold', userSelect: 'none' }}>
              {diagram.title}
            </Typography>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1, gap: 3, minHeight: 0, overflow: 'hidden' }}>
        <TreeStructure
          bones={bones}
          onAddRootBone={handleAddRootBone}
          onAddChild={handleAddChild}
          onDeleteBone={handleDeleteBoneRequest}
          onLabelChange={handleLabelChange}
        />
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            border: '1px solid #ccc',
            borderRadius: 2,
            bgcolor: '#f5f5f5',
            height: '80%',
            overflow: 'auto',
          }}
        >
          <IshikawaDiagram diagram={{ ...diagram, bones }} />
        </Box>
      </Box>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          Error: {error}
        </Typography>
      )}
    </Box>
  );
};

export default DiagramDetail;
