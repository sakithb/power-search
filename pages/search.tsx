import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useContext, useState } from "react";
import { createContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { sourcesContext } from "./_app";

import RemoteResult from "../components/RemoteResult";
import styles from "../styles/Search.module.css";
import Donate from "../components/Donate";

export const queryContext = createContext<{ query: string }>({
    query: "",
});

const Search: NextPage = () => {
    const searchInput = useRef<HTMLInputElement>(null);

    const sources = useContext(sourcesContext);
    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);
    const [showSupport, setShowSupport] = useState(false);

    const { q: query } = router.query as { [q: string]: string };

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
                    <div className={styles.optionsTitle}>Search results for {`"${query}"`}</div>
                </div>
                <div className={styles.results}>
                    {Object.keys(sources).map((source, index) => (
                        <RemoteResult key={index} name={source} />
                    ))}
                </div>
                {modalOpen && <Donate modalOpen={modalOpen} setModalOpen={setModalOpen} />}
                {showSupport && (
                    <div className={styles.donateButtonContainer}>
                        <FiX
                            className={styles.donateButtonClose}
                            onClick={() => setShowSupport(false)}
                        />
                        <button
                            className={styles.donateButton}
                            onClick={() => {
                                setModalOpen(!modalOpen);
                            }}>
                            <FaHeart /> <span>Support</span>
                        </button>
                    </div>
                )}
            </div>
        </queryContext.Provider>
    );
};

export default Search;
