import React, { useContext } from "react";
import { NextPage } from "next";
import { queryContext } from "../../pages/search";
import { useEffect } from "react";
import { useState } from "react";

import ResultFallback from "../ResultFallback";
import Result from "../Result";
import { markdown } from "markdown";

const Reddit: NextPage = () => {
    const query = useContext(queryContext);
    const [results, setResults] = useState<unknown[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);

    const formatResults = () => {
        if (results && results.length > 0) {
            const processedResults: { title: string; results: JSX.Element[] }[] = [];
            const redditResults: { title: string; results: JSX.Element[] } = {
                title: "Results",
                results: [],
            };

            const urlRegex = new RegExp(
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
            );

            results.forEach((result: any, index) => {
                redditResults.results.push(
                    <div key={index} className="container">
                        <span className="title">
                            <a href={new URL(result.url, "https://www.reddit.com").href}>{result.title}</a>
                        </span>
                        <span className="metadata">{result.votes} votes</span>
                        {urlRegex.test(result.imageUrl) && (
                            <img src={result.imageUrl} className="image" alt="" />
                        )}
                        {result.description && (
                            <p
                                className="description"
                                dangerouslySetInnerHTML={{
                                    __html: markdown.toHTML(result.description.substr(27) + "..."),
                                }}></p>
                        )}
                    </div>
                );
            });

            processedResults.push(redditResults);

            if (processedResults.length === 0) {
                processedResults.push({
                    title: "No results",
                    results: [],
                });
            }
            return processedResults;
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
                const searchResponse = await fetch(`https://www.reddit.com/search.json?q=${query}`);
                const searchResults = await searchResponse.json();

                const processedResults = searchResults.data.children.map(
                    ({ data: result }: { data: any }) => {
                        return {
                            title: result.title,
                            description: result.selftext,
                            imageUrl: result.thumbnail,
                            votes: result.score,
                            url: result.permalink,
                        };
                    }
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

    return isLoading ? <ResultFallback /> : <Result name="reddit" subResults={formatResults()} />;
};

export default Reddit;
