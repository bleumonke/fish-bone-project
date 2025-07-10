import React, { useState, useMemo, useCallback } from 'react';
import { Box, Button, Typography, Tooltip } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import CustomTreeItem from './CustomTreeItem';
import { Bone } from '../types';

interface TreeStructureProps {
  bones: Bone[];
  onAddRootBone: () => void;
  onAddChild: (id: string) => void;
  onDeleteBone: (id: string) => void;
  onLabelChange: (id: string, newLabel: string) => void;
}

// Recursively transform bone nodes into tree view items
const renderBoneItems = (nodes?: Bone[]): any[] =>
  !nodes ? [] : nodes.map((bone) => ({
    id: bone.id,
    itemId: bone.id,
    label: bone.name,
    children: renderBoneItems(bone.children ?? []),
  }));

const TreeStructure: React.FC<TreeStructureProps> = ({
  bones,
  onAddRootBone,
  onAddChild,
  onDeleteBone,
  onLabelChange,
}) => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const items = useMemo(() => renderBoneItems(bones), [bones]);
  const rootIds = useMemo(() => new Set((bones ?? []).map((b) => b.id)), [bones]);

  // Custom renderer for each tree item
  const renderCustomTreeItem = useCallback(
    (props: any) => {
      const isRoot = rootIds.has(props.itemId);
      return (
        <CustomTreeItem
          {...props}
          id={props.itemId}
          isRoot={isRoot}
          onAddChild={onAddChild}
          onDeleteBone={onDeleteBone}
          onLabelChange={onLabelChange}
        />
      );
    },
    [rootIds, onAddChild, onDeleteBone, onLabelChange]
  );

  return (
    <Box
      sx={{
        width: '60%',
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '80%',
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1">Structure</Typography>
        <Tooltip title="Add root bone">
          <Button size="small" variant="outlined" onClick={onAddRootBone}>
            + Add
          </Button>
        </Tooltip>
      </Box>

      {/* Tree View */}
      <RichTreeView
        items={items}
        expandedItems={expanded}
        onExpandedItemsChange={(e, itemIds) => setExpanded(itemIds)}
        slots={{
          item: renderCustomTreeItem,
          expandIcon: ChevronRightIcon,
          collapseIcon: ExpandMoreIcon,
        }}
        sx={{ flexGrow: 1, overflowY: 'auto', my: 3 }}
      />
    </Box>
  );
};

export default TreeStructure;
