import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';
import Loading from '../Components/Loading';
import BuilderHeader from '../Components/BuilderHeader';

const Builder = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [leftTab, setLeftTab] = useState("chat");
  const [publishing, setPublishing] = useState(false);
  const [publishURL, setPublishURL] = useState(null);

  const {activeProject, loadingActiveProject, activeFile, showCode, setActiveFile, setShowCode, loadProject, logout} = useAppContext();

  useEffect(() => {

    if(!id) return;
    loadProject(id);
  }, [id, loadProject]);

  useEffect(() => {

    if(!id || !activeProject) return;
    if(activeProject.status === "pending" || activeProject.status === "generating") {
      const interval = setInterval(() => {
        loadProject(id, true)
      }, 1500)

      return () => clearInterval(interval);
    }

  }, [id, loadProject, activeProject]);

  if(loadingActiveProject || !activeProject) {
    return <Loading />
  }

  return (
    <div className='h-screen flex flex-col bg-white overflow-hidden text-zinc-900 relative'>
      
      {/* Top Bar Header */}
      <BuilderHeader/>
    </div>
  )
}

export default Builder
