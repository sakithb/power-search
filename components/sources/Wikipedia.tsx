import React, { useContext } from "react";
import { NextPage } from "next";
import { queryContext } from "../../pages/search";
import { useEffect } from "react";
import { useState } from "react";

import wikipedia from "wikipedia";
import ResultFallback from "../ResultFallback";
import Result from "../Result";

interface wikipediaResult {
    title: string;
    summary: string;
    url: string;
}

const Wikipedia: NextPage = () => {
    const query = useContext(queryContext);
    const [results, setResults] = useState<wikipediaResult[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);

    const formatResults = () => {
        if (results && results.length > 0) {
            const processedResults = results?.map((result) => (
                <>
                    <span>
                        <a href={result.url}>{result.title}</a>
                    </span>
                    <p>{result.summary}</p>
                </>
            ));
            return [
                {
                    title: "Search results",
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
                const searchResults = await wikipedia.search(query);
                const processedResults: wikipediaResult[] = await Promise.all(
                    searchResults.results.map(async (result) => {
                        const page = await wikipedia.page(result.pageid);
                        return {
                            title: page.title,
                            summary: (await page.intro()).substr(0, 100) + "...",
                            url: page.fullurl,
                        };
                    })
                );
                setResults(processedResults);
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [query]);

    return isLoading ? <ResultFallback /> : <Result name="wikipedia" subResults={formatResults()} />;
};

export default Wikipedia;
