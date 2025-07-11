import React, {
  useState,
  useEffect,
  useRef,
  MouseEvent,
  KeyboardEvent,
} from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Tooltip,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';

interface CustomTreeItemProps {
  id: string;
  label: string;
  children?: React.ReactNode;
  isRoot: boolean;
  createdBy?: string;
  onAddChild: (id: string) => void;
  onDeleteBone: (id: string) => void;
  onLabelChange: (id: string, newLabel: string) => void;
}

const CustomTreeItem: React.FC<CustomTreeItemProps> = ({
  id,
  label,
  children,
  isRoot,
  createdBy = 'User',
  onAddChild,
  onDeleteBone,
  onLabelChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(label);
  }, [label]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleLabelDoubleClick = (e: MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const finishEditing = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== label) {
      onLabelChange(id, trimmedValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditValue(label);
      setIsEditing(false);
    }
  };

  const handleAddChildClick = (e: MouseEvent) => {
    e.stopPropagation();
    onAddChild(id);
  };

  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();
    onDeleteBone(id);
  };

  return (
    <TreeItem
      itemId={id}
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Left side: Label area */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              overflow: 'hidden',
              mr: 1,
              minWidth: 0,
            }}
          >
            <Tooltip title="Double-click to edit">
              <Box
                sx={{
                  flexGrow: 1,
                  minWidth: 0,
                  maxWidth: '100%',
                  cursor: 'pointer',
                  userSelect: 'text',
                }}
                onDoubleClick={handleLabelDoubleClick}
                onClick={(e) => e.stopPropagation()}
              >
                {isEditing ? (
                  <TextField
                    multiline
                    maxRows={4}
                    fullWidth
                    size="small"
                    inputRef={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={finishEditing}
                    onKeyDown={handleKeyDown}
                    variant="standard"
                  />
                ) : (
                  <Tooltip title={label}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ display: 'block' }}
                    >
                      {label}
                    </Typography>
                  </Tooltip>
                )}
              </Box>
            </Tooltip>
          </Box>

          {/* Right side: Action Buttons and User */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
            }}
          >
            <Tooltip title={`Created by ${createdBy}`}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: 12,
                  bgcolor: 'grey',
                }}
              >
                <PersonIcon sx={{ fontSize: 14 }} />
              </Avatar>
            </Tooltip>
            <Tooltip title="Add child">
              <IconButton size="small" onClick={handleAddChildClick}>
                <AddIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete bone">
              <IconButton size="small" onClick={handleDeleteClick}>
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      }
    >
      {children}
    </TreeItem>
  );
};

export default CustomTreeItem;