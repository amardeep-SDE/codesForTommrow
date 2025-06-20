import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    id: 1,
    name: "Documents",
    type: "folder",
    children: [
      {
        id: 2,
        name: "Resume.pdf",
        type: "file",
      },
      {
        id: 3,
        name: "Projects",
        type: "folder",
        children: [
          {
            id: 4,
            name: "Project1.docx",
            type: "file",
          },
        ],
      },
    ],
  },
];

let idCounter = 5;

const updateTree = (nodes, callback) =>
  nodes.map((node) => {
    const updated = callback(node);
    if (updated) return updated;
    if (node.children) {
      node.children = updateTree(node.children, callback);
    }

    return node;
  });

const removeNode = (nodes, id) => {
  return nodes.filter((node) => {
    if (node.id === id) return false;
    if (node.children) node.children = removeNode(node.children, id);

    return true;
  });
};

const fileSystemSlice = createSlice({
  name: "fileSystem",
  initialState,
  reducers: {
    addNode: (state, action) => {
      const { parentId } = action.payload;
      const newNode = { id: idCounter++, name: "New Node", type: "file" };

      const newState = updateTree(state, (node) => {
        if (node.id === parentId && node.type === "folder") {
          node.children = [...(node.children || []), newNode];
          return node;
        }
        return null;
      });

      state.length = 0;
      state.push(...newState);
    },
    deleteNode: (state, action) => {
      const { id } = action.payload;
      const newState = removeNode(state, id);
      state.length = 0;
      state.push(...newState);
    },
    renameNode: (state, action) => {
      const { id, newName } = action.payload;

      const newState = updateTree(state, (node) => {
        if (node.id === id) {
          node.name = newName;
          return node;
        }
        return null;
      });
      state.length = 0;
      state.push(...newState);
    },
    moveNode: (state, action) => {
      const { draggedId, targetId } = action.payload;
      let draggedNode = null;

      const removeNode = (nodes) => {
        return nodes.filter((node) => {
          if (node.id === draggedId) {
            draggedNode = node;
            return false; 
          }
          if (node.children) {
            node.children = removeNode(node.children);
          }
          return true;
        });
      };
      const insertNode = (nodes) => {
        for (let node of nodes) {
          if (node.id === targetId && node.type === "folder") {
           if(!node.children) {
              node.children = [];
            }
            node.children.push(draggedNode);
            return;
          }
          if (node.children) insertNode(node.children);
        }
      };
      const newTree = removeNode([...state]);
      if (draggedNode) {
        insertNode(newTree);
      }
     state.splice(0, state.length, ...newTree);
    },
  },
});

export const { addNode, deleteNode, renameNode, moveNode } =
  fileSystemSlice.actions;
export default fileSystemSlice.reducer;
