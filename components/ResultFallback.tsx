import styles from "../styles/ResultFallback.module.css";

const ResultFallback: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.image}></div>
                <span className={styles.title}></span>
            </div>
            <div className={styles.subResults}></div>
        </div>
    );
};

export default ResultFallback;
