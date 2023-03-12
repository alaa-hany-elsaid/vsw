import cogoToast from 'cogo-toast';
import clipboard from 'copy-to-clipboard';

const TOAST_DEFAULT_POSITION = 'bottom-right';

const sleep = (time) => {
    const startTime = new Date().getTime() + time;
    while (new Date().getTime() < startTime) {
        // empty
    }
};

const copy = (data, message = 'Copied') => {
    if (data === null || data === undefined || data === '') return;
    clipboard(data);

    cogoToast.success(message, { position: TOAST_DEFAULT_POSITION });
};

const success = (message) =>
    cogoToast.success(message, { position: TOAST_DEFAULT_POSITION });
const error = (message) =>
    cogoToast.error(message, { position: TOAST_DEFAULT_POSITION });

const info = (message) =>
    cogoToast.info(message, { position: TOAST_DEFAULT_POSITION });

const warn = (message) =>
    cogoToast.warn(message, { position: TOAST_DEFAULT_POSITION });

const loading = (message) =>
    cogoToast.loading(message, { position: TOAST_DEFAULT_POSITION });

export default { sleep, copy, toast: { success, info, error, warn, loading } };
