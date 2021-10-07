import React, { useContext } from "react";
import { NextPage } from "next";
import { queryContext } from "../../pages/search";
import { useEffect } from "react";
import { useState } from "react";

import ResultFallback from "../ResultFallback";
import Result from "../Result";

const Spotify: NextPage = () => {
    const query = useContext(queryContext);
    const [results, setResults] = useState<unknown[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);

    const formatResults = () => {
        if (results && results.length > 0) {
            const processedResults: { title: string; results: JSX.Element[] }[] = [];

            const artists: { title: string; results: JSX.Element[] } = { title: "Artists", results: [] };
            const tracks: { title: string; results: JSX.Element[] } = { title: "Tracks", results: [] };

            const urlRegex = new RegExp(
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
            );

            results.forEach((result: any, index) => {
                const jsx = (
                    <div key={index} className="container">
                        <span className="title">
                            <a href={result.url}>{result.name}</a>
                        </span>
                        <span className="metadata">{result.metadata}</span>
                        {urlRegex.test(result.imageUrl) && (
                            <img src={result.imageUrl} className="image" alt="" />
                        )}
                    </div>
                );

                if (result.type === "track") {
                    tracks.results.push(jsx);
                }

                if (result.type === "artist") {
                    artists.results.push(jsx);
                }
            });

            if (tracks.results.length > 0) {
                processedResults.push(tracks);
            }

            if (artists.results.length > 0) {
                processedResults.push(artists);
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
                const searchResponse = await fetch(
                    `https://api.spotify.com/v1/search?q=${query}&type=track%2Cartist&limit=10`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.SPOTIFY_API_KEY}`,
                            Accept: "application/json",
                        },
                    }
                );
                const searchResults = await searchResponse.json();

                const artists: {
                    name: string;
                    imageUrl: string;
                    type: "artist" | "track";
                    url: string;
                }[] = searchResults.artists.items.map((result: any) => {
                    return {
                        name: result.name,
                        imageUrl: result.images[0] && result.images[0].url,
                        type: "artist",
                        url: result.external_urls.spotify,
                        metadata: `${result.followers.total} followers`,
                    };
                });

                const tracks: {
                    name: string;
                    imageUrl: string;
                    type: "artist" | "track";
                    url: string;
                }[] = searchResults.tracks.items.map((result: any) => {
                    console.log(result);

                    return {
                        name: result.name,
                        imageUrl: result.album.images[0] && result.album.images[0].url,
                        type: "track",
                        url: result.external_urls.spotify,
                        metadata: result.artists.map((artist: any) => artist.name).join(", "),
                    };
                });

                const processedResults = artists.concat(tracks);
                setResults(processedResults);
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [query]);

    return isLoading ? <ResultFallback /> : <Result name="spotify" subResults={formatResults()} />;
};

export default Spotify;
