# Meu Álbum - Mundial FIFA 2026

Aplicativo digital para gerenciar sua coleção de figurinhas da Copa do Mundo FIFA 2026. Funciona como um álbum físico, mas com superpoderes digitais: câmera para fotografar figurinhas, controle de repetidas, modo de troca e estatísticas em tempo real.

Desenvolvido por **RoboticsBr**.

---

## Funcionalidades

### Álbum Digital
- Grade visual de figurinhas organizada por seleção (10 países: Brasil, Argentina, França, Alemanha, Inglaterra, Espanha, Portugal, EUA, México e Canadá)
- 130 figurinhas no total (escudo + foto da seleção + 11 jogadores por time)
- Código de cores intuitivo:
  - **Cinza** = não tenho
  - **Verde** = tenho (1 unidade)
  - **Amarelo com badge** = tenho repetida (×2, ×3, etc.)
- Toque rápido para marcar/desmarcar figurinha
- Toque longo (500ms) para definir quantidade exata
- Filtros: Todas, Faltam, Tenho, Repetidas
- Navegação por seleção com abas horizontais e bandeiras

### Câmera de Figurinhas
- Botão de câmera em cada figurinha para fotografar a figurinha física
- Abre a câmera do dispositivo diretamente (traseira por padrão)
- Opção de trocar entre câmera frontal e traseira
- Alternativa de escolher foto da galeria
- A foto ocupa o card inteiro, substituindo o ícone genérico
- Compressão automática: 200×200px, JPEG 60% (~5-15KB por foto)

### Visão Geral
- Tela única com scroll mostrando todas as figurinhas de todas as seleções
- Quadradinhos verdes (tenho) e cinzas (faltam) em visualização compacta
- Badge dourado para repetidas
- Progresso geral com barra e contagem

### Modo Troca
- Lista separada de figurinhas repetidas e figurinhas que faltam
- Geração de texto formatado para compartilhar via WhatsApp, Instagram ou qualquer app
- Botão "Compartilhar" (usa Web Share API no celular) e "Copiar Texto"

### Estatísticas / Progresso
- Anel de progresso geral com porcentagem
- Cards com total de figurinhas, faltantes e repetidas
- Barras de progresso por seleção, ordenadas por completude

### Acessibilidade
- **Modo Sênior**: botões e textos maiores, touch targets ampliados
- **Sons**: efeito sonoro de conquista ao marcar figurinha (chime ascendente de 4 notas), desligável nos ajustes
- **Animação de celebração**: partículas coloridas (estrelas, círculos, diamantes) + bounce do card ao coletar figurinha
- ARIA labels em todos os controles interativos
- Vibração háptica ao abrir modal (em dispositivos compatíveis)

### Backup e Segurança dos Dados
- **Armazenamento persistente**: `navigator.storage.persist()` solicita ao navegador que nunca apague os dados
- **Exportar Backup**: gera arquivo `.json` com todas as figurinhas, configurações e fotos
- **Importar Backup**: restaura dados de um arquivo salvo anteriormente
- **Reset**: opção de apagar todos os dados (com confirmação)

### PWA (Progressive Web App)
- Instalável na tela inicial do celular (Android e iOS)
- Funciona 100% offline após primeira carga
- Todos os dados ficam no dispositivo (localStorage + IndexedDB)
- Service worker para cache de assets
- Orientação portrait otimizada

---

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Linguagem | TypeScript |
| Framework | React 19 |
| Build | Vite 7 |
| PWA | vite-plugin-pwa (Workbox) |
| Ícones | Lucide React |
| Armazenamento | localStorage (figurinhas) + IndexedDB via `idb` (fotos) |
| Áudio | Web Audio API |
| Câmera | getUserMedia API |
| Estilo | CSS puro com Custom Properties (design system mobile-first) |

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── AlbumPage.tsx        # Tela principal do álbum com grade de figurinhas
│   ├── BottomNav.tsx        # Navegação inferior (5 abas)
│   ├── CameraModal.tsx      # Modal de câmera em tela cheia
│   ├── Celebration.tsx      # Animação de partículas ao coletar figurinha
│   ├── GeneralPage.tsx      # Visão geral de todas as figurinhas
│   ├── Header.tsx           # Banner com troféu, título e logo
│   ├── SettingsPage.tsx     # Tela de ajustes e backup
│   ├── StatsPage.tsx        # Tela de estatísticas e progresso
│   ├── StickerCard.tsx      # Card individual de figurinha
│   ├── StickerModal.tsx     # Modal de detalhes e quantidade
│   ├── TeamTabs.tsx         # Abas horizontais de seleções
│   └── TradePage.tsx        # Tela de modo troca
├── data/
│   └── teams.ts             # Dados das seleções e jogadores (130 figurinhas)
├── store/
│   ├── useAlbumStore.tsx    # Estado global (Context + useReducer + localStorage)
│   └── usePhotoStore.ts     # Armazenamento de fotos (IndexedDB)
├── utils/
│   ├── backup.ts            # Exportar/importar backup em JSON
│   ├── imageCompressor.ts   # Compressão de imagens via Canvas API
│   └── sounds.ts            # Efeitos sonoros via Web Audio API
├── types.ts                 # Tipos TypeScript
├── App.tsx                  # Componente raiz com roteamento
├── main.tsx                 # Ponto de entrada + storage persist
└── index.css                # Design system completo (mobile-first)
```

---

## Como Executar

### Pré-requisitos
- Node.js 18+
- npm

### Instalação
```bash
git clone <url-do-repositorio>
cd rbr-album-copa2026
npm install
```

### Desenvolvimento
```bash
npm run dev
```
Acesse http://localhost:5173/ no navegador.

Para acessar pelo celular na mesma rede Wi-Fi:
```bash
npx vite --host 0.0.0.0 --port 3000
```
Acesse pelo IP da máquina (ex: http://192.168.1.100:3000).

### Build de Produção
```bash
npm run build
```
Os arquivos ficam na pasta `dist/`.

### Deploy
```bash
npm run build
npx vercel --yes
```
Ou qualquer serviço de hospedagem estática (Netlify, GitHub Pages, Surge, etc.).

---

## Como Usar no Celular

1. Abra o app no navegador do celular
2. **iPhone (Safari)**: Toque em Compartilhar → "Adicionar à Tela de Início"
3. **Android (Chrome)**: Toque em Menu (⋮) → "Instalar aplicativo"
4. O app aparece como ícone na tela inicial e abre em tela cheia

---

## Licença

Projeto desenvolvido por RoboticsBr. Todos os direitos reservados.
