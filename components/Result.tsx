import { useContext } from "react";
import { sourcesContext, SourcesIF } from "../pages/_app";
import styles from "../styles/Result.module.css";

interface ResultProps {
    name: string;
    subResults: {
        title: string;
        results?: JSX.Element[];
    }[];
}

const Result: React.FC<ResultProps> = ({ name, subResults }) => {
    const sources = useContext(sourcesContext) as SourcesIF;

    const source = sources[name];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div
                    style={{
                        fill: source.color,
                    }}
                    className={styles.image}
                    dangerouslySetInnerHTML={{ __html: source.svg }}></div>
                <span className={styles.title}>{source.name}</span>
            </div>

            <div className={styles.subResults}>
                {subResults.map((subResult, index) => {
                    return (
                        <div key={index} className={styles.subResult}>
                            <span className={styles.subResultTitle}>{subResult.title}</span>
                            {subResult.results && (
                                <div className={styles.results}>
                                    {subResult.results.map((result, index) => {
                                        return (
                                            <div key={index} className={styles.result}>
                                                {result}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Result;
