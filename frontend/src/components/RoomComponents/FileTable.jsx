import React from 'react'
import dayjs from 'dayjs'
import { BsThreeDots } from 'react-icons/bs'

const FileTable = (props) => {
  const {
    files,
    handleDownload,
    showFile,
    handleSelectFile,
    deleteSelected,
    setSelectedFiles,
    selectedFiles,
    handleDeleteSingleFile,
    handleDownloadFewFiles,
    reloadFiles,
  } = props

  return (
    <div className="container mx-auto text-gray-100">
      <div className="btn-actions flex justify-between gap-x-1 border-y-[1px] border-gray-700 border-opacity-20">
        <div className="hidden items-center border-none text-xs font-bold uppercase text-black md:flex">
          Co zrobić z zaznaczonymi plikami
        </div>
        <section>
          <button
            onClick={() => deleteSelected()}
            className="btn h-[30px] min-h-0 rounded-none border-none bg-transparent text-xs transition-all duration-300 hover:bg-transparent hover:text-sm"
          >
            Usuń wybrane
          </button>
          <button
            onClick={() => handleDownloadFewFiles()}
            className="btn h-[30px] min-h-0 rounded-none border-none bg-transparent text-xs transition-all duration-300 hover:bg-transparent hover:text-sm"
          >
            Pobierz wybrane
          </button>
        </section>
      </div>
      <div className="flex flex-col  text-xs">
        <div className="flex items-center justify-center border-b border-gray-700 border-opacity-60 bg-transparent text-left text-gray-700">
          <div className="flex w-8 items-center justify-center px-2 py-3 sm:p-3">
            <input
              type="checkbox"
              name="All"
              className="checkbox checkbox-sm"
              onChange={(e) =>
                e.target.checked
                  ? setSelectedFiles(files)
                  : setSelectedFiles([])
              }
            />
          </div>
          <div
            className="flex-1 cursor-pointer px-2 py-3 transition-all duration-300 hover:font-bold sm:p-3"
            onClick={() => reloadFiles('file_name')}
            title="Sortuj po nazwie pliku"
          >
            Plik
          </div>
          <div
            className="hidden w-32 cursor-pointer px-2 py-3 text-left transition-all duration-300 hover:font-bold sm:block sm:p-3"
            title="Sortuj po autorze"
            onClick={() => reloadFiles('owner')}
          >
            Autor
          </div>
          <div
            className="hidden w-24 cursor-pointer px-2 py-3 text-left transition-all duration-300 hover:font-bold sm:block sm:p-3"
            onClick={() => reloadFiles('upload_date')}
            title="Sortuj po dacie dodanie"
          >
            Wysłane
          </div>
          <div className="w-12 px-2 py-3 text-center sm:w-24 sm:p-3">Akcje</div>
        </div>
        {files.length == 0 && (
          <span className="mt-3 text-center italic text-black">
            Brak plików.
          </span>
        )}
        {files?.map((file) => (
          <div
            key={file.id}
            className="flex border-b border-gray-700 border-opacity-20 bg-transparent text-black transition-all duration-200 hover:bg-slate-100"
          >
            <div className="flex w-8 items-center justify-center px-2 py-3 sm:p-3">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                name="selectedFiles"
                onChange={(e) => {
                  handleSelectFile(file, e.target.checked)
                }}
                checked={selectedFiles?.some((f) => f.id == file.id)}
              />
            </div>
            <div
              onClick={() => showFile(file)}
              className="flex flex-1 cursor-pointer items-center truncate px-2 py-3 sm:w-auto sm:p-3"
            >
              <span>{file.file_name}</span>
            </div>
            <div className="hidden w-32 px-2 py-3 sm:block sm:p-3">
              <p>
                {file?.owner?.first_name} {file?.owner?.last_name}
              </p>
            </div>
            <div className="hidden w-24 px-2 py-3 text-right text-gray-400 sm:block sm:p-3">
              <p> {dayjs(file?.upload_date).format('YYYY-MM-DD, HH:mm')}</p>
            </div>
            <div className="w-12 px-2 py-3 text-right text-gray-400 sm:w-24 sm:p-3">
              <div className="dropdown-left dropdown flex w-full items-center justify-center">
                <label tabIndex={0}>
                  <BsThreeDots />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu z-[1] w-52 rounded-none border-t-2 border-base-200 bg-white p-2 shadow-md"
                >
                  <li onClick={() => handleDownload(file)}>
                    <button className="rounded-none">Pobierz</button>
                  </li>
                  <li onClick={() => handleDeleteSingleFile(file)}>
                    <button className="rounded-none">Usuń</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileTable
