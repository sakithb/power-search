import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useContext } from "react";
import { createContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { sourcesContext } from "./_app";

import RemoteResult from "../components/RemoteResult";
import styles from "../styles/Search.module.css";

export const queryContext = createContext<string>("");

const Search: NextPage = () => {
	const sources = useContext(sourcesContext);

	const router = useRouter();
	const { q: query } = router.query as { [q: string]: string };

	const searchValue = useRef<HTMLInputElement>(null);

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

	useEffect(() => {
		(searchValue.current as HTMLInputElement).value = query;
	}, [query]);

	return (
		<queryContext.Provider value={query}>
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
							}}
						>
							<FiSearch />
						</button>
					</div>
				</div>
				<div className={styles.options}>
					<div className={styles.optionsTitle}>Filter</div>
					<div className={styles.optionsDropdown}>
						<select>
							<option value="all">All</option>
							{Object.keys(sources).map((source, index) => (
								<option key={index} value={source}>
									{sources[source]?.name}
								</option>
							))}
						</select>
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
