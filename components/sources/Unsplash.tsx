import React, { useContext } from "react";
import { NextPage } from "next";
import Image from "next/image";
import { queryContext } from "../../pages/search";
import { useEffect } from "react";
import { useState } from "react";

import ResultFallback from "../ResultFallback";
import Result from "../Result";
import { ApiResponse } from "unsplash-js/dist/helpers/response";
import { Photos } from "unsplash-js/dist/methods/search/types/response";

interface unsplashResult {
    description?: string;
    color?: string;
    imgUrl: string;
    link: string;
}

const Unsplash: NextPage = () => {
    const query = useContext(queryContext);
    const [results, setResults] = useState<unsplashResult[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);

    const formatResults = () => {
        if (results && results.length > 0) {
            const processedResults = results.map((result, index) => (
                <div key={index} className="container">
                    <img className="image" src={result.imgUrl} alt="" />
                    {result.description && <p className="description">{result.description}</p>}
                </div>
            ));

            return [
                {
                    title: "Photos",
                    results: processedResults,
                },
            ];
        } else {
            if (isError) {
                return [
                    {
                        title: "Something went wrong! Please try again later.",
                    },
                ];
            } else {
                return [
                    {
                        title: "No results found!",
                    },
                ];
            }
        }
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const rawResponse = await fetch(`${window.location.origin}/api/unsplash?q=${query}`);
                const results: ApiResponse<Photos> = await rawResponse.json();

                if (results.type === "success") {
                    const processedResults: unsplashResult[] = results.response.results.map((result) => ({
                        description: (result.description || result.alt_description) as string,
                        color: result.color as string,
                        imgUrl: result.urls.regular,
                        link: result.links.self,
                    }));
                    setResults(processedResults);
                } else {
                    throw new Error("Could not fetch results.");
                }
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [query]);

    return isLoading ? <ResultFallback /> : <Result name="unsplash" subResults={formatResults()} />;
};

export default Unsplash;
