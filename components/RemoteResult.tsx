import { useContext, useEffect, useState } from "react";
import { queryContext } from "../pages/search";

import Result from "./Result";
import ResultFallback from "./ResultFallback";
import Markdown from "react-markdown";
import Image from "next/image";
import styles from "../styles/Result.module.css";

interface RemoteResultProps {
    name: string;
}

interface RemoteResult {
    title: string;
    metadata: string;
    results: {
        type: string;
        header?: string; // Markdown
        title?: string;
        url?: string;
        description?: string;
        image?: string;
        image_blurhash?: string;
        footer?: string; // Markdown
    }[];
}

const getJSXResults = (remoteResult: RemoteResult[]) => (
    <div className={styles.results}>
        {remoteResult.map((subresult, index) => (
            <div key={index} className={styles.subresult}>
                <div className={styles["subresult-title"]}>{subresult.title}</div>
                <div className={styles["subresult-metadata"]}>
                    <Markdown disallowedElements={["p"]} unwrapDisallowed={true}>
                        {subresult.metadata}
                    </Markdown>
                </div>
                <div className={styles["subresult-results"]}>
                    {subresult.results.map((result, resultIndex) => (
                        <div
                            key={resultIndex}
                            className={`${styles.result} ${styles[`result-${result.type}`]}`}>
                            {result.title && <div className={styles["result-title"]}>{result.title}</div>}
                            {result.header && (
                                <div className={styles["result-header"]}>
                                    <Markdown disallowedElements={["p"]} unwrapDisallowed={true}>
                                        {result.header}
                                    </Markdown>
                                </div>
                            )}
                            {result.image && (
                                <div className={styles["result-image"]}>
                                    <Image
                                        src={`/api/imageproxy?url=${encodeURIComponent(result.image)}`}
                                        alt={result.image}
                                        width="100%"
                                        height="100%"
                                        objectFit="contain"
                                        layout="responsive"
                                    />
                                </div>
                            )}
                            {result.description && (
                                <div className={styles["result-description"]}>{result.description}</div>
                            )}
                            {result.footer && <div className={styles["result-footer"]}>{result.footer}</div>}
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const RemoteResult: React.FC<RemoteResultProps> = ({ name }) => {
    const query = useContext(queryContext);
    const [content, setContent] = useState<JSX.Element>();

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/sources/${name}?q=${query}`);
            if (response.ok) {
                const remoteResult: RemoteResult[] = await response.json();
                console.log(remoteResult);
                const jsxContent: JSX.Element = getJSXResults(remoteResult);
                setContent(jsxContent);
            }
        })();
    }, [name, query]);

    return content ? <Result name={name}>{content}</Result> : <ResultFallback />;
};

export default RemoteResult;
