// src/components/PartsList.tsx
import React, { useEffect, useState } from "react";
import { deletePart, fetchParts, purchasePart } from "../services/partsService";
import { Part, User } from "../types.tsx";
import { getRole } from "../services/authService";
import styles from "./PartsList.module.css"; // Zakładamy, że plik jest w tym samym folderze

interface PartsListProps {
    partsUpdateTrigger: number;
    onEditPart: (part: Part) => void;
}

export const PartsList: React.FC<PartsListProps> = ({ partsUpdateTrigger, onEditPart }) => {
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<User['role'] | null>(null);

    useEffect(() => {
        setUserRole(getRole());
    }, []);

    useEffect(() => {
        const loadParts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchParts();
                // console.log("Dane części z API (do diagnostyki):", data);
                setParts(data);
            } catch (err: any) {
                const errorMessage = typeof err === 'string' ? err : (err?.message || "Nie udało się załadować listy części.");
                setError(errorMessage);
                console.error("Error fetching parts:", err);
            } finally {
                setLoading(false);
            }
        };
        loadParts();
    }, [partsUpdateTrigger]);

    const handleDelete = async (partId: number) => {
        if (window.confirm("Czy na pewno chcesz usunąć tę część?")) {
            try {
                await deletePart(partId);
                setParts(prevParts => prevParts.filter(p => p.id !== partId));
            } catch (err: any) {
                const errorMessage = typeof err === 'string' ? err : (err?.message || "Nie udało się usunąć części.");
                alert(errorMessage);
                console.error("Error deleting part:", err);
            }
        }
    };

    const handlePurchase = async (partId: number) => {
        try {
            const updatedPart = await purchasePart(partId, 1);
            alert("Część została pomyślnie zakupiona!");
            setParts(prevParts =>
                prevParts.map(p =>
                    p.id === partId ? { ...p, stock: updatedPart.stock } : p // Aktualizuj stan na podstawie odpowiedzi API
                )
            );
        } catch (err: any) {
            const errorMessage = typeof err === 'string' ? err : (err?.message || "Nie udało się zakupić części.");
            alert(errorMessage);
            console.error("Error purchasing part:", err);
        }
    };

    if (loading) return <div className="loading-spinner"></div>;
    if (error) return <p className={`${styles.errorText} error-message`}>{error}</p>;

    return (
        <div className={styles.partsListContainer}>
            <h2 className={styles.listTitle}>Dostępne Części</h2>
            {parts.length === 0 && !loading && <p className={styles.noPartsMessage}>Brak dostępnych części.</p>}
            <div className={styles.partsGrid}>
                {parts.map((part) => (
                    <div key={part.id} className={styles.partCard}>
                        <h3 className={styles.partName}>{part.name}</h3>
                        <p className={styles.partDescription}>{part.description || "Brak opisu."}</p>
                        <div className={styles.partDetails}>
                            <p className={styles.partPrice}>
                                Cena: <span>
                                    {typeof part.price === 'number'
                                        ? part.price.toFixed(2)
                                        : (typeof part.price === 'string' && !isNaN(parseFloat(part.price))
                                                ? parseFloat(part.price).toFixed(2)
                                                : 'N/A'
                                        )
                                    } PLN
                                </span>
                            </p>
                            <p className={part.stock > 0 ? styles.partStockAvailable : styles.partStockUnavailable}>
                                Dostępność: <span>{part.stock > 0 ? `${part.stock} szt.` : "Niedostępna"}</span>
                            </p>
                        </div>
                        <div className={styles.cardActions}>
                            {(userRole === "client" || userRole === "admin") && part.stock > 0 && (
                                <button onClick={() => handlePurchase(part.id)} className="button-secondary">Kup</button>
                            )}
                            {userRole === "admin" && (
                                <>
                                    <button onClick={() => onEditPart(part)} className={`${styles.actionButton} ${styles.editButton}`}>Edytuj</button>
                                    <button onClick={() => handleDelete(part.id)} className={`${styles.actionButton} button-danger`}>Usuń</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};