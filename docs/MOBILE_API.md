# Wakhalog Mobile API — Contrat pour l'app Flutter

Ce document décrit le **contrat HTTP** que l'app Flutter (Riverpod + Dio)
doit consommer. Les endpoints actuels sont des **stubs servis par
TanStack Start** (sous `/api/public/mobile/*`). Quand le backend FastAPI
+ Postgres + Whisper + Gemini + SpeechT5 sera prêt, il devra implémenter
**exactement les mêmes URLs et les mêmes JSON**, sans changement côté
Flutter.

> Préfixe `/api/public/*` = pas d'auth Lovable sur le site publié. Chaque
> handler vérifie lui-même son `Authorization` quand c'est nécessaire.

## Base URLs

| Environnement | Base URL                                                        |
| ------------- | --------------------------------------------------------------- |
| Dev local     | `http://10.0.2.2:8080/api/public/mobile` (Android emulator)     |
| Preview       | `https://project--<id>-dev.lovable.app/api/public/mobile`       |
| Production    | `https://project--<id>.lovable.app/api/public/mobile`           |

CORS : `Access-Control-Allow-Origin: *` sur tous les endpoints + handler
`OPTIONS` (preflight).

---

## 1. Health

```
GET /health
200 { "status": "ok", "service": "wakhalog-mobile-api", "version": "0.1.0-stub", "timestamp": "..." }
```

À utiliser au démarrage de l'app pour vérifier la connectivité backend.

---

## 2. Auth OTP

```
POST /auth/otp
Body : { "action": "request", "phone": "+221771234567" }
200  : { "status": "sent", "expires_in": 300 }

POST /auth/otp
Body : { "action": "verify", "phone": "+221771234567", "code": "123456" }
200  : {
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600,
  "user": { "id": "user_...", "phone": "+221...", "role": "citizen" }
}
401  : { "error": "invalid_code" }
```

Stub : code de test = **123456**. Les vrais tokens viendront de Supabase
Auth (provider Phone) ou d'un service OTP FastAPI ; le contrat ne change pas.

L'app stocke `access_token` dans `flutter_secure_storage` et l'envoie en
header `Authorization: Bearer <token>` sur tous les endpoints protégés.

---

## 3. Procedures

```
GET /procedures?category=identite&q=passeport
200 {
  "categories": [{ "id": "identite", "label": "Identité" }, ...],
  "items": [
    {
      "slug": "passeport",
      "title": "Passeport biométrique",
      "category": "identite",
      "summary": "...",
      "duration": "10 à 20 jours",
      "cost": "20 000 FCFA"
    }
  ],
  "total": 1
}
```

```
GET /procedures/:slug
200 {
  "slug": "passeport",
  "title": "Passeport biométrique",
  "category": "identite",
  "summary": "...",
  "summary_wo": "...",
  "duration": "...",
  "cost": "...",
  "documents": [{ "label": "CNI valide", "required": true }, ...],
  "steps":     [{ "title": "...", "description": "..." }, ...],
  "sources":   ["passeport.sec.gouv.sn"],
  "audio_url": null
}
404 { "error": "not_found", "slug": "..." }
```

Catégories possibles : `etat-civil`, `identite`, `justice`, `education`,
`entreprise`, `sante`, `fiscalite`.

---

## 4. Chat (assistant vocal)

```
POST /chat
Body : {
  "message": "Comment obtenir un passeport ?",
  "lang": "fr",                  // "fr" | "wo"
  "conversation_id": "conv_..."  // optionnel — créé si absent
}
200 {
  "conversation_id": "conv_1700000000",
  "message_id": "msg_1700000000",
  "answer": "...",
  "lang": "fr",
  "confidence": 0.82,
  "matched_procedure": { "slug": "passeport", "title": "...", "category": "identite" },
  "sources": ["passeport.sec.gouv.sn"],
  "engine": "stub"
}
```

