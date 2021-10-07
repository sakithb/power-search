import React, { useContext } from "react";
import { NextPage } from "next";
import { queryContext } from "../../pages/search";
import { useEffect } from "react";
import { useState } from "react";

import ResultFallback from "../ResultFallback";
import Result from "../Result";

interface newsResult {
    title?: string;
    link?: string;
    description?: string;
}

const GoogleNews: NextPage = () => {
    const query = useContext(queryContext);
    const [results, setResults] = useState<newsResult[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);

    const formatResults = () => {
        if (results && results.length > 0) {
            const processedResults = results.map((result, index) => (
                <>
                    {result.title && (
                        <span>
                            <a href={result.link || "#"}>{result.title}</a>
                        </span>
                    )}
                    {result.description && <p>{result.description}</p>}
                </>
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
                const results: newsResult[] = await (await fetch(`/api/googlenews?q=${query}`)).json();

                const processedResults: newsResult[] = results.map((result) => ({
                    title: result.title,
                    link: result.link,
                    description: result.description,
                }));
                setResults(processedResults);
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [query]);

    return isLoading ? <ResultFallback /> : <Result name="googlenews" subResults={formatResults()} />;
};

export default GoogleNews;
