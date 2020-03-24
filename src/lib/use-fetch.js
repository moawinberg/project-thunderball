import { useState } from 'react'

const checkStatus = async res => {
    if (res.ok) {
        return res
    }

    try {
        const json = await res.json();
        let error = {
            message: json.message
        }

        if (json.errors) {
            error.errors = json.errors
        }

        throw error;

    } catch (e) {
        throw e;
    }

}

const parseJson = response => response.status === 204 ? null : response.json();

const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [statusCode, setStatusCode] = useState(null);

    const f = async (url, options={}) => {
        try {
            setIsLoading(true);
            const res = await fetch(url, options);
            const checked = await checkStatus(res);
            const parsed  = await parseJson(checked);
            setStatusCode(res.status);
            setData(parsed);
        } catch(e) {
            setError(e);
        } finally {
            setIsLoading(false)
        }
    };

    return [f, isLoading, data, error, statusCode];
}

export default useFetch;