Pipeline cible (transparent pour Flutter) :

```
audio (Flutter Sound)
  -> POST /chat/voice (multipart)  [à venir]
       -> Whisper Wolof -> texte
       -> Gemini + RAG  -> réponse
       -> SpeechT5/TTS  -> audio_url
  <- { answer, audio_url, confidence, sources }
```

L'endpoint texte (`/chat`) reste utilisable pour les claviers et la zone de
debug. La version `/chat/voice` (multipart audio) sera ajoutée dans la même
famille avec le même shape de réponse + `audio_url`.

---

## 5. TTS

```
POST /tts
Body : { "text": "...", "lang": "fr" | "wo", "voice": "default" }
200  : { "audio_url": "https://.../abc.mp3", "engine": "speecht5", "lang": "wo", "cached": true }
501  : { "audio_url": null, "engine": "none", "fallback": "device" }
```

Tant que le backend renvoie 501 + `fallback: "device"`, **Flutter utilise
`flutter_tts` local**. Quand `audio_url` est renvoyée, l'app la joue avec
`just_audio`. La logique côté app ne change jamais ; seule la réponse du
serveur évolue.

---

## 6. History

```
GET  /history                 (Authorization required)
200  { "conversations": [{ "id", "topic", "updated_at", "preview" }] }

POST /history                 (Authorization required)
Body : { "conversation_id", "role": "user"|"bot", "text", "lang" }
501  : { "error": "not_implemented", "fallback": "local" }
```

Tant que `501 + fallback: "local"` est renvoyé, Flutter persiste dans
**Hive**. Quand l'endpoint sera implémenté, l'app synchronisera Hive ↔ API
(même modèle de données : `conversations`, `messages`).

---

## 7. Favorites

```
GET  /favorites                (Authorization required)
200  { "favorites": [{ "slug", "title", "category", "added_at" }] }

POST /favorites                (Authorization required)
Body : { "slug": "passeport", "action": "add" | "remove" }
```

---

## Modèle de données (futur Postgres)

```
users            ( id, phone, name, lang, role, created_at )
conversations    ( id, user_id, topic, updated_at )
messages         ( id, conversation_id, role, text, lang, audio_url, created_at )
procedures       ( slug PK, title, category, summary, summary_wo, duration, cost, audio_url )
procedure_docs   ( procedure_slug, label, required )
procedure_steps  ( procedure_slug, idx, title, description )
favorites        ( user_id, procedure_slug, added_at )  PK(user_id, procedure_slug)
```

L'app Flutter ne voit jamais cette structure : elle consomme uniquement
le JSON décrit ci-dessus.

---

## Codes d'erreur communs

| HTTP | `error`              | Sens                                          |
| ---- | -------------------- | --------------------------------------------- |
| 400  | `invalid_json`       | Body non parseable                            |
| 400  | `missing_message`    | Champ requis vide                             |
| 400  | `invalid_phone`      | Format E.164 attendu (`+221...`)              |
| 401  | `unauthorized`       | Header `Authorization` manquant ou invalide   |
| 401  | `invalid_code`       | Code OTP incorrect                            |
| 404  | `not_found`          | Ressource inexistante                         |
| 501  | `not_implemented`    | Backend stub — utiliser `fallback`            |

---

## Checklist côté Flutter

- [ ] Configurer Dio avec `baseUrl` selon l'environnement
- [ ] Intercepteur Dio : injecter `Authorization: Bearer <token>`
- [ ] Stocker `access_token` / `refresh_token` dans `flutter_secure_storage`
- [ ] Modèles `freezed` calqués sur les JSON ci-dessus
- [ ] Repository par domaine (`AuthRepo`, `ProcedureRepo`, `ChatRepo`, `TtsRepo`)
- [ ] Fallback `flutter_tts` quand `/tts` renvoie 501
- [ ] Persistence Hive pour conversations tant que `/history` renvoie 501
