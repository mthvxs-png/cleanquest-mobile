# CleanQuest Handoff

## Projeto
- App mobile em React Native + Expo + TypeScript
- Nome em uso no código: `My Home Quest`
- Pasta local atual: `C:\Users\Gabriel\Documents\New project`

## Stack atual
- Expo SDK 54
- React Native
- TypeScript
- Zustand
- i18n com `pt-BR`, `en`, `es`
- Firebase Auth + Firestore integrados por `.env`

## O que já foi implementado

### Base do app
- Estrutura inicial do projeto Expo com TypeScript
- Navegação principal customizada
- Tema visual fofo e simples
- Dados locais mockados
- Tipos principais do domínio

### Lógica central
- Cálculo de XP por nível
- Ganho de XP e level up
- Ganho de moedas
- Tarefas por dificuldade
- Cronômetro de tarefa
- Missões especiais com bônus de 50%
- Limite de 3 missões por dia
- 3 rerolls diários
- Buffs de 24h não stackáveis
- Streak diário
- Baús com 5 raridades
- Pity lendário a cada 20 compras
- Testes unitários cobrindo as regras principais

### Integração de telas
- `Home` mostra avatar, nível, XP, moedas, streak e buffs
- `Tasks` mostra tarefas fixas com iniciar e concluir
- `Missions` mostra missões especiais do dia
- `Shop` compra baús e recebe item aleatório
- `Settings` mostra idioma, volumes e Debug Tester

### Firebase
- Google login
- Salvar progresso do usuário no Firestore
- Carregar progresso ao abrir o app
- Persistir XP, nível, moedas, inventário, personagem equipado, streak, buffs, missões do dia e baús comprados
- `.env.example` criado

### Debug Tester
- Tela de `Settings` roda fluxo de testes pela interface
- Resultado em lista de checks na própria tela

## Ajustes mais recentes pedidos pelo usuário

### Navegação
- Aba central deve ser `Missoes`, com destaque visual
- Próxima aba deve ser `Loja`
- Última aba deve ser `Avatar`
- `Settings` saiu das abas e virou botão no topo do app

### Home
- Avatar menor
- Nível, XP, moedas e streak na mesma linha
- Box do dia sem título
- Box mostra tarefas selecionadas para execução

### Tasks
- Tarefas passam a vir do arquivo:
  - `C:\Users\Gabriel\Desktop\tarefas.txt`
- Tarefas separadas por categorias/cômodos
- Início por cronômetro
- Conclusão automática ao fim do tempo
- Também existe conclusão instantânea

### Missions
- `rerollar` virou `trocar missão`
- Cada missão só pode ser trocada 1 vez
- Total diário continua 3 trocas
- Tela inclui barra de recompensa de login
- Recompensa de login:
  - 7 dias para completar
  - recompensa diária equivalente a missão fácil
  - no fim ganha 1 baú lendário

### Shop
- Removida seção de últimos itens recebidos
- Antes dos baús agora existem buffs compráveis:
  - shield de streak
  - dobro de XP
  - dobro de moedas
- Todos duram 24h
- Não podem ser recomprados enquanto já estiverem ativos

### Avatar
- Aba renomeada para `Avatar`
- Avatar grande em um quadrado
- Barra de nível e barra de XP
- Dois botões:
  - `Conquistas`
  - `Inventário`
- Inventário mostra itens desbloqueados e bloqueados
- Conquistas mostram métricas do jogador

## Arquivos principais alterados por essas mudanças
- `C:\Users\Gabriel\Documents\New project\src\application\AppShell.tsx`
- `C:\Users\Gabriel\Documents\New project\src\store\useGameStore.ts`
- `C:\Users\Gabriel\Documents\New project\src\game\constants.ts`
- `C:\Users\Gabriel\Documents\New project\src\game\missions.ts`
- `C:\Users\Gabriel\Documents\New project\src\game\loginRewards.ts`
- `C:\Users\Gabriel\Documents\New project\src\game\debugTester.ts`
- `C:\Users\Gabriel\Documents\New project\src\screens\HomeScreen.tsx`
- `C:\Users\Gabriel\Documents\New project\src\screens\TasksScreen.tsx`
- `C:\Users\Gabriel\Documents\New project\src\screens\MissionsScreen.tsx`
- `C:\Users\Gabriel\Documents\New project\src\screens\ShopScreen.tsx`
- `C:\Users\Gabriel\Documents\New project\src\screens\AvatarScreen.tsx`
- `C:\Users\Gabriel\Documents\New project\src\screens\SettingsScreen.tsx`
- `C:\Users\Gabriel\Documents\New project\src\i18n\resources.ts`
- `C:\Users\Gabriel\Documents\New project\src\services\progress.ts`
- `C:\Users\Gabriel\Documents\New project\src\application\FirebaseBootstrap.tsx`

## Estado validado antes deste handoff
- `npm run typecheck` passando
- `npm run test` passando

## Observações importantes
- O usuário corrigiu que o “md anexado” na verdade era o arquivo `tarefas.txt`
- O projeto está local e ainda não foi confirmado como publicado no GitHub
- Para funcionar em outra máquina, além dos arquivos, será preciso configurar:
  - `npm install`
  - `.env`
  - Firebase/Google login conforme o README

## Próximo passo pedido pelo usuário
- Subir o projeto para o GitHub
- Depois usar esse repositório para baixar no outro computador
