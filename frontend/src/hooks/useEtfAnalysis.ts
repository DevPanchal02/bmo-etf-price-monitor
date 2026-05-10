import { useState, useCallback } from "react";
import type { ETFAnalysisResponse } from "../types";

export function useEtfAnalysis(){
    const[data, setData] = useState<ETFAnalysisResponse[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // track state of which etf in the arr the user is currently viewing
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    // memoizes uploaded logic to prevent re-renders in components
    const uploadFile = useCallback (async (files: File[]) => {

        setIsLoading(true);
        setError(null);

        const formData = new FormData();

        files.forEach((file) => {
            formData.append('file', file);
        });

        // HTTP POST call on user uploaded file
        try {
            const response = await fetch('http://localhost:3001/api/etf/upload', {
                method: 'POST',
                body: formData
            });
            if (!response.ok){
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `server error: ${response.status}`);           
            }

            const responseData = await response.json() as ETFAnalysisResponse[];

            if (!responseData || responseData.length === 0){
                throw new Error('no data returned from server');
            }

            // Append new uploads to existing state
            setData((prev) => {
                if (prev && prev.length > 0) {
                    // focuses the newly added ETF
                    setSelectedIndex(prev.length);
                    return[...prev, ...responseData];
                }
                setSelectedIndex(0);
                return responseData;
            });
        }
        catch(err: unknown){
            if(err instanceof Error) {
                setError(err.message);
            }
            else {
                setError("error loading data");
            }
        }
        finally {
            setIsLoading(false);
        }
    },[]);

    // allows the user to remove all data and start fresh
    const resetState = useCallback(() => {
        setData(null);
        setError(null);
        setSelectedIndex(0);
    },[]);

    return {
        data, isLoading, error, uploadFile, resetState, selectedIndex, setSelectedIndex
    };
}