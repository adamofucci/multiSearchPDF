# SUPER PROMPT — BUILD A MULTI-PDF SEARCH & DOCUMENT AUDIT WEB APP

## 0. RUOLO

Agisci come un **senior full-stack engineer, product designer, SEO specialist e growth/product strategist**.

Devi progettare e implementare da zero una web application SaaS/lightweight utility con un focus estremamente preciso:

> **Permettere all'utente di caricare molti PDF (anche in uno zip), cercare parole/frasi contemporaneamente in tutti i documenti e capire rapidamente quali documenti contengono o NON contengono determinati termini.**

Il prodotto deve essere estremamente semplice:

> **Upload → Search → Review → Export**

Non deve richiedere registrazione per l'utilizzo base.

Il prodotto deve essere progettato per poter essere utilizzato gratuitamente e successivamente monetizzato con **pagamenti una tantum**, senza abbonamento obbligatorio.

---

# 1. IDEA DEL PRODOTTO

Nome provvisorio:

**Bulk Document Search**

Il nome è provvisorio: proponi anche 10 nomi alternativi brevi, memorabili e adatti a un dominio .com.

### Value proposition

Il prodotto deve risolvere questo problema:

> "Ho decine o centinaia di PDF e devo trovare quali contengono una determinata parola, frase o clausola. Non voglio aprire ogni PDF manualmente."

Ma deve andare oltre la semplice ricerca testuale.

La caratteristica differenziante principale deve essere:

## DOCUMENT AUDIT

L'utente non deve soltanto poter cercare una parola.

Deve poter rispondere a domande come:

- Quali PDF contengono "GDPR"?
- Quali PDF NON contengono "GDPR"?
- Quali contratti contengono sia "recesso" sia "rinnovo"?
- Quali documenti contengono "durata" ma non "rinnovo automatico"?
- In quali documenti compare una determinata clausola?
- Quali documenti richiedono un controllo manuale?

Questa funzionalità è fondamentale perché differenzia il prodotto dai semplici "search multiple PDFs".

---

# 2. TARGET USERS

Progetta il prodotto principalmente per:

### Professionisti
- avvocati;
- commercialisti;
- consulenti;
- amministrativi;
- HR;
- project manager;
- agenti immobiliari;
- freelance;
- ricercatori.

### Aziende
- uffici amministrativi;
- procurement;
- legal;
- compliance;
- HR;
- document management.

### Utenti generici
- studenti;
- ricercatori;
- persone con grandi quantità di PDF;
- utenti che devono cercare informazioni in archivi di documenti.

Non rendere il prodotto eccessivamente tecnico.

L'utente non deve sapere cosa siano regex, parsing, indexing o text layers per utilizzare il prodotto.

---

# 3. PRINCIPIO UX

La UX principale deve essere estremamente semplice.

Homepage:

```text
Search across your PDFs

Find words, phrases and clauses across multiple PDF files.

No account required.
Your files stay on your device.

[ Drop PDFs here ]

or

[ Choose files ]
```

Dopo il caricamento:

```text
42 PDFs loaded

Search:
[ GDPR                              ]

[ Search ]

Options:
☐ Exact phrase
☐ Case sensitive
☐ Whole word
```

Risultati:

```text
42 documents searched

Found in: 31 documents
Not found in: 11 documents

--------------------------------

contract-001.pdf
Page 4
"...the company complies with GDPR..."

contract-002.pdf
Page 7
"...personal data..."

...

[ Export CSV ]
[ Download matching PDFs ]
```

---

# 4. FEATURE KILLER: DOCUMENT AUDIT

Implementa una modalità chiamata:

## Audit

L'utente può definire più criteri.

Esempio:

```text
Requirement 1
[ GDPR ]

Requirement 2
[ Right of withdrawal ]

Requirement 3
[ Automatic renewal ]

Requirement 4
[ Data retention ]
```

Il sistema produce:

