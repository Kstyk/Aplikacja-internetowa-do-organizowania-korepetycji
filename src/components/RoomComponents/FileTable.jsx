import React from "react";
import dayjs from "dayjs";
import { BsThreeDots } from "react-icons/bs";

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
  } = props;

  return (
    <div className="container mx-auto text-gray-100">
      <div className="btn-actions flex justify-between gap-x-1 border-y-[1px] border-gray-700 border-opacity-20">
        <div className="hidden md:flex text-black uppercase font-bold text-xs border-none items-center">
          Co zrobić z zaznaczonymi plikami
        </div>
        <section>
          <button
            onClick={() => deleteSelected()}
            className="btn bg-transparent rounded-none hover:bg-transparent h-[30px] min-h-0 text-xs border-none hover:text-sm transition-all duration-300"
          >
            Usuń wybrane
          </button>
          <button
            onClick={() => handleDownloadFewFiles()}
            className="btn bg-transparent rounded-none hover:bg-transparent h-[30px] min-h-0 text-xs border-none hover:text-sm transition-all duration-300"
          >
            Pobierz wybrane
          </button>
        </section>
      </div>
      <div className="flex flex-col  text-xs">
        <div className="flex items-center justify-center text-left bg-transparent text-gray-700 border-b border-opacity-60 border-gray-700">
          <div className="flex items-center justify-center w-8 px-2 py-3 sm:p-3">
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
            className="flex-1 px-2 py-3 sm:p-3 cursor-pointer hover:font-bold transition-all duration-300"
            onClick={() => reloadFiles("file_name")}
            title="Sortuj po nazwie pliku"
          >
            Plik
          </div>
          <div
            className="hidden w-32 px-2 py-3 text-left sm:p-3 sm:block cursor-pointer hover:font-bold transition-all duration-300"
            title="Sortuj po autorze"
            onClick={() => reloadFiles("owner")}
          >
            Autor
          </div>
          <div
            className="hidden w-24 px-2 py-3 text-left sm:p-3 sm:block cursor-pointer hover:font-bold transition-all duration-300"
            onClick={() => reloadFiles("upload_date")}
            title="Sortuj po dacie dodanie"
          >
            Wysłane
          </div>
          <div className="w-12 sm:w-24 px-2 py-3 text-center sm:p-3">Akcje</div>
        </div>
        {files.length == 0 && (
          <span className="text-black italic text-center mt-3">
            Brak plików.
          </span>
        )}
        {files?.map((file) => (
          <div
            key={file.id}
            className="flex border-b border-opacity-20 border-gray-700 bg-transparent text-black hover:bg-slate-100 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-8 px-2 py-3 sm:p-3">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                name="selectedFiles"
                onChange={(e) => {
                  handleSelectFile(file, e.target.checked);
                }}
                checked={selectedFiles?.some((f) => f.id == file.id)}
              />
            </div>
            <div
              onClick={() => showFile(file)}
              className="flex flex-1 items-center px-2 py-3 truncate sm:p-3 sm:w-auto cursor-pointer"
            >
              <span>{file.file_name}</span>
            </div>
            <div className="hidden w-32 px-2 py-3 sm:p-3 sm:block">
              <p>
                {file?.owner?.first_name} {file?.owner?.last_name}
              </p>
            </div>
            <div className="hidden w-24 px-2 py-3 text-right sm:p-3 sm:block text-gray-400">
              <p> {dayjs(file?.upload_date).format("YYYY-MM-DD, HH:mm")}</p>
            </div>
            <div className="w-12 sm:w-24 px-2 py-3 text-right sm:p-3 text-gray-400">
              <div className="w-full flex justify-center items-center dropdown dropdown-left">
                <label tabIndex={0}>
                  <BsThreeDots />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 bg-white rounded-none shadow-md w-52 border-t-2 border-base-200"
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
  );
};

export default FileTable;
