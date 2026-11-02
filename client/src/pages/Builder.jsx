import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';
import Loading from '../Components/Loading';
import BuilderHeader from '../Components/BuilderHeader';
import { MessageSquareIcon } from 'lucide-react';
import ChatPanel from '../Components/ChatPanel';
import FileExplorer from '../Components/FileExplorer';

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
  }, [id]);

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

  const handleOpenPreview = () => {
    if(!id) return;
    window.open(`/preview/${id}`, "_blank")
  }

  const handlePublish = () => {

  }

  const handleDownload = () => {


  }

  return (
    <div className='h-screen flex flex-col bg-white overflow-hidden text-zinc-900 relative'>
      
      {/* Top Bar Header */}
      <BuilderHeader 
      projectName={activeProject.name}
      version={activeProject.version}
      showCode={showCode}
      publishing={publishing}
      onToggleShowCode={() => setShowCode(!showCode)}
      onOpenPreview={handleOpenPreview}
      onPublish={handlePublish}
      onDownload={handleDownload}
      onBack={() => navigate("/")}
      onLogout={logout}/>

      {/* Main Layout */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Left sidebar */}
        <div className='w-[320px] shrink-0 flex flex-col border-r border-zinc-200 bg-white'>
          {/* sidebar tabs */}
          <div className='flex border-b border-zinc-100'>
            <button onClick={() => setLeftTab("chat")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer ${leftTab === "chat" ? "text-zinc-900 border-b-2 border-zinc-900" : "text-zinc-400 hover:text-zinc-700"}`}>
              <MessageSquareIcon size={13}/> Chat
            </button>

            <button onClick={() => setLeftTab("files")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer ${leftTab === "files" ? "text-zinc-900 border-b-2 border-zinc-900" : "text-zinc-400 hover:text-zinc-700"}`}>
              <MessageSquareIcon size={13}/> Chat
            </button>
          </div>

          {/* Sidebar content */}
          <div className='flex-1 overflow-hidden'>
            {
              leftTab === "chat" ? 
              (
                <ChatPanel/>
              ) : (
                <FileExplorer/>
              )
            }
          </div>


        </div>
      </div>
    </div>

  )
}

export default Builder