| Document | GDPR | Withdrawal | Renewal | Data retention |
|---|---|---|---|---|
| contract-01.pdf | ✓ | ✓ | ✗ | ✓ |
| contract-02.pdf | ✓ | ✗ | ✓ | ✓ |
| contract-03.pdf | ✓ | ✓ | ✓ | ✗ |

Permetti di filtrare:

- all requirements present;
- missing at least one;
- missing specific requirement;
- all documents containing a specific term.

Questa tabella è uno degli elementi più importanti del prodotto.

---

# 5. RICERCA

La ricerca deve supportare almeno:

### Basic search

```text
GDPR
```

### Phrase search

```text
right of withdrawal
```

### Case insensitive search

Default: ON.

### Case sensitive

Opzionale.

### Whole word

Opzionale.

### Multiple terms

Permetti eventualmente:

```text
GDPR OR privacy
```

e:

```text
GDPR AND privacy
```

Non rendere la sintassi obbligatoria.

Fornisci una UI semplice.

### Regex

NON mostrarla nella UX principale.

Può essere una funzione Advanced.

---

# 6. RISULTATI

Per ogni documento mostra:

- nome file;
- stato: Found / Not found;
- numero di occorrenze;
- pagine interessate;
- snippet del testo;
- evidenziazione della parola cercata.

Esempio:

```text
contract-034.pdf

FOUND
7 matches
Pages: 2, 5, 8

"...the customer has the right of withdrawal..."
```

Cliccando sul risultato:

- mostra pagina;
- mostra contesto;
- evidenzia il match.

Se tecnicamente fattibile, crea un'anteprima della pagina PDF con il risultato evidenziato.

---

# 7. FILTRI

Permetti di filtrare i risultati:

```text
All
Found
Not found
Multiple matches
Needs review
```

Aggiungi ordinamento:

- nome file;
- numero match;
- numero pagina;
- found/not found.

---

# 8. EXPORT

Questa parte è fondamentale.

L'utente deve poter esportare:

### CSV

Colonne:

```text
filename
status
matches
pages
search_term
```

Per Audit:

```text
filename
GDPR
withdrawal
renewal
data_retention
```

### JSON

Opzionale.

### TXT

Opzionale.

### Download matching PDFs

Permetti:

```text
Download all matching PDFs
Download all PDFs WITHOUT a match
```

Quando possibile genera ZIP direttamente nel browser.

---

# 9. PRIVACY — MOLTO IMPORTANTE

Il prodotto deve essere progettato **client-first**.

Preferisci:

```text
User browser
    ↓
PDF parsing
    ↓
Text extraction
    ↓
Local index
    ↓
Search
    ↓
Results
```

e NON:

```text
User
 ↓
Upload PDFs
 ↓
Our server
 ↓
Parse
```

Per i PDF normalmente leggibili, l'obiettivo deve essere:

> **I documenti non lasciano il dispositivo dell'utente.**

Questo è un selling point importante.

Mostra chiaramente:

> 🔒 Your files stay on your device.

> No account required.

> We don't upload your PDFs.

NON fare promesse assolute se qualche feature futura richiederà server-side processing.

---

# 10. PDF PARSING

Frontend:

- React;
- TypeScript;
- Vite o framework equivalente;
- PDF.js o libreria affidabile per estrazione testo.

L'estrazione deve mantenere:

- testo;
- numero pagina;
- posizione quando possibile.

Costruisci un indice locale in memoria.

Per grandi quantità di documenti:

- evita di mantenere inutilmente copie duplicate del testo;
- usa strutture dati efficienti;
- considera Web Workers per non bloccare la UI;
- mostra progress bar.

---

# 11. GRANDI QUANTITÀ DI FILE

Il prodotto deve essere progettato per:

- 1 PDF;
- 10 PDF;
- 50 PDF;
- 100 PDF;
- eventualmente centinaia di PDF.

Mostra:

```text
Processing 34 / 100
```

Non bloccare il browser durante l'elaborazione.

Usa Web Workers dove appropriato.

Se vengono superati limiti ragionevoli:

```text
This browser session is getting large.

Try processing fewer files at once.
```

---

# 12. PDF SCANSIONATI / OCR

