export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toastContainer = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;

    toastContainer?.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
};
