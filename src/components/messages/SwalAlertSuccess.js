import Swal from "sweetalert2";

const showSuccessAlert = (title, text, onClose) => {
  const swalAlertSuccess = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
    },
    buttonsStyling: false,
  });

  swalAlertSuccess
    .fire({
      icon: "success",
      title: title,
      text: text,
      customClass: {
        confirmButton:
          "btn btn-outline rounded-md outline-none border-[1px] text-black w-full",
        popup: "rounded-md bg-base-100",
      },
    })
    .then(() => {
      if (onClose && typeof onClose === "function") {
        onClose();
      }
    });
};

export default showSuccessAlert;
