# Sklep Motoryzacyjny - Aplikacja Frontendowa (partsShopFront)

## Zespół Projektowy
- Dmytro Potapchuk
- Jakub Laskowski

## Opis Projektu
Interfejs użytkownika dla internetowego sklepu motoryzacyjnego "AutoMax". Umożliwia użytkownikom przeglądanie produktów, rejestrację, logowanie, zarządzanie koszykiem oraz składanie zamówień. Zbudowany przy użyciu biblioteki React oraz narzędzia Vite.

## Główne Funkcjonalności
- Rejestracja i logowanie użytkowników.
- Przeglądanie listy dostępnych części samochodowych.
- Filtrowanie i wyszukiwanie produktów (jeśli zaimplementowane).
- Funkcjonalność koszyka (dodawanie, usuwanie, modyfikacja ilości).
- Symulacja procesu składania zamówienia.
- Panel administracyjny do zarządzania produktami (dodawanie, edycja, usuwanie części).
- Możliwość wyświetlania historii zamówień (jeśli zaimplementowane).

## Technologie
- **Biblioteka UI:** React
- **Język:** TypeScript
- **Narzędzia Budowania:** Vite
- **Routing:** React Router DOM
- **Zarządzanie Stanem:** React Context API / useState / useEffect (lub inna biblioteka, jeśli użyta, np. Redux, Zustand)
- **Komunikacja z API:** Axios (lub `fetch` API)
- **Stylizacja:** CSS Modules (lub inna metoda, np. Styled Components, Tailwind CSS)

## Wymagania Wstępne
- Node.js (zalecana wersja LTS, np. v18.x lub nowsza)
- Menedżer pakietów npm lub yarn

## Instalacja i Uruchomienie Lokalne

1.  **Klonowanie Repozytorium:**
    ```bash
    git clone <URL_TWOJEGO_REPOZYTORIUM_FRONTENDU>
    cd partsShopFront
    ```

2.  **Instalacja Zależności:**
    ```bash
    npm install
    ```
    lub jeśli używasz yarn:
    ```bash
    yarn install
    ```

3.  **Konfiguracja Środowiska:**
    * Upewnij się, że adres URL backendu API jest poprawnie skonfigurowany. Zazwyczaj znajduje się to w pliku konfiguracyjnym, np. `src/config/apiConfig.ts` lub w zmiennych środowiskowych (`.env` jeśli projekt jest tak skonfigurowany).
      Przykład dla `src/config/apiConfig.ts`:
      ```typescript
      export const BASE_API_URL = "http://localhost:3000"; // Upewnij się, że port zgadza się z backendem
      ```
    * Aplikacja backendowa musi być uruchomiona, aby frontend mógł się z nią komunikować.

4.  **Uruchomienie Aplikacji (tryb deweloperski):**
    ```bash
    npm run dev
    ```
    lub
    ```bash
    yarn dev
    ```
    Aplikacja powinna być dostępna pod adresem `http://localhost:5173` (domyślny port Vite) lub innym wskazanym w konsoli.

## Dostępne Skrypty NPM/Yarn
- `npm run dev` / `yarn dev` - Uruchamia serwer deweloperski Vite z HMR (Hot Module Replacement).
- `npm run build` / `yarn build` - Buduje aplikację do wersji produkcyjnej (zazwyczaj do folderu `dist`).
- `npm run preview` / `yarn preview` - Uruchamia lokalny serwer do podglądu zbudowanej aplikacji produkcyjnej.
- `npm run lint` / `yarn lint` - Uruchamia ESLint do analizy kodu (jeśli skonfigurowany).

## Struktura Projektu (Główne Foldery)
- **`src/`**: Główny folder z kodem źródłowym aplikacji.
    - **`components/`**: Komponenty React (zarówno strony, jak i mniejsze, reużywalne elementy UI).
    - **`services/`**: Logika komunikacji z backend API (np. `authService.ts`, `partsService.ts`).
    - **`config/`**: Pliki konfiguracyjne (np. `apiConfig.ts`).
    - **`types/`**: Definicje typów TypeScript (np. interfejsy `Part`, `User`).
    - **`styles/`**: Globalne style CSS (np. `global.css`).
    - **`App.tsx`**: Główny komponent aplikacji, zawierający logikę routingu.
    - **`main.tsx`**: Punkt wejściowy aplikacji React.

---