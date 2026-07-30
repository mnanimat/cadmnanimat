import { useEffect, useRef, useState } from 'react';
import { CADProject } from '../types/cad';

export function useAutoSave(project: CADProject, engineeringTitle: string, intervalMs = 30000) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const projectRef = useRef(project);
  const titleRef = useRef(engineeringTitle);

  useEffect(() => {
    projectRef.current = project;
    titleRef.current = engineeringTitle;
    setIsSaved(false);
  }, [project, engineeringTitle]);

  const saveToLocalStorage = () => {
    try {
      if (!projectRef.current) return;
      const dataToSave = {
        project: projectRef.current,
        title: titleRef.current,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('cadmnanimat_autosave', JSON.stringify(dataToSave));
      setLastSaved(new Date());
      setIsSaved(true);
    } catch (err) {
      console.error('Erro no salvamento automático para localStorage:', err);
    }
  };

  useEffect(() => {
    // Initial save on load / timer set
    const timer = setInterval(() => {
      saveToLocalStorage();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return {
    lastSaved,
    isSaved,
    saveNow: saveToLocalStorage
  };
}
