

# GM dApp

## Opis projektu

GM dApp to zdecentralizowana aplikacja pozwalająca użytkownikom wysyłać powitania "gm" (good morning) na blockchainie. Każdy może wysłać dowolną liczbę "gm" dziennie, a wszystkie interakcje są publicznie rejestrowane w smart kontrakcie.

- Wysyłanie powitania "gm" z opcjonalną wiadomością.
- Podgląd całkowitej liczby wysłanych "gm".
- Statystyki dzienne: ile "gm" wysłano danego dnia.
- Statystyki użytkownika: ile "gm" wysłał dany adres oraz historia z datami.
- Odczyt ostatniego powitania (adres, wiadomość, data).


## Smart kontrakt (Solidity)

Kontrakt `GM` rejestruje wszystkie powitania i udostępnia funkcje do pobierania statystyk:

- `sendGM(string message)` — wysyła "gm" z opcjonalną wiadomością
- `getLastGM()` — zwraca ostatniego nadawcę, wiadomość i timestamp
- `getTotalCount()` — zwraca całkowitą liczbę "gm"
- `getDailyCount(uint256 day)` — zwraca liczbę "gm" danego dnia (day = timestamp / 1 days)
- `getUserCount(address user)` — zwraca liczbę "gm" wysłanych przez użytkownika
- `getUserGmTimestamps(address user)` — zwraca tablicę timestampów wszystkich wysłanych "gm" przez użytkownika

Każde wywołanie `sendGM` emituje zdarzenie `GMEvent` z adresem nadawcy, wiadomością i timestampem.


## Licencja

MIT
