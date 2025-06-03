// src/services/partsService.ts
import axios from "axios";
import { BASE_API_URL } from "../config/apiConfig";
import { Part } from "../types.tsx";
import { getToken } from "./authService";

const PARTS_API_URL = `${BASE_API_URL}/parts`;

const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchParts = async (): Promise<Part[]> => {
    try {
        const response = await axios.get<Part[]>(PARTS_API_URL, {
            headers: getAuthHeaders(), // Zakładamy, że lista części może być chroniona
        });
        return response.data;
    } catch (error) {
        // Tutaj możesz dodać bardziej szczegółową obsługę błędów lub logowanie
        console.error("Error fetching parts:", error);
        throw error; // Rzuć błąd dalej, aby komponent mógł go obsłużyć
    }
};

export const addPart = async (partData: Omit<Part, "id">): Promise<Part> => {
    try {
        const response = await axios.post<Part>(PARTS_API_URL, partData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error adding part:", error);
        throw error;
    }
};

export const updatePart = async (id: number, updateData: Partial<Omit<Part, "id">>): Promise<Part> => {
    try {
        const response = await axios.put<Part>(`${PARTS_API_URL}/${id}`, updateData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error updating part:", error);
        throw error;
    }
};

export const deletePart = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${PARTS_API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Error deleting part:", error);
        throw error;
    }
};

export const purchasePart = async (id: number, quantity: number): Promise<Part> => { // Lub inny typ odpowiedzi
    try {
        const response = await axios.post<Part>( // Zakładamy, że zwraca zaktualizowaną część
            `${PARTS_API_URL}/${id}/purchase`,
            { quantity },
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Error purchasing part:", error);
        throw error;
    }
};