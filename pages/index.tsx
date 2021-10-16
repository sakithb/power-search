import styles from "../styles/Home.module.css";

import { NextPage } from "next";
import { sourcesContext, SourcesIF } from "./_app";
import { FiSearch } from "react-icons/fi";

import { useRouter } from "next/dist/client/router";
import { useRef } from "react";
import { useContext } from "react";

const Home: NextPage = () => {
    const sources = useContext(sourcesContext);

    const searchValue = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleSearch = () => {
        if (searchValue.current?.value) {
            router.push({
                pathname: "search",
                query: {
                    q: searchValue.current?.value,
                },
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchWrapper}>
                <span className={styles.title}>powersearch</span>

                <div className={styles.searchBoxWrapper}>
                    <input
                        ref={searchValue}
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
            <div className={styles.captionWrapper}>
                <span className={styles.captionStart}>
                    Search everywhere...
                </span>
                <div className={styles.captionIcons}>
                    {Object.keys(sources).map((source, index) => {
                        const icon = sources[source];
                        return (
                            <div
                                key={index}
                                className={styles.captionIcon}
                                onMouseEnter={(event) => {
                                    (
                                        event.target as HTMLDivElement
                                    ).style.background =
                                        (
                                            event.target as HTMLDivElement
                                        ).getAttribute("data-color") || "";
                                }}
                                onMouseLeave={(event) => {
                                    (
                                        event.target as HTMLDivElement
                                    ).style.background = "none";
                                }}
                                data-color={icon?.color}
                                dangerouslySetInnerHTML={{
                                    __html: icon?.svg as string,
                                }}></div>
                        );
                    })}
                </div>
                <span className={styles.captionEnd}>...in one go</span>
            </div>
        </div>
    );
};

export default Home;
