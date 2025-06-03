// src/components/PartForm.tsx
import React, { useState, useEffect } from "react";
import { addPart, updatePart } from "../services/partsService";
import { Part } from "../types";
import styles from "./PartForm.module.css";

interface PartFormProps {
    onFormSubmit: () => void; // Callback po pomyślnym dodaniu/aktualizacji
    editingPart: Part | null;
    clearEditingPart: () => void; // Do wyczyszczenia stanu edycji w nadrzędnym komponencie
}

const initialFormState: Omit<Part, "id"> = { name: "", description: "", price: 0, stock: 0 };

export const PartForm: React.FC<PartFormProps> = ({ onFormSubmit, editingPart, clearEditingPart }) => {
    const [partData, setPartData] = useState<Omit<Part, "id">>(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (editingPart) {
            setPartData({
                name: editingPart.name,
                description: editingPart.description,
                price: editingPart.price,
                stock: editingPart.stock,
            });
        } else {
            setPartData(initialFormState);
        }
    }, [editingPart]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPartData(prev => ({
            ...prev,
            [name]: name === "price" || name === "stock" ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (editingPart && editingPart.id) {
                await updatePart(editingPart.id, partData);
            } else {
                await addPart(partData);
            }
            setPartData(initialFormState); // Reset formularza
            clearEditingPart(); // Wyczyść stan edycji w App.tsx
            onFormSubmit(); // Odśwież listę części
        } catch (err: any) {
            setError(err?.message || "Wystąpił błąd podczas zapisywania danych.");
            console.error("Form submission error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.partFormContainer}>
            <h2 className={styles.formTitle}>{editingPart ? "Edytuj Część" : "Dodaj Nową Część"}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>Nazwa części</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="input-field"
                        value={partData.name}
                        onChange={handleChange}
                        required
                        placeholder="np. Filtr oleju XYZ123"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="description" className={styles.label}>Opis</label>
                    <textarea
                        id="description"
                        name="description"
                        className={`${"input-field"} ${styles.textareaField}`}
                        value={partData.description}
                        onChange={handleChange}
                        placeholder="np. Wysokiej jakości filtr oleju do silników benzynowych..."
                        rows={3}
                    />
                </div>
                <div className={styles.gridFields}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="price" className={styles.label}>Cena (PLN)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className="input-field"
                            value={partData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="stock" className={styles.label}>Ilość w magazynie</label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            className="input-field"
                            value={partData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            step="1"
                            placeholder="0"
                        />
                    </div>
                </div>
                {error && <p className={`${styles.errorText} error-message`}>{error}</p>}
                <div className={styles.buttonGroup}>
                    <button type="submit" className={`${styles.button} button-primary`} disabled={isLoading}>
                        {isLoading ? (editingPart ? "Zapisywanie..." : "Dodawanie...") : (editingPart ? "Zapisz zmiany" : "Dodaj część")}
                    </button>
                    {editingPart && (
                        <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={() => { clearEditingPart(); setPartData(initialFormState); setError(null); }} disabled={isLoading}>
                            Anuluj edycję
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};