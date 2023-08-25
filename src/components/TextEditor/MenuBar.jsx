import React from "react";

const MenuBar = ({ editorComponent }) => {
  if (!editorComponent) {
    return null;
  }

  const buttonClassActive =
    "w-[12.5%] max-[300px]:w-1/6 bg-base-400 text-white active:bg-custom-darkgreen font-bold uppercase text-xs px-2 py-2 shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150";

  const buttonClass =
    "w-[12.5%] max-[300px]:w-1/6 bg-slate-200 text-custom-darkgreen active:bg-white font-bold uppercase text-xs px-2 py-2 shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 border-none";

  return (
    <div className="w-full flex flex-row flex-wrap content-stretch">
      <button
        type="button"
        title="Nagłówek pierwszego stopnia"
        onClick={() =>
          editorComponent.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={` ${
          editorComponent.isActive("heading", { level: 1 })
            ? buttonClassActive
            : buttonClass
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={
              editorComponent.isActive("heading", { level: 1 }) ? "white" : ""
            }
            d="M200-280v-400h80v160h160v-160h80v400h-80v-160H280v160h-80Zm480 0v-320h-80v-80h160v400h-80Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Nagłówek drugiego stopnia"
        onClick={() =>
          editorComponent.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={
          editorComponent.isActive("heading", { level: 2 })
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={
              editorComponent.isActive("heading", { level: 2 }) ? "white" : ""
            }
            d="M120-280v-400h80v160h160v-160h80v400h-80v-160H200v160h-80Zm400 0v-160q0-33 23.5-56.5T600-520h160v-80H520v-80h240q33 0 56.5 23.5T840-600v80q0 33-23.5 56.5T760-440H600v80h240v80H520Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Nagłówek trzeciego stopnia"
        onClick={() =>
          editorComponent.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={
          editorComponent.isActive("heading", { level: 3 })
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={
              editorComponent.isActive("heading", { level: 3 }) ? "white" : ""
            }
            d="M120-280v-400h80v160h160v-160h80v400h-80v-160H200v160h-80Zm400 0v-80h240v-80H600v-80h160v-80H520v-80h240q33 0 56.5 23.5T840-600v240q0 33-23.5 56.5T760-280H520Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Paragraf"
        onClick={() => editorComponent.chain().focus().setParagraph().run()}
        className={
          editorComponent.isActive("paragraph")
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={editorComponent.isActive("paragraph") ? "white" : ""}
            d="M360-240v-80h480v80H360Zm0-200v-80h480v80H360ZM120-640v-80h720v80H120Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Pogrubienie"
        onClick={() => editorComponent.chain().focus().toggleBold().run()}
        className={
          editorComponent.isActive("bold") ? buttonClassActive : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={editorComponent.isActive("bold") ? "white" : ""}
            d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Kursywa"
        onClick={() => editorComponent.chain().focus().toggleItalic().run()}
        className={
          editorComponent.isActive("italic") ? buttonClassActive : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={editorComponent.isActive("italic") ? "white" : ""}
            d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Podkreślenie"
        onClick={() => editorComponent.chain().focus().toggleUnderline().run()}
        className={
          editorComponent.isActive("underline")
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={editorComponent.isActive("underline") ? "white" : ""}
            d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Przekreślenie"
        onClick={() => editorComponent.chain().focus().toggleStrike().run()}
        className={
          editorComponent.isActive("strike") ? buttonClassActive : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={editorComponent.isActive("strike") ? "white" : ""}
            d="M80-400v-80h800v80H80Zm340-160v-120H200v-120h560v120H540v120H420Zm0 400v-160h120v160H420Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Indeks górny"
        onClick={() =>
          editorComponent.chain().focus().toggleSuperscript().run()
        }
        className={
          editorComponent.isActive("superscript")
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={editorComponent.isActive("superscript") ? "white" : ""}
            d="M760-600v-80q0-17 11.5-28.5T800-720h80v-40H760v-40h120q17 0 28.5 11.5T920-760v40q0 17-11.5 28.5T880-680h-80v40h120v40H760ZM235-160l185-291-172-269h106l124 200h4l123-200h107L539-451l186 291H618L482-377h-4L342-160H235Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Indeks dolny"
        onClick={() => editorComponent.chain().focus().toggleSubscript().run()}
        className={
          editorComponent.isActive("subscript")
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={editorComponent.isActive("subscript") ? "white" : ""}
            d="M760-160v-80q0-17 11.5-28.5T800-280h80v-40H760v-40h120q17 0 28.5 11.5T920-320v40q0 17-11.5 28.5T880-240h-80v40h120v40H760Zm-525-80 185-291-172-269h106l124 200h4l123-200h107L539-531l186 291H618L482-457h-4L342-240H235Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Lista nieponumerowana"
        onClick={() => editorComponent.chain().focus().toggleBulletList().run()}
        className={
          editorComponent.isActive("bulletList")
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={editorComponent.isActive("bulletList") ? "white" : ""}
            d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Lista ponumerowana"
        onClick={() =>
          editorComponent.chain().focus().toggleOrderedList().run()
        }
        className={
          editorComponent.isActive("orderedList")
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={editorComponent.isActive("orderedList") ? "white" : ""}
            d="M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80H120Zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60H120Zm60-280v-180h-60v-60h120v240h-60Zm180 440v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Wyrównianie do lewej"
        onClick={() =>
          editorComponent.chain().focus().setTextAlign("left").run()
        }
        className={
          editorComponent.isActive({ textAlign: "left" })
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={
              editorComponent.isActive({ textAlign: "left" }) ? "white" : ""
            }
            d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Wyśrodkowanie"
        onClick={() =>
          editorComponent.chain().focus().setTextAlign("center").run()
        }
        className={
          editorComponent.isActive({ textAlign: "center" })
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={
              editorComponent.isActive({ textAlign: "center" }) ? "white" : ""
            }
            d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Wyrównanie do prawej"
        onClick={() =>
          editorComponent.chain().focus().setTextAlign("right").run()
        }
        className={
          editorComponent.isActive({ textAlign: "right" })
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={
              editorComponent.isActive({ textAlign: "right" }) ? "white" : ""
            }
            d="M120-120v-80h720v80H120Zm240-160v-80h480v80H360ZM120-440v-80h720v80H120Zm240-160v-80h480v80H360ZM120-760v-80h720v80H120Z"
          />
        </svg>
      </button>
      <button
        type="button"
        title="Wyjustowanie"
        onClick={() =>
          editorComponent.chain().focus().setTextAlign("justify").run()
        }
        className={
          editorComponent.isActive({ textAlign: "justify" })
            ? buttonClassActive
            : buttonClass
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          className="mx-auto"
        >
          <path
            fill={
              editorComponent.isActive({ textAlign: "justify" }) ? "white" : ""
            }
            d="M120-120v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Z"
          />
        </svg>
      </button>
    </div>
  );
};

export default MenuBar;