La V1 NON deve necessariamente implementare OCR server-side.

Deve però riconoscere i PDF senza text layer.

Mostra:

```text
6 documents appear to be scanned PDFs.

Text search cannot be performed on these files.
```

Poi presenta un upsell:

> **Make scanned PDFs searchable**

Questa sarà una futura funzione premium.

Potrebbe utilizzare OCR server-side.

---

# 13. ARCHITETTURA

Stack preferito:

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- PDF.js

### Backend

In V1 il backend può essere minimo.

Python può essere utilizzato successivamente per:

- OCR;
- heavy processing;
- API;
- payment verification;
- eventuali funzioni premium.

### Hosting

Frontend/backend compatibili con Render.

Il sistema deve essere facilmente deployabile su Render.

---

# 14. NIENTE DATABASE NELLA V1

Non introdurre un database senza necessità.

Non creare:

- user accounts;
- profiles;
- saved searches;
- document storage;
- document history.

La filosofia è:

> **No account. No database. No document storage.**

Questo riduce costi, complessità e problemi privacy.

---

# 15. MONETIZZAZIONE

Il modello commerciale NON deve essere subscription-first.

Il modello deve essere:

## FREE + ONE-TIME PAYMENTS

### Free

Esempio:

- fino a 10 PDF per elaborazione;
- ricerca base;
- risultati;
- export CSV;
- nessun account.

### One-time purchase

Proposta iniziale:

**€2.99**
- fino a 100 PDF;
- batch search.

**€4.99**
- fino a 500 PDF;
- audit mode;
- batch export;
- download matching/non-matching PDFs.

**€9.99**
- large batch;
- OCR credits / premium processing quando disponibile.

Questi prezzi sono ipotesi iniziali e devono essere facilmente modificabili.

NON implementare un sistema di pricing rigido.

---

# 16. MONETIZZAZIONE MIGLIORE

Il pagamento deve essere richiesto solo quando l'utente ha già visto il valore.

Esempio:

L'utente carica 100 PDF.

Il sistema elabora:

```text
100 PDFs loaded

10 PDF limit for free users.
```

Invece di bloccare immediatamente l'utente, valuta l'esperienza migliore:

```text
You have 100 PDFs.

Free: search up to 10 PDFs.

Unlock all 100 PDFs for €2.99

[ Unlock once — €2.99 ]
```

Il concetto fondamentale è:

> **Pay to finish the job.**

Non:

> Pay before you know if it works.

---

# 17. PAGAMENTI

Progetta l'integrazione per un payment provider che supporti pagamenti una tantum.

Possibili provider:

- Stripe Payment Links;
- Stripe Checkout;
- Lemon Squeezy;
- Paddle.

Preferenza iniziale:

**Stripe Checkout / Payment Links**, se compatibile con l'implementazione scelta.

Non costruire sistemi di pagamento custom.

Non salvare dati delle carte.

Dopo il pagamento:

```text
Payment successful.

Continue processing.
```

Per la V1, se possibile, usa un token temporaneo / signed URL / session identifier per autorizzare l'operazione premium senza creare un account permanente.

---

# 18. ECONOMICS

Il prodotto deve essere pensato per un obiettivo iniziale molto semplice:

## €300 / mese

Non assumere milioni di utenti.

Esempi:

### Scenario A

100 acquisti × €2.99 = €299

### Scenario B

60 acquisti × €4.99 = €299

### Scenario C

30 acquisti × €9.99 = €299

Il vero obiettivo è trovare una combinazione realistica di:

- traffico organico;
- conversion rate;
- average order value.

Non presentare questi numeri come previsioni garantite.

Sono scenari matematici di riferimento.

---

# 19. SEO — FONDAMENTALE

Il prodotto deve essere costruito pensando a Google fin dall'inizio.

NON fare solo:

```text
/
```

Crea landing page dedicate alle intenzioni di ricerca.

Possibili URL:

```text
/search-multiple-pdfs
/search-across-multiple-pdfs
/find-text-in-multiple-pdfs
/search-pdf-folder
/search-many-pdf-files
/find-word-in-multiple-pdfs
/pdf-document-audit
```

