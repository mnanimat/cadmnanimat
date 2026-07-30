import React, { useState, useRef } from 'react';
import { Minus, X, GripHorizontal, Scaling } from 'lucide-react';

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
  theme?: 'dark' | 'light';
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
  onFocus,
  theme = 'dark'
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState<{ width?: number; height?: number }>({});
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const resizeStartRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);

  const isLight = theme === 'light';

  const handlePointerDown = (e: React.PointerEvent) => {
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
    const newY = Math.max(8, Math.min(window.innerHeight - 60, dragStartRef.current.posY + dy));

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

  // Resize Pointer Handlers
  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onFocus) onFocus();
    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: rect.width,
      startH: rect.height
    };
    setIsResizing(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!isResizing || !resizeStartRef.current) return;
    const dw = e.clientX - resizeStartRef.current.startX;
    const dh = e.clientY - resizeStartRef.current.startY;

    const newW = Math.max(260, Math.min(window.innerWidth - position.x - 10, resizeStartRef.current.startW + dw));
    const newH = Math.max(120, Math.min(window.innerHeight - position.y - 10, resizeStartRef.current.startH + dh));

    setSize({ width: newW, height: newH });
  };

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(false);
      resizeStartRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const effectiveWidth = size.width ? `${size.width}px` : (width || 'auto');
  const effectiveHeight = isMinimized ? 'auto' : (size.height ? `${size.height}px` : (height || 'auto'));
  const maxBodyHeight = size.height 
    ? size.height - 36 
    : Math.max(160, (typeof window !== 'undefined' ? window.innerHeight : 800) - position.y - 50);

  return (
    <div
      ref={windowRef}
      onClick={onFocus}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: zIndex,
        width: effectiveWidth,
        height: effectiveHeight,
        maxHeight: isMinimized ? 'auto' : `calc(100vh - ${Math.max(16, position.y + 16)}px)`,
      }}
      className={`rounded-2xl border backdrop-blur-md overflow-hidden flex flex-col font-sans text-xs transition-shadow relative ${
        isLight
          ? 'bg-white/95 border-slate-300 shadow-xl text-slate-800'
          : 'bg-zinc-950/90 border-zinc-800/90 shadow-2xl text-zinc-200'
      } ${
        isDragging || isResizing ? 'shadow-sky-500/30 border-sky-500/60 ring-2 ring-sky-500/20' : ''
      } ${className}`}
    >
      {/* Dynamic Drag Handle Bar */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`h-9 px-3 border-b flex items-center justify-between cursor-grab active:cursor-grabbing select-none font-bold ${
          isLight
            ? 'bg-slate-100/95 border-slate-300 text-slate-800'
            : 'bg-zinc-900/95 border-zinc-800/80 text-zinc-200'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <GripHorizontal className="w-4 h-4 text-sky-500/80 hover:text-sky-400 flex-shrink-0" />
          {icon}
          <div className={`truncate font-bold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>{title}</div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            title={isMinimized ? "Expandir Janela" : "Minimizar Janela"}
            className={`p-1 rounded-lg transition-all ${
              isLight ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              title="Fechar Janela"
              className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Window Body */}
      {!isMinimized && (
        <div 
          style={{ maxHeight: `${maxBodyHeight}px` }}
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-700 p-0.5 pb-8"
        >
          {children}
        </div>
      )}

      {/* Corner Resize Handle */}
      {!isMinimized && (
        <div
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          title="Arrastar para Redimensionar Janela"
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center text-zinc-500 hover:text-sky-400 transition-colors z-50 opacity-70 hover:opacity-100"
        >
          <Scaling className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};
