import React, { useEffect, useState } from "react";
import useAxios from "../../utils/useAxios";
import LoadingComponent from "../LoadingComponent";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

const Files = ({ roomId }) => {
  const api = useAxios();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const fetchFiles = async () => {
    setLoading(true);
    await api
      .get(`api/rooms/${roomId}/files/`)
      .then((res) => {
        setFiles(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const reloadFiles = async () => {
    await api
      .get(`api/rooms/${roomId}/files/`)
      .then((res) => {
        setFiles(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
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

  const showFile = async (file) => {
    await api
      .get(`api/rooms/file/${file.id}/show/`, {
        responseType: "blob",
      })
      .then((res) => {
        const fileUrl = URL.createObjectURL(
          new Blob([res.data], { type: file.mimetype })
        );

        const newWindow = window.open(fileUrl);
        if (newWindow) {
          newWindow.document.title = "My Custom Title";
        } else {
          console.error("Pop-up window was blocked by the browser.");
        }
      })
      .catch((err) => {});
  };

  const onSubmit = (data) => {
    console.log(data);

    api
      .post(`api/rooms/${roomId}/upload/`, data, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
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
    <div className="flex flex-col h-full">
      <div className="absolute top-[70px] left-0 right-0 h-[300px] bg-base-300 "></div>
      {loading ? (
        <LoadingComponent message="Ładowanie informacji o plikach..." />
      ) : (
        <div className="card rounded-none mt-10 bg-white p-6 shadow-xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center w-10/12 space-y-4 max-md:w-full mx-auto items-center"
          >
            <input
              type="file"
              id="files"
              multiple
              className="file-input file-input-bordered w-full rounded-none bg-transparent hover:border-[#aaabac]"
              name="files"
              required
              {...register("files")}
            />
            <button className="btn btn-outline no-animation w-6/12 max-md:w-full max-phone:mx-auto h-10 py-0 !min-h-0 rounded-none mt-2 hover:bg-base-400 border-base-400">
              Zmień avatar
            </button>
          </form>
          <h2>Files in the Room</h2>
          <ul>
            {files?.map((file) => (
              <li key={file.id} className="flex justify-between">
                <span onClick={() => showFile(file)}>{file.file_name}</span>
                <button onClick={() => handleDownload(file)}>Download</button>
              </li>
            ))}
          </ul>
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