Per italiano:

```text
/cerca-in-piu-pdf
/cercare-in-piu-file-pdf
/cerca-testo-in-piu-pdf
```

NON creare pagine doorway sottili e duplicate.

Ogni pagina deve avere contenuto realmente utile e UX coerente con l'intento.

---

# 20. SEO LANDING PAGE

Ogni landing page deve avere:

### H1

Esempio:

> Search Multiple PDFs at Once

### Subheading

> Find words and phrases across hundreds of PDF files without opening them one by one.

### Tool

Il tool vero deve essere visibile subito.

Non mettere 800 parole prima del tool.

### Explanation

Spiega:

- come funziona;
- privacy;
- limiti;
- esempi;
- casi d'uso.

### FAQ

Esempi:

> Can I search multiple PDFs at once?

> Do you upload my PDFs?

> Can I search scanned PDFs?

> How many PDFs can I search?

> Can I export the results?

> Does it work on Mac and Windows?

---

# 21. SEO CONTENT STRATEGY

Crea contenuti orientati a problemi reali.

Esempi:

### How to search multiple PDFs at once

### How to find a word in multiple PDF files

### How to search an entire folder of PDFs

### How to find which PDFs contain a specific phrase

### How to check multiple contracts for a clause

### How to compare document requirements across PDFs

### How to find missing clauses in contracts

### How to search 100 PDF files at once

NON creare articoli generici solo per SEO.

Ogni articolo deve indirizzare naturalmente al tool.

---

# 22. GOOGLE SEARCH INTENT

La strategia SEO deve privilegiare query con intento operativo.

Target:

> "search multiple pdfs"

> "search multiple pdf files"

> "search across multiple pdfs"

> "find text in multiple pdfs"

> "find word in multiple pdfs"

> "search pdf folder"

> "search many pdfs at once"

Italiano:

> "cercare in più pdf"

> "cercare parola in più pdf"

> "cerca in più file pdf"

Non inventare volumi di ricerca.

Se non sono disponibili dati affidabili, indicare che sono da verificare con Google Search Console / Keyword Planner / Ahrefs / Semrush.

---

# 23. DIFFERENZIAZIONE

NON posizionare il prodotto semplicemente come:

> "Another PDF search tool."

Il messaggio principale deve essere:

# SEARCH + AUDIT

Esempio:

> **Search hundreds of PDFs in seconds.**
>
> Find what is there — and what is missing.

La seconda frase è importante.

---

# 24. USE CASES

La homepage deve mostrare esempi concreti.

### Contracts

> Find which contracts contain a specific clause.

### Compliance

> Check whether required terms appear across your documents.

### Research

> Search hundreds of papers and reports at once.

### Administration

> Find invoices, references or customer names across PDF archives.

### HR

> Search employee documents for specific terms.

### Legal

> Identify documents containing or missing specific clauses.

---

# 25. UX — STATO INIZIALE

Homepage minimalista.

Header:

```text
Logo

How it works
Privacy
Pricing
```

Hero:

```text
Search multiple PDFs at once.

Find words, phrases and missing clauses across your documents.

No account. No uploads.

[ Drop PDFs here ]

100% browser-based for normal text PDFs.
```

Non usare animazioni pesanti.

Performance prima di tutto.

---

# 26. UX — PROCESSING

Quando l'utente carica i file:

```text
Processing your PDFs...

████████████░░░░░░ 72%

72 / 100 documents

Currently processing:
contract_072.pdf
```

Gestire errori singolarmente:

```text
contract_034.pdf
Could not extract text.

Possible scanned PDF.
```

Non bloccare tutta l'elaborazione per un singolo file corrotto.

---

# 27. UX — SEARCH

Una volta terminato:

```text
100 PDFs ready.

What are you looking for?

[ __________________________ ]

Search
```

Sotto:

```text
Recent searches
```

solo per la sessione corrente.

NON salvarle sul server.

---

# 28. UX — RESULTS

