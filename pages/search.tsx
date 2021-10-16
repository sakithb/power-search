import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useContext, useState } from "react";
import { createContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { sourcesContext } from "./_app";

import RemoteResult from "../components/RemoteResult";
import styles from "../styles/Search.module.css";

export const queryContext = createContext<{ query: string }>({
    query: "",
});

const Search: NextPage = () => {
    const sources = useContext(sourcesContext);

    const router = useRouter();
    const { q: query } = router.query as { [q: string]: string };

    const searchInput = useRef<HTMLInputElement>(null);

    const handleSearch = () => {
        if (searchInput.current?.value) {
            router.push({
                pathname: "search",
                query: {
                    q: searchInput.current?.value,
                },
            });
        }
    };

    useEffect(() => {
        (searchInput.current as HTMLInputElement).value = query;
    }, [query]);

    return (
        <queryContext.Provider value={{ query }}>
            <div className={styles.container}>
                <div className={styles.searchWrapper}>
                    <span className={styles.title}>powersearch</span>

                    <div className={styles.searchBoxWrapper}>
                        <input
                            ref={searchInput}
                            type="text"
                            className={styles.searchBox}
                            placeholder="Search..."
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                        />
                        <button
                            className={styles.searchButton}
                            onClick={() => {
                                handleSearch();
                            }}>
                            <FiSearch />
                        </button>
                    </div>
                </div>
                <div className={styles.options}>
                    <div className={styles.optionsTitle}>
                        Search results for {`"${query}"`}
                    </div>
                </div>
                <div className={styles.results}>
                    {Object.keys(sources).map((source, index) => (
                        <RemoteResult key={index} name={source} />
                    ))}
                </div>
            </div>
        </queryContext.Provider>
    );
};

export default Search;
