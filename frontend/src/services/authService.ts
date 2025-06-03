// src/services/authService.ts
import axios from 'axios';
import { BASE_API_URL } from '../config/apiConfig';
import { User } from '../types.tsx'; // Załóżmy, że User też tam jest

const AUTH_API_BASE = `${BASE_API_URL}/users`; // Lub np. /auth

interface LoginResponse extends User { // Zakładamy, że backend zwraca pełny obiekt User + token
    token: string;
}

interface RegisterPayload {
    username: string;
    password: string;
    // celowo nie wysyłamy roli z publicznego formularza
}

// Interfejs dla odpowiedzi z backendu po rejestracji (bez hasła)
interface RegisterResponse extends Omit<User, 'password'> {}


export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(`${AUTH_API_BASE}/login`, { username, password });
        if (response.data.token && response.data.role) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role); // Zapisujemy rolę
        }
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data; // Przekaż dalej obiekt błędu z backendu
        }
        throw new Error('An unexpected error occurred during login.');
    }
};


export const register = async (userData: RegisterPayload): Promise<RegisterResponse> => {
    try {
        const response = await axios.post<RegisterResponse>(`${AUTH_API_BASE}/register`, userData);
        return response.data; // Backend powinien zwrócić użytkownika bez hasła
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Przekaż dalej obiekt błędu z backendu, jeśli istnieje
            // Backend może zwrócić np. { message: "Użytkownik już istnieje" }
            throw error.response.data.message || error.response.data || new Error('Błąd rejestracji. Spróbuj ponownie.');
        }
        throw new Error('Wystąpił nieoczekiwany błąd podczas rejestracji.');
    }
};


export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Rozważ dispatch eventu lub inną metodę globalnej notyfikacji o wylogowaniu, jeśli potrzebne
};

export const getRole = (): User['role'] | null => {
    return localStorage.getItem('role') as User['role'] | null;
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
    return !!getToken(); // Proste sprawdzenie, czy token istnieje
};