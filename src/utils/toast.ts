export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top-right'
};

export const showToast = (message: string, type: ToastType, options: ToastOptions = {}) => {
  const { duration, position } = { ...defaultOptions, ...options };

  const toast = document.createElement('div');
  const positionClasses = {
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2'
  };

  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  toast.className = `${positionClasses[position || 'top-right']} z-50 p-4 rounded-lg shadow-lg text-white ${typeClasses[type]}`;
  toast.textContent = message;

  // animation
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-20px)';
  toast.style.transition = 'all 0.3s ease';

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  // Auto remove
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }
  }, duration);

  return toast;
};

// Convenience methods
export const showSuccess = (message: string, options?: ToastOptions) => showToast(message, 'success', options);
export const showError = (message: string, options?: ToastOptions) => showToast(message, 'error', options);
export const showWarning = (message: string, options?: ToastOptions) => showToast(message, 'warning', options);
export const showInfo = (message: string, options?: ToastOptions) => showToast(message, 'info', options);
