import React from 'react';

export interface MenuItem {
  label: string;
  path: string;
  button?: boolean;
  icon?: React.ReactNode;
}

export interface Bone {
  id?: string;
  name: string;
  children?: Bone[];
  parentId?:string
  createdBy?: string;
}

export interface Diagram {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;  // optional, since old data may not have it
  status?: 'Draft' | 'Published' | 'Archived'; // optional, with limited set of strings
  tags?: string[];    // optional array of tags
  bones: Bone[];
}

export interface NotificationProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export type PartialDiagramUpdate = Partial<Pick<Diagram, 'title' | 'bones'>>;