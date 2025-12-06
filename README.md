# 🌟 Celo GM Dapp

Aplikacja decentralizowana (Dapp) do wysyłania wiadomości "GM" (Good Morning) on-chain na sieci Celo.

## 📋 Opis projektu

Projekt składa się z dwóch głównych części:
1. **Smart Contract** - Prosty kontrakt Solidity (`GM.sol`) do zapisywania wiadomości na blockchainie
2. **Frontend** - Aplikacja React z żółtym tłem (kolory Celo) i przyciskami do interakcji z kontraktem

## 🚀 Funkcjonalności

- ✅ Połączenie z portfelem MetaMask
- ✅ Deployowanie kontraktu GM na sieć Celo
- ✅ Wysyłanie wiadomości "gm" on-chain
- ✅ Odczytywanie ostatniej wysłanej wiadomości
- ✅ Interakcja z istniejącym kontraktem (podając adres)
- ✅ Żółte tło w stylu sieci Celo

## 📦 Struktura projektu

```
gm/
├── contracts/
│   └── GM.sol           # Smart contract
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Główny komponent z logiką Web3
│   │   └── App.css      # Stylowanie (żółte tło Celo)
│   └── package.json
└── README.md
```

## 🛠️ Instalacja i uruchomienie

### Frontend

1. Przejdź do folderu frontend:
```bash
cd frontend
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom aplikację:
```bash
npm run dev
```

4. Otwórz przeglądarkę na `http://localhost:5173`

## 🔗 Konfiguracja sieci Celo w MetaMask

### Celo Alfajores Testnet
- **Nazwa sieci**: Celo Alfajores Testnet
- **RPC URL**: https://alfajores-forno.celo-testnet.org
- **Chain ID**: 44787
- **Symbol**: CELO
- **Block Explorer**: https://alfajores.celoscan.io

### Celo Mainnet
- **Nazwa sieci**: Celo Mainnet
- **RPC URL**: https://forno.celo.org
- **Chain ID**: 42220
- **Symbol**: CELO
- **Block Explorer**: https://celoscan.io

## 💰 Uzyskanie testowych CELO

Aby przetestować aplikację na sieci testowej Alfajores:
1. Przejdź do https://faucet.celo.org
2. Wklej swój adres portfela
3. Otrzymasz testowe tokeny CELO

## 📝 Jak używać aplikacji

1. **Połącz portfel**: Kliknij "Połącz MetaMask" i zatwierdź połączenie
2. **Zdeplojuj kontrakt**: Kliknij "Zdeplojuj kontrakt" aby wdrożyć nowy kontrakt GM
3. **Lub użyj istniejącego**: Wklej adres już wdrożonego kontraktu
4. **Wyślij wiadomość**: Wpisz wiadomość (domyślnie "gm!") i kliknij "Wyślij GM on-chain"
5. **Odczytaj wiadomości**: Kliknij "Odczytaj ostatnie GM" aby zobaczyć ostatnią wiadomość

## 🔐 Smart Contract

Kontrakt `GM.sol` zawiera:
- `sendGM(string message)` - wysyła wiadomość on-chain
- `getLastGM()` - zwraca ostatnią wiadomość i adres nadawcy
- `GMEvent` - event emitowany przy każdej nowej wiadomości

## 🎨 Design

Aplikacja wykorzystuje kolory sieci Celo:
- Żółte tło (`#FCFF52`, `#FBD943`)
- Zielone akcenty (`#35D07F`)
- Czyste i nowoczesne UI

## 🛡️ Bezpieczeństwo

⚠️ **Uwaga**: Ten projekt jest demonstracyjny. Przed użyciem w produkcji:
- Przeprowadź audyt smart contractu
- Dodaj dodatkowe zabezpieczenia
- Przetestuj na sieci testowej

## 📄 Licencja

MIT

## 🤝 Kontakt

Projekt stworzony do nauki Web3 i interakcji z blockchainem Celo.
