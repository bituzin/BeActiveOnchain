# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
## Kontrakt GM (Solidity)

Kontrakt `GM` pozwala każdemu użytkownikowi wysyłać dowolną liczbę powitań "gm" każdego dnia. Umożliwia śledzenie:
- Całkowitej liczby wysłanych "gm" (`totalCount`)
- Liczby "gm" wysłanych danego dnia (`getDailyCount(day)`)
- Liczby "gm" wysłanych przez danego użytkownika (`getUserCount(address)`)
- Historii wysyłek użytkownika z datami (`getUserGmTimestamps(address)`)

### Funkcje kontraktu

- `sendGM(string message)` — wysyła "gm" z opcjonalną wiadomością
- `getLastGM()` — zwraca ostatniego nadawcę, wiadomość i timestamp
- `getTotalCount()` — zwraca całkowitą liczbę "gm"
- `getDailyCount(uint256 day)` — zwraca liczbę "gm" danego dnia (day = timestamp / 1 days)
- `getUserCount(address user)` — zwraca liczbę "gm" wysłanych przez użytkownika
- `getUserGmTimestamps(address user)` — zwraca tablicę timestampów wszystkich wysłanych "gm" przez użytkownika

Każde wywołanie `sendGM` emituje zdarzenie `GMEvent` z adresem nadawcy, wiadomością i timestampem.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
