import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { FiCopy, FiX } from "react-icons/fi";

import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Donate.module.css";

interface DonateEntryProps {
    name: string;
    icon: JSX.Element;
    value: string;
}

const DonateEntry: React.FC<DonateEntryProps> = ({ name, icon, value }) => {
    const [copied, setCopied] = useState(false);

    const copyValue = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    return (
        <div className={styles.donateEntry} title={name}>
            <div className={styles.donateEntryName}>{name}</div>
            <div className={styles.donateEntryIcon}>{icon}</div>
            <div className={styles.donateEntryText}>{value}</div>
            <div className={styles.donateEntryCopyIcon} onClick={copyValue}>
                <FiCopy />
            </div>
            <div
                style={{
                    transform: copied ? "translateX(-100%)" : "translateX(0%)",
                }}
                className={styles.donateEntryCopiedText}>
                Copied
            </div>
        </div>
    );
};

interface DonateProps {
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Donate: React.FC<DonateProps> = ({ modalOpen, setModalOpen }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (modalOpen) {
            containerRef.current?.style.setProperty("opacity", "1");
            modalRef.current?.style.setProperty("transform", "translateY(0%)");
        }
    }, [modalOpen]);

    return (
        <div ref={containerRef} className={styles.container}>
            <div ref={modalRef} className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>Buy me a coffee</div>
                    <div
                        className={styles.headerCloseButton}
                        onClick={() => {
                            containerRef.current?.style.setProperty(
                                "opacity",
                                "0"
                            );
                            modalRef.current?.style.setProperty(
                                "transform",
                                "translateY(-100vh)"
                            );
                            setTimeout(() => {
                                setModalOpen(false);
                            }, 200);
                        }}>
                        <FiX />
                    </div>
                </div>
                <div className={styles.body}>
                    <DonateEntry
                        name="Bitcoin"
                        icon={<FaBitcoin />}
                        value="bc1qucukywjlqxznjk4uwueprg779k233lulvthl6v"
                    />
                    <DonateEntry
                        name="Ethereum"
                        icon={<FaEthereum />}
                        value="0xDf6A1C0905ff1571d20D1445E9082a0cF5892650"
                    />
                </div>
            </div>
        </div>
    );
};

export default Donate;
