import axios from 'axios';
import { URL, options } from "./requestOptions";

export const loadPictures = async () => {
    const pictures = await axios.get(URL, options);
    return pictures;
};