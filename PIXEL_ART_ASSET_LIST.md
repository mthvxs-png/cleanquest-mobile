# Pixel Art Asset List

## Objetivo
Repaginar todo o app para uma linguagem de pixel art, substituindo o layout atual por uma interface totalmente ilustrada.

## Direcao visual sugerida
- resolucao base: 16x16, 24x24 e 32x32 para elementos pequenos
- personagens e previews: 64x64, 96x96 e 128x128
- paineis e janelas: sistema 9-slice para escalar sem borrar
- paleta: 1 paleta principal para UI e 1 paleta secundaria para raridades
- exportacao: `png` com fundo transparente
- escalonamento no app: `nearest-neighbor` / pixel-perfect

## UI base

### Molduras e janelas
- janela principal clara
- janela principal escura
- modal pequeno
- modal medio
- modal grande
- tooltip
- card simples
- card selecionado
- card bloqueado
- card de recompensa
- moldura dourada para destaque
- divisoria horizontal
- divisoria vertical
- fundo de painel com textura
- sistema 9-slice para cada janela acima

### Backgrounds gerais
- background da home
- background da tasks
- background da missions
- background da shop
- background da avatar
- background da settings
- padrao repetivel sutil para listas
- faixa decorativa superior
- faixa decorativa inferior

## Botoes

### Estados necessarios
- normal
- hover
- pressed
- disabled
- selected

### Tipos de botao
- botao primario
- botao secundario
- botao destaque
- botao perigo
- botao pequeno
- botao medio
- botao grande
- botao de icone quadrado
- botao de aba
- botao central de missoes com destaque
- botao de fechar
- botao de voltar
- botao de confirmar
- botao de cancelar
- botao de comprar
- botao de equipar
- botao de iniciar tarefa
- botao de concluir tarefa
- botao de concluir agora
- botao de trocar missao
- botao de abrir bau
- botao de idioma
- botao de configuracoes no topo
- botao de login Google adaptado ao estilo pixel

## Tabs e navegacao
- aba home
- aba tasks
- aba missions
- aba shop
- aba avatar
- versao ativa e inativa de cada aba
- tab central de missions em versao elevada
- indicador de aba ativa
- separadores do menu inferior

## Icones gerais

### Sistema
- home
- tarefas
- missoes
- loja
- avatar
- configuracoes
- fechar
- voltar
- som
- musica
- idioma
- volume mais
- volume menos
- check
- erro
- alerta
- info
- salvar
- carregar
- relogio
- calendario
- cadeado
- desbloqueado
- seta esquerda
- seta direita
- seta cima
- seta baixo

### Economia e progressao
- XP
- nivel
- moeda
- streak
- fogo de streak
- shield de streak
- buff XP x2
- buff moedas x2
- recompensa diaria
- missao completa
- tarefa completa

### Loja e baus
- bau comum
- bau incomum
- bau raro
- bau epico
- bau lendario
- brilho de recompensa
- selo de pity
- selo de item novo
- selo de equipado
- selo de bloqueado

### Tarefas e comodos
- quarto
- sala
- cozinha
- banheiro
- escritorio
- varanda
- area de servico
- quintal
- garagem
- despensa
- closet
- icone de cronometro
- icone de tarefa selecionada
- icone de tarefa em andamento
- icone de tarefa pronta

## Tipografia
- fonte pixel principal para titulos
- fonte pixel secundaria para texto
- numeros pixel para XP, moedas, timer e streak
- versao bold da fonte
- versao uppercase legivel

## Elementos de texto renderizados
- numeros decorativos para contadores
- label de raridade
- labels de dificuldade: facil, medio, dificil
- tags de estado: ativo, bloqueado, novo, equipado, completo

## HUD e barras
- barra de XP
- barra de nivel
- barra de progresso da recompensa de login
- trilho vazio de barra
- preenchimento comum
- preenchimento dourado
- preenchimento raro
- moldura da barra
- badge de numero
- capsule para estatisticas pequenas

## Personagem

### Base
- base masculina idle
- base feminina idle
- silhouette de preview pequena
- silhouette de preview grande

### Camadas equipaveis
- roupas
- chapeus
- calcas
- sapatos
- pets
- backgrounds do avatar
- auras

### Estados visuais
- pose idle
- pose comemorando
- pose de recompensa

## Inventario
- slot vazio
- slot bloqueado
- slot desbloqueado
- slot equipado
- slot raro
- slot epico
- slot lendario
- cursor/outline de selecao
- fundo de grade do inventario

## Conquistas e metricas
- trofeu comum
- trofeu ouro
- medalha de streak
- medalha de tarefas
- medalha de baus
- card de estatistica
- banner de recorde

## Missoes especiais
- card de missao
- card de missao completa
- card de subtarefa
- selo de troca usada
- marcador de bonus de 50%
- progressao de login em 7 casas
- recompensa diaria pequena
- recompensa final lendaria

## Loja
- card de buff
- card de buff ativo
- card de buff indisponivel
- card de bau
- card de bau selecionado
- raio/brilho para item recebido
- animação sprite para abertura de bau

## Feedback e efeitos
- particulas de XP
- particulas de moedas
- brilho de item raro
- brilho de item lendario
- confete de missao concluida
- splash de clique
- flash de level up
- popup de recompensa

## Splash e loading
- tela splash inicial
- logo pixel do app
- loading spinner pixel
- loading dots animados
- tela vazia sem tarefas
- tela vazia sem buffs
- tela vazia sem inventario

## Estado de autenticacao
- card de login
- selo Google adaptado
- estado conectado
- estado sincronizando
- estado erro de sync
- estado Firebase nao configurado

## Audio visual support
- icone de volume ligado
- icone de volume desligado
- icone de musica ligada
- icone de musica desligada
- slider pixel horizontal
- knob pixel do slider

## Exportacao tecnica
- atlas de UI
- atlas de icones
- atlas de personagem
- atlas de pets
- atlas de efeitos
- pasta para fontes bitmap
- versao 1x
- versao 2x
- versao 3x

## Prioridade de producao

### Fase 1
- janelas 9-slice
- botoes principais
- tabs
- icones base
- fonte pixel
- barras de XP e nivel
- card de tarefa
- card de missao

### Fase 2
- baus
- buffs
- inventario
- avatar grande
- backgrounds por tela
- indicadores de estado

### Fase 3
- efeitos
- animacao de bau
- telas vazias
- splashes
- variantes raras e premium

## Observacoes de implementacao no app
- todos os assets devem ser pensados para `ImageBackground`, `Image`, spritesheet ou 9-slice
- evitar texto embutido em imagens quando possivel
- deixar espaco para i18n
- separar camadas do avatar para equipamento dinamico
- manter nomes de arquivos consistentes por categoria e estado
