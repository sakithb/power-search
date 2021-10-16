import { useContext, useEffect, useRef, useState } from "react";
import { queryContext } from "../pages/search";

import ResultFallback from "./ResultFallback";
import Markdown from "react-markdown";
import Image from "next/image";
import Result from "./Result";
import clamp from "clamp-js";
import styles from "../styles/Result.module.css";

interface SubResultIF {
    title: string;
    metadata: string;
    results: ResultIF[];
}

interface ResultIF {
    type: string;
    header?: string; // Markdown
    title?: string;
    url?: string;
    description?: string;
    image?: string;
    footer?: string; // Markdown
}

const blurDataURL =
    "data:image/png;base64,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";

const trimmed = (className: string, extended = false) => {
    let styledClasses = styles[className] + " " + "trimmed";

    if (extended) {
        styledClasses += " " + "trimmedExtended";
    }

    return styledClasses;
};

const ResultUnit: React.FC<ResultIF> = ({
    title,
    url,
    header,
    image,
    footer,
    description,
    type,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Add "..." to end of all overflows elements

        const trimmedEls = containerRef.current?.querySelectorAll(".trimmed");

        trimmedEls?.forEach((el: any) => {
            clamp(el, {
                clamp: el.classList.contains("trimmedExtended") ? 5 : 2,
            });
        });
    });

    const headerEl = header && (
        <div className={trimmed("resultHeader")}>
            <Markdown>{header}</Markdown>
        </div>
    );

    const titleEl = title && (
        <div className={trimmed("resultTitle")}>
            {url ? <a href={url}>{title}</a> : title}
        </div>
    );

    const imageEl = image && (
        <div className={styles["resultImage"]}>
            <Image
                src={`/api/imageproxy?url=${encodeURIComponent(image)}`}
                alt={image}
                width="100%"
                height="100%"
                layout={type === "normal" ? "responsive" : "fixed"}
                blurDataURL={blurDataURL}
                placeholder="blur"
            />
        </div>
    );

    const descriptionEl = description && (
        <div className={trimmed("resultDescription", true)}>
            <Markdown>{description}</Markdown>
        </div>
    );

    const footerEl = footer && (
        <div className={trimmed("resultFooter")}>
            <Markdown>{footer}</Markdown>
        </div>
    );

    if (type === "normal") {
        return (
            <div ref={containerRef} className={styles.result}>
                {headerEl}
                {titleEl}
                {imageEl}
                {descriptionEl}
                {footerEl}
            </div>
        );
    } else {
        return (
            <div
                ref={containerRef}
                className={`${styles.result} ${styles["resultCompact"]}`}>
                <div className={styles["resultCompactLeftWrapper"]}>
                    {imageEl}
                </div>
                <div className={styles["resultCompactRightWrapper"]}>
                    {headerEl}
                    {titleEl}
                    {descriptionEl}
                    {footerEl}
                </div>
            </div>
        );
    }
};

const SubResultUnit: React.FC<SubResultIF> = ({ title, metadata, results }) => {
    return (
        <div className={styles.subresult}>
            <div className={styles["subresultTitle"]}>{title}</div>
            <div className={styles["subresultMetadata"]}>
                <Markdown>{metadata}</Markdown>
            </div>
            <div className={styles["subresultResults"]}>
                {results.map((result, index) => (
                    <ResultUnit key={index} {...result} />
                ))}
            </div>
        </div>
    );
};

const Results: React.FC<{ remoteResult: SubResultIF[] }> = ({
    remoteResult,
}) => {
    return (
        <div className={styles.results}>
            {remoteResult.length > 0 ? (
                remoteResult.map((subresult, index) => (
                    <SubResultUnit key={index} {...subresult} />
                ))
            ) : (
                <div className={styles["noResults"]}>No results</div>
            )}
        </div>
    );
};

const RemoteResult: React.FC<{ name: string }> = ({ name }) => {
    const { query } = useContext(queryContext);

    const [content, setContent] = useState<JSX.Element>();
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        (async () => {
            if (query) {
                const response = await fetch(`/api/sources/${name}?q=${query}`);
                if (response.ok) {
                    const remoteResult: SubResultIF[] = await response.json();

                    const jsxContent: JSX.Element = (
                        <Results remoteResult={remoteResult} />
                    );

                    setContent(jsxContent);
                } else if (response.status === 404) {
                    setNotFound(true);
                }
            }
        })();
    }, [name, query]);

    return !notFound ? (
        content ? (
            <Result name={name}>{content}</Result>
        ) : (
            <ResultFallback />
        )
    ) : (
        <></>
    );
};

export default RemoteResult;
