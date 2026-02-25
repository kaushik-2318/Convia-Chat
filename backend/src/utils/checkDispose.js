import axios from 'axios';

export const isDisposableEmail = async (email) => {
    try {
        const { data } = await axios.get(`https://disposable.debounce.io/?email=${email}`);
        return data.disposable === 'true';
    } catch (error) {
        console.error('Error while checking disposable email:', error);
        return false;
    }
};