Visualizzazione chiara.

Esempio:

```text
Search results

"GDPR"

31 / 100 documents contain this term.

69 documents don't.

------------------------------------

FOUND

contract-001.pdf
3 matches · pages 2, 4, 8

"...in accordance with GDPR..."

[View]

------------------------------------

contract-002.pdf
1 match · page 7

"...GDPR compliance..."

[View]
```

Aggiungi:

```text
[Show only documents WITHOUT match]
```

Questa CTA è importante.

---

# 29. AUDIT MODE UX

Modalità separata:

```text
Document Audit

Check multiple requirements across your PDFs.

Requirement
[ GDPR ]

Requirement
[ Right of withdrawal ]

Requirement
[ Automatic renewal ]

[ Run audit ]
```

Risultato:

```text
Audit results

100 documents checked.

87 passed all requirements.
13 need review.
```

Tabella:

```text
Document        GDPR   Withdrawal   Renewal
contract-01     ✓      ✓            ✓
contract-02     ✓      ✗            ✓
contract-03     ✓      ✓            ✗
```

CTA:

```text
[ Export CSV ]
[ Download documents needing review ]
```

---

# 30. ACCESSIBILITY

Implementa:

- keyboard navigation;
- semantic HTML;
- visible focus states;
- aria labels;
- contrast sufficiente;
- drag & drop con alternativa file picker;
- non affidarti esclusivamente al colore per indicare Found / Missing.

---

# 31. MOBILE

Il tool deve funzionare su mobile, ma riconosci che il caso d'uso principale è desktop.

Mobile:

- upload semplice;
- search;
- risultati leggibili;
- tabella audit scrollabile;
- export.

Desktop:

- sidebar filters;
- tabella più ricca;
- PDF preview.

---

# 32. PERFORMANCE

Obiettivi:

- homepage estremamente veloce;
- lazy load PDF.js;
- non caricare librerie pesanti prima dell'upload;
- Web Workers;
- streaming/progress dove possibile;
- evitare memory leak con Object URLs;
- liberare Blob/File references quando non servono.

Quando la sessione termina, rilascia la memoria.

---

# 33. SECURITY

Non fidarti delle estensioni dei file.

Verifica MIME/type quando possibile.

Gestisci:

- PDF corrotti;
- PDF protetti;
- PDF enormi;
- PDF con migliaia di pagine;
- file non-PDF rinominati `.pdf`.

Imponi limiti ragionevoli.

Non eseguire codice proveniente dai documenti.

Sanitizza qualunque testo eventualmente mostrato in HTML.

---

# 34. ANALYTICS

Aggiungi analytics rispettando la privacy.

Eventi utili:

```text
page_view
upload_started
files_selected
processing_started
processing_completed
search_performed
audit_started
export_csv
download_zip
ocr_needed
pricing_viewed
checkout_started
purchase_completed
```

NON inviare:

- contenuto dei PDF;
- parole cercate;
- nomi dei file;
- testo estratto.

L'analytics deve sapere che l'utente ha eseguito una ricerca, non cosa ha cercato.

---

# 35. PRODUCT FUNNEL

Traccia:

```text
Visitor
 ↓
Upload
 ↓
Processing
 ↓
First search
 ↓
Useful result
 ↓
Export
 ↓
Premium limit
 ↓
Checkout
 ↓
Purchase
```

Il KPI più importante inizialmente non è il traffico.

È:

> **% di visitatori che arrivano a fare una ricerca.**

Poi:

> **% che esportano risultati.**

Poi:

> **% che acquistano.**

---

# 36. GROWTH

NON partire con paid advertising.

Prima utilizzare:

### SEO

Landing pages per query specifiche.

### Reddit

Partecipare genuinamente a discussioni in cui il problema è rilevante.

NON spam.

### Product Hunt

Dopo aver raggiunto una V1 stabile.

### Hacker News

Se il prodotto ha una componente tecnica interessante, ad esempio:

> "We built a privacy-first multi-PDF search engine that runs entirely in your browser."

### Community

