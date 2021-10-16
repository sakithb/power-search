import { useContext, useEffect, useState } from "react";
import { queryContext } from "../pages/search";
import { decode } from "blurhash";

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
        footer?: string; // Markdown
    }[];
}

const blurDataURL =
    "data:image/png;base64,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";

const useBlurHash = (blurHash: string, width = 500, height = 500) => {
    const pixels = decode(blurHash, width, height);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
};

const ResultJSXContainer: React.FC<{ remoteResult: RemoteResult[] }> = ({ remoteResult }) => {
    return (
        <div className={styles.results}>
            {remoteResult.map((subresult, index) => (
                <div key={index} className={styles.subresult}>
                    <div className={styles["subresult-title"]}>{subresult.title}</div>
                    <div className={styles["subresult-metadata"]}>
                        <Markdown>{subresult.metadata}</Markdown>
                    </div>
                    <div className={styles["subresult-results"]}>
                        {subresult.results.map((result, resultIndex) => (
                            <div
                                key={resultIndex}
                                className={`${styles.result} ${styles[`result-${result.type}`]}`}>
                                {result.title && (
                                    <div className={styles["result-title"]}>
                                        {result.url ? <a href={result.url}>{result.title}</a> : result.title}
                                    </div>
                                )}
                                {result.header && (
                                    <div className={styles["result-header"]}>
                                        <Markdown>{result.header}</Markdown>
                                    </div>
                                )}
                                {result.image && (
                                    <div className={styles["result-image"]}>
                                        <Image
                                            src={`/api/imageproxy?url=${encodeURIComponent(result.image)}`}
                                            alt={result.image}
                                            width="100%"
                                            height="100%"
                                            layout={result.type === "normal" ? "responsive" : "fixed"}
                                            blurDataURL={blurDataURL}
                                            placeholder="blur"
                                        />
                                    </div>
                                )}
                                {result.description && (
                                    <div className={styles["result-description"]}>
                                        <Markdown>
                                            {result.description.length > 300
                                                ? result.description.substring(0, 300) + "..."
                                                : result.description}
                                        </Markdown>
                                    </div>
                                )}
                                {result.footer && (
                                    <div className={styles["result-footer"]}>
                                        <Markdown>{result.footer}</Markdown>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const RemoteResult: React.FC<RemoteResultProps> = ({ name }) => {
    const query = useContext(queryContext);

    const [content, setContent] = useState<JSX.Element>();
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/sources/${name}?q=${query}`);
            if (response.ok) {
                const remoteResult: RemoteResult[] = await response.json();
                console.log(remoteResult);
                const jsxContent: JSX.Element = <ResultJSXContainer remoteResult={remoteResult} />;
                setContent(jsxContent);
            } else if (response.status === 404) {
                setNotFound(true);
            }
        })();
    }, [name, query]);

    return !notFound ? content ? <Result name={name}>{content}</Result> : <ResultFallback /> : <></>;
};

export default RemoteResult;
