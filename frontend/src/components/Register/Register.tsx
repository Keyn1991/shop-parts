// src/components/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services";
import styles from "../styles/AuthForm.module.css"; // <<< UŻYJ TYCH SAMYCH STYLÓW CO LOGIN

export const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError("Hasła nie są identyczne.");
            return;
        }
        if (password.length < 6) { // Przykładowa walidacja długości hasła
            setError("Hasło musi mieć co najmniej 6 znaków.");
            return;
        }

        setIsLoading(true);
        try {
            await register({ username, password });
            setSuccessMessage("Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.");
            setTimeout(() => {
                navigate("/login");
            }, 2500); // Dłuższe opóźnienie dla przeczytania wiadomości
        } catch (err: any) {
            const errorMessage = typeof err === 'string' ? err : (err?.message || "Wystąpił błąd podczas rejestracji.");
            setError(errorMessage);
            console.error("Błąd rejestracji:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Użyj tej samej struktury JSX co w Login.tsx
    return (
        <div className={styles.loginPageContainer}> {/* Użyj .loginPageContainer */}
            <div className={styles.graphicSide}>
                <div className={styles.circleYellow}></div>
                <div className={styles.circleBlue}></div>
            </div>
            <div className={styles.loginFormSide}> {/* Użyj .loginFormSide */}
                <div className={styles.loginBox}> {/* Użyj .loginBox */}
                    <h2 className={styles.loginTitle}>STWÓRZ KONTO</h2> {/* Zmieniony tytuł, ale ta sama klasa CSS */}

                    {successMessage && <p className={styles.successText}>{successMessage}</p>} {/* Dodana klasa dla sukcesu */}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                id="username"
                                placeholder="Login"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.inputField}
                                required
                                disabled={isLoading || !!successMessage}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                id="password"
                                placeholder="Hasło (min. 6 znaków)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.inputField}
                                required
                                disabled={isLoading || !!successMessage}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Potwierdź hasło"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.inputField}
                                required
                                disabled={isLoading || !!successMessage}
                            />
                        </div>
                        {error && <p className={styles.errorText}>{error}</p>}
                        <button type="submit" className={styles.button} disabled={isLoading || !!successMessage}>
                            {isLoading ? "REJESTROWANIE..." : "ZAREJESTRUJ SIĘ"}
                        </button>
                    </form>
                    <p className={styles.link}>
                        Masz już konto? <a href="/Login/Login">Zaloguj się</a>
                    </p>
                </div>
            </div>
        </div>
    );
};