import React, { useEffect, useState, useRef } from "react";
import useAxios from "../../utils/useAxios";
import LoadingComponent from "../LoadingComponent";
import { ToastContainer, toast } from "react-toastify";
import FileTable from "./FileTable";
const Files = ({ roomId }) => {
  const api = useAxios();
  const inputFileRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchFiles = async () => {
    setLoading(true);
    await api
      .get(`api/rooms/${roomId}/files/`)
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const reloadFiles = async (sortBy = "") => {
    if (sortBy != "") {
      if (sortDirection == "asc") setSortDirection("desc");
      else setSortDirection("asc");
    }

    await api
      .get(
        `api/rooms/${roomId}/files/?direction=${sortDirection}&sort-by=${sortBy}`
      )
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSelectFile = (file, checked) => {
    checked
      ? setSelectedFiles((prev) => [...prev, file])
      : setSelectedFiles((prev) => prev.filter((f) => f.id !== file.id));
  };

  const deleteSelected = async () => {
    if (selectedFiles.length == 0) {
      return;
    }

    const data = {
      files: selectedFiles,
    };

    await api
      .post(`api/rooms/file/delete/`, data)
      .then((res) => {
        setSelectedFiles([]);
        if (res.status == 200) {
          toast.info("Pomyślnie usunięto pliki.", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          reloadFiles();
        }
      })
      .catch((err) => {
        toast.error("Nieudane usunięcie plików.", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          className: "bg-base-200",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  const handleDeleteSingleFile = async (file) => {
    const data = {
      files: [file],
    };

    await api
      .post(`api/rooms/file/delete/`, data)
      .then((res) => {
        setSelectedFiles([]);
        if (res.status == 200) {
          toast.info("Pomyślnie usunięto plik.", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          reloadFiles();
        }
      })
      .catch((err) => {
        toast.error("Nieudane usunięcie pliku.", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          className: "bg-base-200",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  const handleDownload = async (file) => {
    await api
      .get(`api/rooms/file/${file.id}/download/`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        if (typeof window.navigator.msSaveBlob === "function") {
          window.navigator.msSaveBlob(res.data, file.file_name);
        } else {
          link.setAttribute("download", file.file_name);
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDownloadFewFiles = async () => {
    if (selectedFiles.length == 0) {
      return;
    }

    const data = {
      files: selectedFiles,
    };

    await api
      .post(`api/rooms/download-files/`, data, {
        responseType: "blob",
      })
      .then((res) => {
        console.log(res);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        if (typeof window.navigator.msSaveBlob === "function") {
          window.navigator.msSaveBlob(res.data, "files.zip");
        } else {
          link.setAttribute("download", "files.zip");
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showFile = async (file) => {
    await api
      .get(`api/rooms/file/${file.id}/show/`, {
        responseType: "blob",
      })
      .then((res) => {
        const fileUrl = URL.createObjectURL(
          new Blob([res.data], { type: file.mimetype })
        );

        const newWindow = window.open(fileUrl, "_blank");

        if (newWindow) {
          setTimeout(function () {
            newWindow.document.title = file.file_name;
          }, 500);
        }
      })
      .catch((err) => {});
  };

  const onSubmit = (data) => {
    api
      .post(`api/rooms/${roomId}/upload/`, data, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        inputFileRef.current.value = null;
        toast.info("Pomyślnie dodano pliki.", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        reloadFiles();
      })
      .catch((err) => {
        toast.error("Nieudany upload plików.", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          className: "bg-base-200",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  useEffect(() => {
    fetchFiles();
  }, [roomId]);

  return (
    <div className="flex flex-col">
      <div className="absolute top-[70px] left-0 right-0 h-[300px] bg-base-300 "></div>
      {loading ? (
        <LoadingComponent message="Ładowanie informacji o plikach..." />
      ) : (
        <div className="card rounded-none mt-10 bg-white p-6 shadow-xl">
          <form
            // onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center w-10/12 space-y-4 max-md:w-full mx-auto items-center"
          >
            <input
              type="file"
              id="files"
              multiple
              className="file-input file-input-bordered w-full rounded-none bg-transparent hover:border-[#aaabac]"
              name="files"
              ref={inputFileRef}
              required
              onChange={(e) => onSubmit({ files: e.target.files })}
            />
            {/* <button className="btn btn-outline no-animation w-6/12 max-md:w-full max-phone:mx-auto h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400">
              Zmień avatar
            </button> */}
          </form>
          <h2>Files in the Room</h2>

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
  );
};

export default Files;
