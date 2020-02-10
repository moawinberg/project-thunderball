import React, { useEffect } from 'react';
import useFetch from '../../lib/use-fetch';


const Timeline = () => {
    const [fetch, isLoading, data, error] = useFetch();

    //fetch data
    useEffect(() => {
        fetch(/*insert URL*/)
    },[]);

    //display data when it arrives
    useEffect(() => {
        if (!isLoading && !(data === null) && (error === null)) {
            // do stuff with data here
        }
    }, [data, isLoading, error]);
}