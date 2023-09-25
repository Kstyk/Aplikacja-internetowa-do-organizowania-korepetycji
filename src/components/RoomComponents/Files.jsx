import React, { useEffect, useState, useRef } from 'react'
import useAxios from '../../utils/useAxios'
import LoadingComponent from '../LoadingComponent'
import { ToastContainer, toast } from 'react-toastify'
import FileTable from './FileTable'
import './input.scss'

const Files = ({ roomId }) => {
  const api = useAxios()
  const inputFileRef = useRef(null)

  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadingFile, setUploadingFile] = useState(false)

  const [sortDirection, setSortDirection] = useState('desc')

  const [selectedFiles, setSelectedFiles] = useState([])

  const fetchFiles = async () => {
    setLoading(true)
    await api
      .get(`api/rooms/${roomId}/files/`)
      .then((res) => {
        setFiles(res.data)
      })
      .catch((err) => {
        if (err.response.status == 403) {
          toast.error('Nie masz dostępu do tego pokoju.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            className: 'bg-base-200',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        }
      })
    setLoading(false)
  }

  const reloadFiles = async (sortBy = '') => {
    if (sortBy != '') {
      if (sortDirection == 'asc') setSortDirection('desc')
      else setSortDirection('asc')
    }

    await api
      .get(
        `api/rooms/${roomId}/files/?direction=${sortDirection}&sort-by=${sortBy}`
      )
      .then((res) => {
        setFiles(res.data)
      })
      .catch((err) => {
        if (err.response.status == 403) {
          toast.error('Nie masz dostępu do tego pokoju.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            className: 'bg-base-200',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        }
      })
  }

  const handleSelectFile = (file, checked) => {
    checked
      ? setSelectedFiles((prev) => [...prev, file])
      : setSelectedFiles((prev) => prev.filter((f) => f.id !== file.id))
  }

  const deleteSelected = async () => {
    if (selectedFiles.length == 0) {
      return
    }

    const data = {
      files: selectedFiles,
    }

    await api
      .post(`api/rooms/file/delete/`, data)
      .then((res) => {
        setSelectedFiles([])
        if (res.status == 200) {
          toast.info('Pomyślnie usunięto pliki.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
          reloadFiles()
        }
      })
      .catch((err) => {
        if (err.response.status == 403) {
          toast.error('Nie masz dostępu do tego pokoju.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            className: 'bg-base-200',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        } else {
          toast.error('Nieudane usunięcie pliku.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            className: 'bg-base-200',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        }
      })
  }

  const handleDeleteSingleFile = async (file) => {
    const data = {
      files: [file],
    }

    await api
      .post(`api/rooms/file/delete/`, data)
      .then((res) => {
        setSelectedFiles([])
        if (res.status == 200) {
          toast.info('Pomyślnie usunięto plik.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
          reloadFiles()
        }
      })
      .catch((err) => {
        if (err.response.status == 403) {
          toast.error('Nie masz dostępu do tego pokoju.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            className: 'bg-base-200',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        } else {
          toast.error('Nieudane usunięcie pliku.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            className: 'bg-base-200',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        }
      })
  }

  const handleDownload = async (file) => {
    await api
      .get(`api/rooms/${roomId}/file/${file.id}/download/`, {
        responseType: 'blob',
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        if (typeof window.navigator.msSaveBlob === 'function') {
          window.navigator.msSaveBlob(res.data, file.file_name)
        } else {
          link.setAttribute('download', file.file_name)
          document.body.appendChild(link)
          link.click()
        }
      })
      .catch((err) => {
        if (err.response.status == 403) {
          toast.error('Nie masz dostępu do tego pokoju.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            className: 'bg-base-200',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        }
      })
  }

  const handleDownloadFewFiles = async () => {
    if (selectedFiles.length == 0) {
      return
    }

    const data = {
      files: selectedFiles,
    }

    await api
      .post(`api/rooms/${roomId}/download-files/`, data, {
        responseType: 'blob',
      })
      .then((res) => {
        console.log(res)
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        if (typeof window.navigator.msSaveBlob === 'function') {
          window.navigator.msSaveBlob(res.data, 'files.zip')
        } else {
          link.setAttribute('download', 'files.zip')
          document.body.appendChild(link)
          link.click()
        }
      })
      .catch((err) => {
        if (err.response.status == 403) {
          toast.error('Nie masz dostępu do tego pokoju.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            className: 'bg-base-200',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        }
      })
  }

  const showFile = async (file) => {
    await api
      .get(`api/rooms/file/${file.id}/show/`, {
        responseType: 'blob',
      })
      .then((res) => {
        const fileUrl = URL.createObjectURL(
          new Blob([res.data], { type: file.mimetype })
        )

        const newWindow = window.open(fileUrl, '_blank')

        if (newWindow) {
          setTimeout(function () {
            newWindow.document.title = file.file_name
          }, 500)
        }
      })
      .catch((err) => {
        if (err.response.status == 403) {
          toast.error('Nie masz dostępu do tego pokoju.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            className: 'bg-base-200',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        }
      })
  }

  const onSubmit = (data) => {
    setUploadingFile(true)
    api
      .post(`api/rooms/${roomId}/upload/`, data, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((res) => {
        setUploadingFile(false)
        toast.info('Pomyślnie dodano pliki.', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
        reloadFiles()
      })
      .catch((err) => {
        setUploadingFile(false)
        if (err.response.status == 403) {
          toast.error('Nie masz dostępu do tego pokoju.', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: true,
            className: 'bg-base-200',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        } else {
          toast.error(
            'Nieudany upload plików. Prawdopodobnie jeden z plików jest pusty.',
            {
              position: 'bottom-center',
              autoClose: 3000,
              hideProgressBar: true,
              className: 'bg-base-200',
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            }
          )
        }
      })
  }

  useEffect(() => {
    fetchFiles()
  }, [roomId])

  return (
    <div className="flex flex-col">
      {loading ? (
        <LoadingComponent message="Ładowanie informacji o plikach..." />
      ) : (
        <div className="card mt-10 min-h-[60vh] rounded-none bg-white p-6 shadow-xl">
          <form className="mx-auto flex h-[100px] w-full flex-col items-center justify-center space-y-4 max-md:w-full phone:h-full">
            <div className="file-input-container">
              <input
                type="file"
                id="files"
                multiple
                name="files"
                ref={inputFileRef}
                required
                onChange={(e) => onSubmit({ files: e.target.files })}
              />

              <label htmlFor="files" className="custom-file-button">
                <span className="text-xl font-bold uppercase tracking-wide phone:text-2xl">
                  Wybierz pliki
                </span>
                <span className="hidden phone:flex phone:flex-col phone:items-center">
                  <span className="text-sm uppercase text-slate-700">lub</span>
                  <span className="text-lg font-bold uppercase tracking-wide phone:text-xl">
                    Przeciągnij je tutaj
                  </span>
                </span>
              </label>
            </div>
          </form>
          <div className="my-5 border-b-2 border-gray-300"></div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-black">
            Dodane pliki
          </h2>
          <section className="relative mt-2">
            {uploadingFile && (
              <div className="absolute left-[50%] right-[50%] top-[20%]">
                <LoadingComponent message="Przesyłanie plików..." />
              </div>
            )}
            <div className={`${uploadingFile ? 'opacity-50' : 'opacity-1'}`}>
              <FileTable
                files={files}
                handleDownload={handleDownload}
                showFile={showFile}
                handleSelectFile={handleSelectFile}
                setSelectedFiles={setSelectedFiles}
                deleteSelected={deleteSelected}
                handleDownloadFewFiles={handleDownloadFewFiles}
                selectedFiles={selectedFiles}
                handleDeleteSingleFile={handleDeleteSingleFile}
                reloadFiles={reloadFiles}
              />
            </div>
          </section>
        </div>
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default Files
