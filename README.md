# E-Commerce Architetture Distribuite

## Architettura

Il progetto utilizza un'architettura **client-server**.

Il frontend è sviluppato in **HTML, CSS e Vanilla JavaScript**, mentre il backend è sviluppato in **Node.js con Express**.

Il client può essere considerato un **Thin Client**, perché la logica principale (acquisti, controllo crediti e stock) viene gestita dal server.

---

## Endpoint API

### Prodotti

GET /api/products  
Ritorna il catalogo prodotti.

### Utenti

GET /api/users/:id  
Ritorna le informazioni di un utente.

### Acquisto

POST /api/purchase  
Permette ad un utente di acquistare un prodotto.

Payload JSON:

```json
{
  "userId": 1,
  "productId": 2
}

Admin

POST /api/admin/products
Aggiunge un nuovo prodotto.

PUT /api/admin/products/:id/stock
Modifica lo stock di un prodotto.

PUT /api/admin/users/:id/credits
Aggiunge crediti ad un utente.

Sicurezza

I controlli principali sono implementati lato server:

blocco acquisto se i crediti dell'utente sono insufficienti

blocco acquisto se il prodotto è esaurito

verifica esistenza utente e prodotto

In caso di errore il server restituisce HTTP status appropriati (400 o 404).

Link

Backend deployato:

https://tpsiai.onrender.com

Frontend deployato:

https://cavajo.github.io/tpsiAI/frontend/index.html