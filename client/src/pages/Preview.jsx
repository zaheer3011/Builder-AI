import { useEffect } from 'react'
import { useParams } from "react-router-dom"
import Loading from '../Components/Loading';
import FullPagePreview from '../Components/FullPagePreview';
import { useAppContext } from '../context/AppContext';

const Preview = () => {

  const { id } = useParams()
  const {activeProject : project, loadingActiveProject : loading, loadProject} = useAppContext()

  useEffect(() => {

    if(id) {
      loadProject(id);
    }

  }, [id, loadProject])

  if(loading || !project) {
    return <Loading/>
  }

  return (
   <FullPagePreview />
  )
}

export default Preview
