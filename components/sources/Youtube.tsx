import React, { useContext } from "react";
import { NextPage } from "next";
import { queryContext } from "../../pages/search";
import { useEffect } from "react";
import { useState } from "react";

import youtubeSearch from "youtube-search";

import ResultFallback from "../ResultFallback";
import Result from "../Result";

interface youtubeResult {
    title: string;
    description: string;
    url: string;
    kind: string;
}

const searchOpts = {
    maxResults: 10,
    key: "AIzaSyDNqYRDsb-JaUan7UdP05alvuGHWCD6NwY",
};

const Youtube: NextPage = () => {
    const query = useContext(queryContext);
    const [results, setResults] = useState<youtubeResult[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);

    const formatResults = () => {
        if (results && results.length > 0) {
            const processedResults: { title: string; results: JSX.Element[] }[] = [];

            const channels: JSX.Element[] = [];
            const users: JSX.Element[] = [];
            const videos: JSX.Element[] = [];

            results.forEach((result) => {
                const jsx = (
                    <>
                        <span>
                            <a href={result.url}>{result.title}</a>
                        </span>
                        <p>{result.description}</p>
                    </>
                );

                switch (result.kind) {
                    case "video":
                        videos.push(jsx);
                        break;
                    case "user":
                        users.push(jsx);
                        break;
                    case "channel":
                        channels.push(jsx);
                        break;
                }
            });

            if (channels.length > 0) {
                processedResults.push({
                    title: "Channels",
                    results: channels,
                });
            }

            if (users.length > 0) {
                processedResults.push({
                    title: "Users",
                    results: users,
                });
            }

            if (videos.length > 0) {
                processedResults.push({
                    title: "Videos",
                    results: videos,
                });
            }

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
                const searchResults = await youtubeSearch(query, searchOpts);

                const processedResults = searchResults.results.map((result) => {
                    return {
                        title: result.title,
                        description: result.description,
                        kind: result.kind.replace("youtube#", ""),
                        url: result.link,
                    };
                });

                setResults(processedResults);
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [query]);

    return isLoading ? <ResultFallback /> : <Result name="youtube" subResults={formatResults()} />;
};

export default Youtube;
