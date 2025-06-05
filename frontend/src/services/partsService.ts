import axios from "axios";
import { BASE_API_URL } from "../config"; // Upewnij się, że ten plik istnieje i eksportuje BASE_API_URL
import { Part } from "../types"; // Upewnij się, że ten plik istnieje i eksportuje typ Part
import { getToken } from "./authService"; // Upewnij się, że ten plik istnieje

const PARTS_API_URL = `${BASE_API_URL}/parts`;

export interface FetchPartsParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'name' | 'price' | 'stock';
    sortOrder?: 'ASC' | 'DESC';
}

// Ten interfejs definiuje, czego frontend oczekuje
export interface PaginatedPartsResponse {
    items: Part[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
}

const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchParts = async (params?: FetchPartsParams): Promise<PaginatedPartsResponse> => {
    try {
        // Używamy <any> dla axios.get, ponieważ nie wiemy na pewno, czy API zwróci PaginatedPartsResponse czy Part[]
        const response = await axios.get<any>(PARTS_API_URL, {
            headers: getAuthHeaders(),
            params: params,
        });

        let itemsToProcess: Part[] = [];
        let finalPaginatedResponse: PaginatedPartsResponse;

        if (Array.isArray(response.data)) {
            // Przypadek 1: API zwróciło bezpośrednio tablicę części (np. response.data to Part[])
            console.warn(
                "Odpowiedź API to bezpośrednio tablica części. Tworzenie obiektu PaginatedPartsResponse.",
                response.data
            );
            itemsToProcess = response.data as Part[];
            // Tworzymy "sztuczny" obiekt PaginatedPartsResponse
            // UWAGA: Poniższe wartości dla paginacji są tylko szacunkami, jeśli API nie dostarcza tych danych.
            finalPaginatedResponse = {
                items: itemsToProcess, // Zostaną zaktualizowane po przetworzeniu cen
                totalItems: itemsToProcess.length, // To będzie tylko liczba itemów na bieżącej stronie
                totalPages: 1, // Nie mamy tej informacji, zakładamy 1 stronę (lub params.page jeśli jest ostatnią)
                currentPage: params?.page || 1,
                itemsPerPage: params?.limit || itemsToProcess.length || 10, // Użyj limitu z params lub długości tablicy
            };
        } else if (response.data && Array.isArray(response.data.items)) {
            // Przypadek 2: API zwróciło oczekiwany obiekt PaginatedPartsResponse
            itemsToProcess = response.data.items as Part[];
            finalPaginatedResponse = response.data as PaginatedPartsResponse;
        } else {
            // Przypadek 3: Nieoczekiwana struktura odpowiedzi
            console.error(
                "Odpowiedź API ma nieoczekiwaną strukturę (ani tablica, ani obiekt z 'items'):",
                response.data
            );
            // Zwróć pustą, ale poprawną strukturę
            return {
                items: [],
                totalItems: 0,
                totalPages: 0,
                currentPage: params?.page || 1,
                itemsPerPage: params?.limit || 10,
            };
        }

        // Konwersja ceny na number, jeśli backend wysyła ją jako string
        const itemsWithNumericPrice = itemsToProcess.map(part => ({
            ...part,
            price: typeof part.price === 'string' ? parseFloat(part.price) : part.price,
        }));

        // Zwróć pełny obiekt PaginatedPartsResponse, aktualizując pole 'items'
        return {
            ...finalPaginatedResponse,
            items: itemsWithNumericPrice,
        };

    } catch (error) {
        console.error("Błąd w fetchParts (partsService):", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Nie udało się pobrać listy części (błąd serwera).");
        }
        throw new Error("Nie udało się pobrać listy części z powodu nieznanego błędu (w usłudze).");
    }
};

// Typ dla danych wejściowych przy tworzeniu części
export interface CreatePartPayload extends Omit<Part, "id" | "price" | "stock"> {
    name: string;
    description?: string;
    price: number; // Upewnij się, że wysyłasz jako number
    stock: number; // Upewnij się, że wysyłasz jako number
    // Dodaj inne wymagane pola, jeśli są
}

export const addPart = async (partData: CreatePartPayload): Promise<Part> => {
    try {
        const response = await axios.post<Part>(PARTS_API_URL, partData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Błąd w addPart (partsService):", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Nie udało się dodać części.");
        }
        throw new Error("Nie udało się dodać części z powodu nieznanego błędu.");
    }
};

// Typ dla danych wejściowych przy aktualizacji części
export interface UpdatePartPayload extends Partial<CreatePartPayload> {}

export const updatePart = async (id: number, updateData: UpdatePartPayload): Promise<Part> => {
    try {
        const response = await axios.put<Part>(`${PARTS_API_URL}/${id}`, updateData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Błąd w updatePart (partsService):", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Nie udało się zaktualizować części.");
        }
        throw new Error("Nie udało się zaktualizować części z powodu nieznanego błędu.");
    }
};

export const deletePart = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${PARTS_API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Błąd w deletePart (partsService):", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Nie udało się usunąć części.");
        }
        throw new Error("Nie udało się usunąć części z powodu nieznanego błędu.");
    }
};

export const purchasePart = async (id: number, quantity: number): Promise<Part> => {
    try {
        const response = await axios.post<Part>(
            `${PARTS_API_URL}/${id}/purchase`,
            { quantity },
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Błąd w purchasePart (partsService):", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Nie udało się zakupić części.");
        }
        throw new Error("Nie udało się zakupić części z powodu nieznanego błędu.");
    }
};