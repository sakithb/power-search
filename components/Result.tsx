import { useContext } from "react";
import { sourcesContext, SourcesIF } from "../pages/_app";
import styles from "../styles/Result.module.css";

interface ResultProps {
	name: string;
}

const Result: React.FC<ResultProps> = ({ name, children }) => {
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
					dangerouslySetInnerHTML={{ __html: source.svg }}
				></div>
				<span className={styles.title}>{source.name}</span>
			</div>

			<div className={styles.content}>{children}</div>
		</div>
	);
};

export default Result;
