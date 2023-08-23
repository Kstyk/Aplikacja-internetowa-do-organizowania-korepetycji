import Swal from "sweetalert2";

const showAlertError = (title, text, onClose) => {
  const showAlertError = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
    },
    buttonsStyling: false,
  });

  showAlertError
    .fire({
      icon: "error",
      title: title,
      text: text,
      customClass: {
        confirmButton:
          "btn btn-outline rounded-none outline-none border-[1px] text-black w-full",
        popup: "rounded-none bg-base-100",
      },
    })
    .then(() => {
      if (onClose && typeof onClose === "function") {
        onClose();
      }
    });
};

export default showAlertError;
