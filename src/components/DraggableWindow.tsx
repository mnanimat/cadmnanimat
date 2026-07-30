import React, { useState, useRef } from 'react';
import { Minus, X, GripHorizontal } from 'lucide-react';

interface DraggableWindowProps {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  width?: string | number;
  height?: string | number;
  onClose?: () => void;
  className?: string;
  icon?: React.ReactNode;
  zIndex?: number;
  onFocus?: () => void;
}

export const DraggableWindow: React.FC<DraggableWindowProps> = ({
  id,
  title,
  children,
  defaultPosition = { x: 16, y: 16 },
  width,
  height,
  onClose,
  className = '',
  icon,
  zIndex = 20,
  onFocus
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Avoid dragging when clicking controls inside header
    if ((e.target as HTMLElement).closest('button, input, select, textarea')) return;
    if (onFocus) onFocus();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    const newX = Math.max(8, Math.min(window.innerWidth - 120, dragStartRef.current.posX + dx));
    const newY = Math.max(8, Math.min(window.innerHeight - 80, dragStartRef.current.posY + dy));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  return (
    <div
      onClick={onFocus}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: zIndex,
        width: width || 'auto',
        height: isMinimized ? 'auto' : (height || 'auto'),
      }}
      className={`bg-zinc-950/90 border border-zinc-800/90 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden flex flex-col font-sans text-xs transition-shadow ${
        isDragging ? 'shadow-sky-500/30 border-sky-500/60 ring-2 ring-sky-500/20' : ''
      } ${className}`}
    >
      {/* Dynamic Drag Handle Bar */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="h-9 px-3 bg-zinc-900/95 border-b border-zinc-800/80 flex items-center justify-between cursor-grab active:cursor-grabbing select-none text-zinc-200 font-bold"
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <GripHorizontal className="w-4 h-4 text-sky-400/70 hover:text-sky-300 flex-shrink-0" />
          {icon}
          <div className="truncate font-bold text-zinc-100">{title}</div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            title={isMinimized ? "Expandir Janela" : "Minimizar Janela"}
            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              title="Fechar Janela"
              className="p-1 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-lg transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Window Body */}
      {!isMinimized && (
        <div className="flex-1 overflow-auto max-h-[calc(100vh-140px)] scrollbar-none">
          {children}
        </div>
      )}
    </div>
  );
};
