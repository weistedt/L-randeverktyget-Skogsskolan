/* Firebase för egen webbplats (Google-inloggning + Firestore). Fyll i från Firebase-konsolen:
   Projektinställningar → Allmänt → Dina appar → webbapp → "SDK setup and configuration" → Config.
   Värdena är inte hemliga (de syns alltid i en webbapp); skyddet sitter i firestore.rules.
   null = ingen inloggning, allt sparas lokalt (och i claude.ai-artefaktens databas när appen körs där). */
var FIREBASE_CONFIG={apiKey:"AIzaSyDnc3ylDR98VCZ07sYFCfSV_JuxcL0l3wI",authDomain:"skogsskolan-fc7d8.firebaseapp.com",projectId:"skogsskolan-fc7d8",storageBucket:"skogsskolan-fc7d8.firebasestorage.app",messagingSenderId:"992698821754",appId:"1:992698821754:web:a0e18189c9a247892edfc3"};
