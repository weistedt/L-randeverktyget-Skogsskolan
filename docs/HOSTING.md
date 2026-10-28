# Skogsskolan på egen webbplats (Firebase)

Varför: i claude.ai kan bara ägaren spara i artefaktens databas. Vänner som öppnar länken kan bara läsa.
För att andra familjer ska kunna spara körs appen också på Firebase: Hosting + Google-inloggning + Firestore.

## Så hänger det ihop
- `src/family.js`: familjeregistret (barn, födelseår, nivå) och Firebase-inloggningen.
- `src/firebase-config.js`: `FIREBASE_CONFIG` (null = ingen inloggning, allt sparas lokalt).
- Samma sökvägar i båda molnen: `data/users/<uid>/familj` och `data/users/<uid>/<barn>~<bok>` (`cloudStart` i `src/app.js`).
- `src/build.py` skriver `dist/web/index.html` (helt dokument). `tools/web.sh` kopierar tryckfilerna till `dist/web/print`.
- `.github/workflows/deploy.yml` bygger appen och alla 34 tryckfiler och publicerar. Körs bara när variabeln `FIREBASE_PROJECT_ID` finns.
- `firestore.rules`: varje inloggad familj läser och skriver bara under sitt eget uid.

## Driftsatt 28 oktober 2026
Projekt `skogsskolan-fc7d8` (Firestore i europe-north2, Stockholm), adress https://skogsskolan-fc7d8.web.app.
Varje push till main som rör src/, assets/ eller tools/press.py bygger och publicerar automatiskt.
`tools/press_plan.py` jämför med det publicerade läget (`print/build.json` på sajten) och bygger bara om de tryckfiler vars innehåll, bilder eller träffade CSS-regler ändrats; resten hämtas från sajten. En ändring som bara rör appen på skärm tar då cirka 1,5 minut i stället för 6.

## Steg för att sätta upp (cirka 10 minuter)
1. console.firebase.google.com → Lägg till projekt, till exempel `skogsskolan`. Google Analytics behövs inte.
2. Build → Authentication → Kom igång → Google → Aktivera. Välj din e-post som support-adress.
3. Build → Firestore Database → Skapa databas → plats i Europa (eur3 eller europe-north1) → produktionsläge.
   Fliken Regler: klistra in innehållet i `firestore.rules` och publicera.
4. Projektinställningar (kugghjulet) → Allmänt → Dina appar → Webb (</>) → namn "Skogsskolan", bocka i Firebase Hosting.
   Kopiera `firebaseConfig` (apiKey, authDomain, projectId, appId …). Värdena är inte hemliga och kan klistras in i chatten.
5. Tjänstekonto för publiceringen (inte Firebase-konsolens "Generera ny privat nyckel": det kontot saknar Hosting-rättigheter).
   console.cloud.google.com → välj projektet → IAM och administration → Tjänstekonton → Skapa tjänstekonto,
   namn `github-action-skogsskolan`, roller: Firebase Hosting Admin, API Keys Viewer och Service Usage Consumer
   (den sista saknas i action-hosting-deploys dokumentation men krävs: utan den nekas `serviceusage.services.get`)
   (Firebase Authentication Admin behövs bara för förhandsvisningskanaler, som vi inte använder).
   Kontot → Nycklar → Lägg till nyckel → JSON. Klistra INTE in den i chatten.
   GitHub → weistedt/L-randeverktyget-Skogsskolan → Settings → Secrets and variables → Actions:
   - Secrets: `FIREBASE_SERVICE_ACCOUNT` = hela JSON-filens innehåll
   - Variables: `FIREBASE_PROJECT_ID` = projekt-id
6. Claude fyller i `src/firebase-config.js` och pushar. Actions bygger och publicerar på `https://<projekt-id>.web.app`.

## Kostnad
Gratisplanen (Spark) räcker för inloggning och Firestore. Hosting ger 360 MB trafik per dag. Sidan är cirka 12 MB,
så det räcker till ungefär 25 förstagångsbesök per dag (webbläsaren cachar sedan). Behövs mer: Blaze-planen, några kronor i månaden i den här skalan.

## Kvar att testa efter driftsättning
- Inloggning med Google på iPhone (Safari) och Android, popup och redirect.
- Två enheter med samma konto: familjen och arbetet kommer över.
- Utloggning tömmer enheten; inloggning med ett annat konto blandar inte ihop familjer.
- Bokbinderiet hämtar `print/` och sparar filen (vanlig nedladdning utanför claude.ai).
