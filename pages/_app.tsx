import "../styles/globals.css";
import { AppProps } from "next/app";
import { createContext, useState } from "react";
import { useEffect } from "react";

export interface SourcesIF {
    [source: string]: {
        name: string;
        color: string;
        svg: string;
    };
}

export interface Result {
    type: string;
    header?: string; // Markdown
    title?: string;
    url?: string;
    description?: string;
    image?: string;
    footer?: string; // Markdown
}

export const sourcesContext = createContext<Partial<SourcesIF>>({});

const PowerSearch = ({ Component, pageProps }: AppProps) => {
    const [sources, setSources] = useState<SourcesIF>({});
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            const jsonSources = await fetch("/sources.json");
            setSources(await jsonSources.json());
            setPageLoaded(true);
        })();
    }, []);

    return (
        <sourcesContext.Provider value={sources}>
            {pageLoaded && <Component {...pageProps} />}
        </sourcesContext.Provider>
    );
};

export default PowerSearch;
