# CleanQuest

## Configuracao

1. Copie `.env.example` para `.env`.
2. Crie um projeto no Firebase.
3. Ative `Authentication > Sign-in method > Google`.
4. Crie um app Web no Firebase para obter:
   - `EXPO_PUBLIC_FIREBASE_API_KEY`
   - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `EXPO_PUBLIC_FIREBASE_APP_ID`
5. Crie os OAuth Client IDs do Google para Android, iOS e Web e preencha:
   - `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
   - `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
   - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
6. No Firestore, crie o banco em modo nativo.

## Rodar

```bash
npm install
npm start
```

## Persistencia

O app salva no Firestore:
- XP e nivel
- moedas
- inventario desbloqueado
- personagem equipado
- streak
- buffs ativos
- missoes do dia
- rerolls restantes
- missoes concluidas
- baus comprados
- cronometros ativos de tarefas

Os dados sao carregados automaticamente quando a sessao Firebase for restaurada ao abrir o app.
