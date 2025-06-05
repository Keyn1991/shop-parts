// src/App.tsx
import React, {useEffect, useState, useCallback, JSX} from "react"; // Dodano useCallback
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom"; // Dodano useLocation
import { Login } from "./components/Login/Login.tsx";
import { Register } from "./components/Register/Register.tsx"; // <<< NOWY IMPORT
import { PartForm } from "./components/PartForm";

import styles from "./App.module.css";
import { getRole, logout, isAuthenticated } from "./services";
import { User, Part } from "./types";
import {PartsList} from "./components/PartList";

// Komponent pomocniczy dla chronionych ścieżek
interface ProtectedRouteProps {
    isAllowed: boolean;
    redirectTo?: string;
    children: JSX.Element;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAllowed, redirectTo = "/login", children }) => {
    const location = useLocation();
    if (!isAllowed) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
    return children;
};

const App: React.FC = () => {
    const [currentUserRole, setCurrentUserRole] = useState<User['role'] | null>(getRole());
    const [partsUpdateTrigger, setPartsUpdateTrigger] = useState(0);
    const [editingPart, setEditingPart] = useState<Part | null>(null);
    // const location = useLocation(); // useLocation powinno być użyte w komponencie będącym dzieckiem Router,
    // lub w App jeśli App jest opakowane w Router w main.tsx.
    // Dla tej struktury, gdzie Router jest w App, użyjemy go w ProtectedRoute.

    // Użyj useCallback, aby uniknąć ponownego tworzenia funkcji w każdym renderze, jeśli przekazywana do useEffect
    const updateRole = useCallback(() => {
        setCurrentUserRole(getRole());
    }, []);

    useEffect(() => {
        updateRole(); // Ustaw rolę przy pierwszym renderowaniu
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "role" || event.key === "token") {
                updateRole();
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [updateRole]);

    const handleLoginSuccess = (role: User['role']) => {
        setCurrentUserRole(role);
        // Nawigacja jest obsługiwana w Login.tsx lub przez zmianę stanu isAuthenticated
    };

    const handleLogout = () => {
        logout();
        setCurrentUserRole(null);
        setEditingPart(null);
        // Przekierowanie do /login jest obsługiwane przez logikę Route i Navigate
    };

    const triggerPartsUpdate = () => {
        setPartsUpdateTrigger(prev => prev + 1);
    };

    const handleEditPart = (part: Part) => {
        setEditingPart(part);
        // Możesz zostawić lub usunąć, w zależności od preferencji UX
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearEditing = () => {
        setEditingPart(null);
    };

    const AdminPage: React.FC = () => (
        <div className={styles.adminSection}>
            <h1 className={styles.pageTitle}>Panel Administratora</h1> {/* Dodano tytuł dla spójności */}
            <PartForm
                onFormSubmit={() => {
                    triggerPartsUpdate();
                    clearEditing();
                }}
                editingPart={editingPart}
                clearEditingPart={clearEditing}
            />
            <PartsList
                partsUpdateTrigger={partsUpdateTrigger}
                onEditPart={handleEditPart}
            />
        </div>
    );

    const PartsPage: React.FC = () => ( // Dodano komponent dla /parts dla lepszej organizacji
        <div>
            <h1 className={styles.pageTitle}>Katalog Części</h1> {/* Dodano tytuł dla spójności */}
            <PartsList
                partsUpdateTrigger={partsUpdateTrigger}
                onEditPart={handleEditPart} // Admin może edytować także z tej listy
            />
        </div>
    );


    return (
        <Router>
            <div className={styles.appContainer}>
                <header className={styles.header}>
                    <Link to="/" className={styles.logo}>Sklep Części</Link>
                    <nav className={styles.nav}>
                        {isAuthenticated() ? ( // Pokaż te linki tylko jeśli użytkownik jest zalogowany
                            <>
                                <Link to="/parts" className={styles.navLink}>Części</Link>
                                {currentUserRole === "admin" && <Link to="/admin" className={styles.navLink}>Panel Admina</Link>}
                                <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutButton}`}>Wyloguj</button>
                            </>
                        ) : ( // Jeśli nie jest zalogowany, pokaż linki do logowania i rejestracji
                            <>
                                <Link to="/login" className={styles.navLink}>Zaloguj się</Link>
                                <Link to="/register" className={styles.navLink}>Zarejestruj się</Link> {/* <<< NOWY LINK */}
                            </>
                        )}
                    </nav>
                </header>

                <main className={styles.mainContent}>
                    <Routes>
                        <Route
                            path="/login"
                            element={!isAuthenticated() ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/parts" />}
                        />
                        <Route
                            path="/register"
                            element={!isAuthenticated() ? <Register /> : <Navigate to="/parts" />} // <<< NOWA ŚCIEŻKA
                        />
                        <Route
                            path="/parts"
                            element={
                                <ProtectedRoute isAllowed={isAuthenticated()} redirectTo="/login">
                                    <PartsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute isAllowed={isAuthenticated() && currentUserRole === "admin"} redirectTo="/parts">
                                    <AdminPage />
                                </ProtectedRoute>
                            }
                        />
                        {/* Domyślne przekierowanie */}
                        <Route
                            path="/"
                            element={<Navigate to={isAuthenticated() ? "/parts" : "/login"} />}
                        />
                        <Route
                            path="*"
                            element={<Navigate to={isAuthenticated() ? "/parts" : "/login"} />}
                        />
                    </Routes>
                </main>

                <footer className={styles.footer}>
                    <p>&copy; {new Date().getFullYear()} Sklep z Częściami. Wszelkie prawa zastrzeżone.</p>
                </footer>
            </div>
        </Router>
    );
};

export default App;