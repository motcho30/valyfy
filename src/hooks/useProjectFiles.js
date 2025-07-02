import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import projectService from '../services/projectService'

export const useProjectFiles = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()

  const saveGeneratedFile = async (projectId, fileName, fileType, content) => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to save files')
    }

    try {
      setLoading(true)
      setError(null)
      
      const savedFile = await projectService.saveGeneratedFile(
        projectId,
        fileName,
        fileType,
        content
      )
      
      return savedFile
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateGeneratedFile = async (fileId, content) => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to update files')
    }

    try {
      setLoading(true)
      setError(null)
      
      const updatedFile = await projectService.updateGeneratedFile(fileId, content)
      return updatedFile
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getProjectFiles = async (projectId) => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to fetch files')
    }

    try {
      setLoading(true)
      setError(null)
      
      const files = await projectService.getProjectFiles(projectId)
      return files
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteGeneratedFile = async (fileId) => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to delete files')
    }

    try {
      setLoading(true)
      setError(null)
      
      await projectService.deleteGeneratedFile(fileId)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    saveGeneratedFile,
    updateGeneratedFile,
    getProjectFiles,
    deleteGeneratedFile
  }
}

export default useProjectFiles