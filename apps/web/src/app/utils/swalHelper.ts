import Swal from 'sweetalert2';

export const toastSwal = (iconProp: string, titleProp: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    icon: iconProp == 'error' ? 'error' : 'success',
    title: `${titleProp}`,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  return Toast.fire();
};

// export const confirmationSwal = async (
//   titleProp: string,
//   confirmText: string,
//   acceptTitle: string,
// ) => {
//   let res = false;

//   Swal.fire({
//     title: `${titleProp}`,
//     text: 'this action cannot be reverted',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: `${confirmText}`,
//   }).then((result) => {
//     if (result.isConfirmed) {
//       res = true;
//       Swal.fire({
//         title: `${acceptTitle}`,
//         // text: 'Your file has been deleted.',
//         icon: 'success',
//       });
//     }
//   });

//   return {res};
// };

export const confirmationSwal = async (
  titleProp: string,
  confirmText: string,
  acceptTitle: string,
) => {
  const result = await Swal.fire({
    title: `${titleProp}`,
    text: 'this action cannot be reverted',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `${confirmText}`,
  });

  // if (result.isConfirmed) {
  //   return true;
  // }

  if (result.isConfirmed) {
    await Swal.fire({
      title: `${acceptTitle}`,
      icon: 'success',
    });
    return true;
  }

  return false;
};

export const confirmationWithoutSuccessMessageSwal = async (
  titleProp: string,
  confirmText: string,
) => {
  const result = await Swal.fire({
    title: `${titleProp}`,
    text: 'this action cannot be reverted',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `${confirmText}`,
  });

  if (result.isConfirmed) {
    return true;
  }
};

export const simpleSwal = (iconProp: string, titleProp: string) => {
  return Swal.fire({
    icon: iconProp === 'success' ? 'success' : 'error',
    titleText: `${titleProp}`,
    confirmButtonText: 'Ok',
    timer: 4000,
  });
};
