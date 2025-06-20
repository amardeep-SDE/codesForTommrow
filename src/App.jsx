import { useDispatch, useSelector } from "react-redux";
import FileNode from "./components/FileNode";
import { addNode, deleteNode, moveNode, renameNode } from "./features/fileSystemSlice";
import { useState } from "react";

const App = () => {
  const dispatch = useDispatch();
  const treeData = useSelector((state) => state.fileSystem);

  const [searchTerm , setSearchTerm] = useState("");
  return (
    <>
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">React + Redux File Explorer</h1>
        <input
          type="text"
          placeholder="Search files or folders"
          className="border p-2 mb-4 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {treeData.map((node) => (
          <FileNode
            key={node.id}
            node={node}
            onAdd={(id) => dispatch(addNode({ parentId: id }))}
            onDelete={(id) => dispatch(deleteNode({ id }))}
            onRename={(id, newName) => dispatch(renameNode({ id, newName }))}
            searchTerm={searchTerm}
            onMove={({ draggedId, targetId }) => dispatch(moveNode({ draggedId, targetId }))} 
          />
        ))}
      </div>
    </>
  );
};
export default App;
