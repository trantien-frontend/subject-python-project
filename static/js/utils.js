function showToast(message) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        showCloseButton: true
    });
    return Toast.fire({
        icon: "success",
        background: '#a8e6a1',
        iconColor: 'green',
        color: 'green',
        title: message
    });
}
