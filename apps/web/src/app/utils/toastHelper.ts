import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const toastFailed = (message: string) => toast(message, { type: 'error' });
export const toastSuccess = (message: string) => toast(message, { type: 'success' });
