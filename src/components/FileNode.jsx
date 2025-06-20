import { useEffect, useState } from "react";
import { FaEdit, FaFile, FaFolder, FaPlus, FaTrash } from "react-icons/fa";

const FileNode = ({ node, onAdd, onDelete, onRename, searchTerm, onMove }) => {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const handleRename = () => {
    if (newName.trim() !== "") {
      onRename(node.id, newName);
    }
    setEditing(false);
  };

  const matchesSearch = (name) =>
    name.toLowerCase().includes(searchTerm?.toLowerCase());

  const childMatches = node.children?.some((child) =>
    matchesSearch(child.name)
  );
  const shouldShow =
    searchTerm === "" ||
    matchesSearch(node.name) ||
    (node.type === "folder" && (childMatches || node.children?.length > 0));

  useEffect(() => {
    if (searchTerm && node.type === "folder" && childMatches) {
      setExpanded(true);
    }
  }, [searchTerm]);
  if (!shouldShow) return null;

  return (
    <>
      <div
        className="ml-4 mt-1"
        draggable
        onDragStart={(e) => e.dataTransfer.setData("node/id", node.id)}
        onDrop={(e) => {
          const draggedId = parseInt(e.dataTransfer.getData("node/id"));
          console.log("draggedId", draggedId, "to", node.id);
          if (draggedId !== node.id && node.type === "folder")
            onMove(draggedId, node.id);
        }}
        onDragOver={(e) => {
          if (node.type === "folder") e.preventDefault();
        }}
      >
        <div className="flex items-center gap-2">
          <span
            onClick={() => setExpanded(!expanded)}
            className="cursor-pointer"
          >
            {node.type === "folder" ? <FaFolder /> : <FaFile />}
          </span>
          {editing ? (
            <input
              className="border p-1"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              autoFocus
            />
          ) : (
            <span>{node.name}</span>
          )}
          <button onClick={() => setEditing(true)}>
            <FaEdit />
          </button>
          <button onClick={() => onDelete(node.id)}>
            <FaTrash />
          </button>
          {node.type === "folder" && (
            <button onClick={() => onAdd(node.id)}>
              <FaPlus />
            </button>
          )}
        </div>
        {expanded && node.children && (
          <div className="ml-4">
            {node.children.map((child) => (
              <FileNode
                key={child.id}
                node={child}
                onAdd={onAdd}
                onDelete={onDelete}
                onRename={onRename}
                searchTerm={searchTerm}
                onMove={onMove}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FileNode;