- legal tech;
- productivity;
- small business;
- researchers;
- accounting;
- developers.

---

# 37. VIRAL / SHAREABLE FEATURE

Dopo la V1 considera:

> **Share this tool**

e soprattutto risultati esportabili.

Esempio CSV:

```text
document,status,matches,pages
contract-001.pdf,found,4,"2,4,8"
contract-002.pdf,missing,0,
```

Questo può diventare utile professionalmente.

---

# 38. FUTURE FEATURES

NON implementarle nella V1, ma architettura pronta per:

### OCR

Search scanned PDFs.

### DOCX

Search multiple Word documents.

### TXT

Search text files.

### XLSX

Search spreadsheets.

### Email

Search EML/MSG.

### Regex

Advanced search.

### Boolean search

AND / OR / NOT.

### Saved audit templates

Richiederebbe eventualmente account/database.

### AI document extraction

Esempio:

```text
Extract:
Invoice number
Date
Customer
Total
```

da centinaia di PDF.

Questa potrebbe diventare una versione premium futura.

---

# 39. FUTURE HIGH-VALUE FEATURE

Una delle funzionalità future più importanti potrebbe essere:

## DOCUMENT REQUIREMENT CHECK

L'utente definisce:

```text
Required:
GDPR
termination clause
automatic renewal
data retention
```

Il tool produce:

```text
87 compliant
13 missing requirements
```

E permette:

```text
Download CSV
Download missing documents
```

Questa funzione deve essere progettata già a livello di architettura.

---

# 40. BRAND POSITIONING

Il brand deve comunicare:

- velocità;
- semplicità;
- privacy;
- utilità;
- zero frizione.

Non usare branding da enterprise SaaS pesante.

Tono:

> Simple.
> Fast.
> Private.

Possibili tagline:

> **Find what's inside your documents.**

> **Search hundreds of PDFs in seconds.**

> **Find what's there. Find what's missing.**

> **Stop opening PDFs one by one.**

L'ultima è particolarmente interessante come copy marketing.

---

# 41. PRICING PAGE

Pagina molto semplice:

## Free

€0

- 10 PDFs per session
- basic search
- CSV export
- no account

## One-time

€2.99

- 100 PDFs
- unlimited searches for the session
- audit mode
- batch export

## Power

€4.99 / €9.99

- 500+ PDFs
- advanced batch operations
- future OCR credits

Non mostrare necessariamente tutti i piani finché non è chiaro il comportamento degli utenti.

Il prezzo deve essere facilmente modificabile.

---

# 42. NO ACCOUNT PRINCIPLE

Il prodotto deve comunicare chiaramente:

> **No account required.**

L'utente non deve:

- creare password;
- verificare email;
- ricordarsi credenziali;
- creare workspace.

Questo è parte integrante del prodotto.

---

# 43. ERROR HANDLING

Messaggi umani.

NON:

```text
ERR_PDF_TEXT_LAYER_NULL
```

Sì:

> We couldn't extract text from this PDF. It may be scanned or password-protected.

Con eventuale:

> Try an OCR-enabled version.

---

# 44. EMPTY STATES

Esempio:

```text
No matches found.

We searched 100 PDFs.

No document contains:
"automatic renewal"

[Search again]
```

Ma distingui:

### Nessun risultato

dalla situazione:

### Impossibile cercare

perché il PDF è scansionato.

---

# 45. LEGAL / PRIVACY PAGE

Prepara pagine:

```text
/privacy
/terms
```

La privacy policy deve riflettere realmente l'architettura.

NON dichiarare che i dati non vengono mai elaborati server-side se in futuro OCR/payment analytics utilizzeranno server.

Per la V1 client-side, spiegare chiaramente:

- i PDF normali vengono elaborati nel browser;
- non vengono caricati al server per la ricerca;
- analytics non devono ricevere contenuto dei documenti.

---

# 46. TECHNICAL DELIVERABLES

Fornisci:

### Repository

```text
/apps/web
```

o struttura equivalente pulita.

### README

Deve spiegare:

