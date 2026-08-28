# 💳 Guida Configurazione e Gestione Pagamenti Stripe — DocSweep

Questa guida spiega in dettaglio come funzionano i pagamenti su **DocSweep**, come configurare i Payment Link e come monitorare gli incassi direttamente dalla tua dashboard di Stripe.

---

## ⚡ 1. Come funzionano i pagamenti in DocSweep

Il modello commerciale di DocSweep è **"Pay to finish the job"** (pagamento una tantum, zero abbonamenti ricorrenti).

```
1. L'utente carica > 10 PDF
        ↓
2. Si apre la modale Paywall con le 3 opzioni (€2.99 / €4.99 / €9.99)
        ↓
3. L'utente clicca su una delle opzioni e viene reindirizzato al Payment Link di Stripe
        ↓
4. L'utente paga su Stripe con Carta / Apple Pay / Google Pay
        ↓
5. Stripe reindirizza l'utente a DocSweep con il parametro:
   https://tuo-dominio.onrender.com/?session_id={CHECKOUT_SESSION_ID}
        ↓
6. DocSweep chiama il backend /api/payment/verify-session che interroga Stripe
   con la tua STRIPE_API_KEY
        ↓
7. Se il pagamento risulta "paid", viene rilasciato un token JWT temporaneo (24h)
   e la sessione sblocca istantaneamente la ricerca su tutti i file!
```

---

## ⚙️ 2. Come configurare i 3 Payment Link su Stripe (5 minuti)

Per far sì che il tasto "Paga" porti al tuo checkout di Stripe reale:

1. Accedi alla tua dashboard su **[dashboard.stripe.com](https://dashboard.stripe.com)**.
2. Nel menu in alto o a sinistra clicca su **Payment Links** (Link di pagamento) → **+ Nuovo**.
3. Crea 3 prodotti/link con prezzo una tantum:
   - **Link 1 (€2.99)** — Titolo: *DocSweep Batch Standard (100 PDF)*
   - **Link 2 (€4.99)** — Titolo: *DocSweep Audit Pro (500 PDF)*
   - **Link 3 (€9.99)** — Titolo: *DocSweep Power Batch (2000 PDF)*

4. **Impostazione Reindirizzamento Post-Pagamento (Fondamentale!)**:
   - Nella scheda **"Pagamento completato"** di ciascun Link, seleziona **"Reindirizza a un sito web"**.
   - Inserisci l'URL del tuo sito deployato (es. su Render), aggiungendo il tag di sessione di Stripe:
     ```
     https://docsweep.onrender.com/?session_id={CHECKOUT_SESSION_ID}
     ```
   *(Nota: Stripe sostituirà automaticamente `{CHECKOUT_SESSION_ID}` con l'ID reale del pagamento!)*

5. **Copia i 3 Link generati** (es. `https://buy.stripe.com/12345...`) ed inseriscili nel tuo file `.env` o nelle Environment Variables di Render:
   ```ini
   VITE_STRIPE_PAYMENT_LINK_299=https://buy.stripe.com/tuo_link_299
   VITE_STRIPE_PAYMENT_LINK_499=https://buy.stripe.com/tuo_link_499
   VITE_STRIPE_PAYMENT_LINK_999=https://buy.stripe.com/tuo_link_999
   ```

---

## 📊 3. Come verificare l'arrivo dei soldi su Stripe

Puoi controllare in tempo reale gli incassi direttamente da Stripe:

### A. Sezione Pagamenti (Transazioni in tempo reale)
1. Vai su **[dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)**.
2. Vedrai l'elenco di tutte le transazioni completate con:
   - **Importo** (€2.99 / €4.99 / €9.99)
   - **Stato** (Riuscito / Succeeded in verde)
   - **Email dell'acquirente**
   - **Data e Ora**

### B. Sezione Bonifici sul tuo Conto Corrente (Payouts)
1. Vai su **[dashboard.stripe.com/payouts](https://dashboard.stripe.com/payouts)**.
2. Qui puoi vedere la data in cui Stripe trasferirà automaticamente i fondi accumulati sul tuo conto bancario collegato (solitamente ogni 2-7 giorni a seconda delle impostazioni del tuo account).

### C. Notifiche Email
Puoi attivare le notifiche email ad ogni vendita:
1. Vai su **Impostazioni** (in alto a destra) → **Notifiche**.
2. Spunta **"Inviami un'email quando un pagamento ha esito positivo"**.

---

## 🛡️ 4. Modalità Demo / Test integrata

Se la chiave Stripe non è configurata o un utente clicca sul tasto di prova nella modale, DocSweep attiva la **Modalità Demo**, permettendo di testare istantaneamente tutte le funzionalità premium senza addebitare denaro.
