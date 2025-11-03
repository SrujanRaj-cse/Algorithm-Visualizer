import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../assets/API_URL';

export const useAPI = () => {
    const [data,setData] = useState(null);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);

    const fetchSteps = useCallback(async(url, payload) => {
        setLoading(true);
        setError(null);
        try{
            const res = await axios.post(API_URL + url, payload);
            setData(res.data);
        }catch(err){
            setData(null);
            setTimeout(()=>{
                setError(err.response?.data || err.message);
            },3000);
        }
        setLoading(false);
    }, []);

    const clearData = useCallback(() => {
        setData(null);
        setError(null);
    }, []);

    return {data,error,loading, fetchSteps, setError, clearData};
};