- setup locale;
- installazione;
- sviluppo;
- build;
- deploy Render;
- environment variables;
- payment configuration;
- analytics;
- SEO.

### Environment variables

Esempio:

```text
VITE_ANALYTICS_ID=
STRIPE_PAYMENT_LINK=
```

Non inserire segreti nel frontend.

---

# 47. TESTING

Implementa test per:

### PDF parsing

- PDF semplice;
- multi-page;
- PDF con testo;
- PDF senza text layer;
- PDF corrotto.

### Search

- case insensitive;
- phrase;
- multiple matches;
- no match;
- Unicode;
- accented characters;
- punctuation.

### Audit

- all found;
- some missing;
- all missing.

### Export

- CSV;
- ZIP.

### UX

- upload;
- progress;
- cancellation;
- error recovery.

---

# 48. MVP DEFINITION

NON over-engineer.

La V1 deve avere:

### MUST HAVE

- drag & drop PDF;
- multi-file upload;
- local text extraction;
- progress;
- search;
- results per file;
- page numbers;
- snippets;
- Found / Not Found;
- filter;
- CSV export;
- download selected PDFs as ZIP;
- privacy messaging;
- responsive UI;
- SEO landing page;
- basic analytics;
- pricing/one-time payment architecture.

### NICE TO HAVE

- audit matrix;
- PDF page preview;
- boolean search;
- regex.

### POST-MVP

- OCR;
- DOCX;
- XLSX;
- AI extraction;
- saved audits.

---

# 49. IMPORTANT PRODUCT DECISION

Se devi scegliere tra:

**A. aggiungere una nuova feature**

e

**B. rendere più veloce e semplice l'esperienza principale**

scegli B.

Il prodotto deve poter essere spiegato in una frase:

> **Upload your PDFs, search them all at once, and see which documents contain what you're looking for.**

---

# 50. SUCCESS CRITERIA

Considera la V1 riuscita se un utente che arriva per la prima volta riesce a:

1. capire cosa fa il sito in meno di 5 secondi;
2. caricare PDF senza registrarsi;
3. vedere il progresso;
4. fare una ricerca;
5. capire immediatamente quali file contengono il termine;
6. vedere pagina e contesto;
7. trovare anche i file che NON contengono il termine;
8. esportare i risultati;
9. capire perché potrebbe pagare per elaborare più file.

---

# 51. PRODUCT PHILOSOPHY

Tieni sempre presenti queste regole:

### Rule 1
**No signup.**

### Rule 2
**No database in V1.**

### Rule 3
**Process documents locally whenever technically possible.**

### Rule 4
**Solve a painful batch task.**

### Rule 5
**Don't build a generic PDF toolbox.**

### Rule 6
**Search + Audit is the differentiator.**

### Rule 7
**One-time payment, not subscription.**

### Rule 8
**SEO first, paid advertising later.**

### Rule 9
**The user should get value before being asked to pay.**

### Rule 10
**Do not invent market/SEO data.**

---

# 52. FIRST DEVELOPMENT TASK

Prima di implementare tutto:

1. proponi 5 nomi per il prodotto;
2. proponi la struttura delle pagine;
3. proponi l'architettura tecnica;
4. identifica le librerie npm necessarie;
5. identifica eventuali problemi tecnici con PDF.js;
6. definisci esattamente cosa può essere eseguito client-side;
7. definisci i limiti della V1;
8. definisci il modello di pricing;
9. definisci il funnel;
10. definisci il piano SEO iniziale.

Poi procedi con l'implementazione.

NON fermarti a una semplice mockup UI.

Costruisci una **V1 realmente funzionante**.

---

# 53. PRIORITÀ ASSOLUTA

Il prodotto deve dare questa sensazione:

> **“Avevo 100 PDF. Ho trascinato tutto dentro, ho scritto una parola e in pochi secondi ho scoperto esattamente quali documenti mi interessavano. Non ho creato nessun account e non ho installato nulla.”**

Se l'esperienza non produce questa sensazione, il prodotto non è ancora sufficientemente semplice.

# END OF PROMPT