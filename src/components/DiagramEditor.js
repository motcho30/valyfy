import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Save } from 'lucide-react';

let id = 1;
const getId = () => `dndnode_${id++}`;

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="border-r-2 border-slate-200 p-4 text-sm bg-slate-50 w-60">
      <div className="mb-4 text-slate-700 font-semibold">Controls</div>
      <div 
        className="p-3 border-2 border-dashed rounded-lg bg-white flex items-center justify-center cursor-grab text-slate-600 hover:bg-slate-100 hover:border-slate-400 transition-all duration-200"
        onDragStart={(event) => onDragStart(event, 'default')} 
        draggable
      >
        <Plus className="w-4 h-4 mr-2" /> Add Node
      </div>
    </aside>
  );
};

const Flow = ({ initialNodes, initialEdges, onSave: onSaveProp }) => {
  const reactFlowWrapper = useRef(null);
  const { setViewport } = useReactFlow();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `New Node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );
  
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      if (onSaveProp) {
        onSaveProp(flow);
      } else {
        console.log('Saved Flow:', JSON.stringify(flow, null, 2));
        alert('Diagram saved! Check the console for the data.');
      }
    }
  }, [reactFlowInstance, onSaveProp]);

  return (
    <div className="flex-grow h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Controls />
        <Background />
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onSave} 
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Diagram
          </button>
        </div>
      </ReactFlow>
    </div>
  );
};

const DiagramEditor = ({ initialNodes = [], initialEdges = [], onSave }) => {
  return (
    <div style={{ height: '100vh', width: '100%', background: '#f8f9fa', display: 'flex' }}>
      <ReactFlowProvider>
        <Sidebar />
        <Flow initialNodes={initialNodes} initialEdges={initialEdges} onSave={onSave} />
      </ReactFlowProvider>
    </div>
  );
};

export default DiagramEditor; 