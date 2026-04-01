'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore, CanvasNote } from '@/lib/store';
import { Plus, Trash2, Move, Type } from 'lucide-react';

const noteColors = [
  '#FEF3C7', // Yellow
  '#DBEAFE', // Blue
  '#DCFCE7', // Green
  '#FCE7F3', // Pink
  '#F3E8FF', // Purple
  '#FED7AA', // Orange
];

export default function CanvasPage() {
  const { canvasNotes, addCanvasNote, updateCanvasNote, deleteCanvasNote } =
    useStore();
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddNote = () => {
    const newNote: CanvasNote = {
      id: Date.now().toString(),
      content: 'Nueva idea...',
      x: 100,
      y: 100,
      color: noteColors[Math.floor(Math.random() * noteColors.length)],
      width: 200,
      height: 200,
      createdAt: new Date().toISOString(),
    };
    addCanvasNote(newNote);
  };

  const handleMouseDown = (e: React.MouseEvent, noteId: string) => {
    const note = canvasNotes.find((n) => n.id === noteId);
    if (!note) return;

    setSelectedNote(noteId);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - note.x,
      y: e.clientY - note.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !selectedNote) return;

    const note = canvasNotes.find((n) => n.id === selectedNote);
    if (!note) return;

    updateCanvasNote(selectedNote, {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, selectedNote, dragOffset]);

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Canvas de Ideas</h1>
          <p className="text-sm text-gray-600 mt-1">
            Espacio infinito para tu creatividad
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddNote}
            className="px-4 py-2 bg-hermes-600 text-white rounded-lg hover:bg-hermes-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Nota
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {canvasNotes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Type className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Tu canvas está vacío
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Añade tu primera nota para empezar a crear
              </p>
            </div>
          </div>
        ) : (
          canvasNotes.map((note) => (
            <div
              key={note.id}
              className={`absolute p-4 rounded-lg shadow-lg cursor-move ${
                selectedNote === note.id ? 'ring-2 ring-hermes-600' : ''
              }`}
              style={{
                left: `${note.x}px`,
                top: `${note.y}px`,
                width: `${note.width}px`,
                minHeight: `${note.height}px`,
                backgroundColor: note.color,
              }}
              onMouseDown={(e) => handleMouseDown(e, note.id)}
            >
              {/* Note Header */}
              <div className="flex items-center justify-between mb-2">
                <Move className="w-4 h-4 text-gray-600" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCanvasNote(note.id);
                  }}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Note Content */}
              <textarea
                value={note.content}
                onChange={(e) => {
                  e.stopPropagation();
                  updateCanvasNote(note.id, { content: e.target.value });
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full h-32 bg-transparent border-none outline-none resize-none text-gray-800 font-medium"
                placeholder="Escribe tu idea aquí..."
              />

              {/* Convert to Task Button */}
              <div className="mt-2 pt-2 border-t border-gray-400/20">
                <button className="text-xs text-gray-600 hover:text-hermes-600 font-medium">
                  → Convertir en tarea
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
