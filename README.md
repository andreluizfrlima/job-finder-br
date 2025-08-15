# JobFinderBR - Aplicação de Busca de Vagas

Uma aplicação web responsiva desenvolvida em React para buscar e exibir vagas de emprego no Brasil, focada em cargos relacionados a content design e technical writing.

## 🚀 Funcionalidades

### Principais
- ✅ **Busca de vagas** com filtros por cargo, cidade e modalidade (remoto/presencial/híbrido)
- ✅ **Interface responsiva** compatível com desktop e mobile
- ✅ **Scroll infinito** para carregamento progressivo de resultados
- ✅ **Sistema de favoritos** com persistência no localStorage
- ✅ **Exportação de dados** em múltiplos formatos (CSV, JSON, Relatório)
- ✅ **Indicadores visuais** para vagas publicadas nas últimas 24h
- ✅ **Filtros pré-configurados** para os cargos especificados

### Cargos Suportados
- Content Designer
- Content Strategist
- Digital Storyteller
- Documentation Manager
- Documentation Specialist
- Information Architect
- Technical Author
- Technical Communicator
- Technical Editor
- Technical Evangelist

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de interface
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **JavaScript (ES6+)** - Linguagem principal

## 📁 Estrutura do Projeto

```
job-finder-br/
├── public/
├── src/
│   ├── api/
│   │   └── jobService.js      # Serviço de API e dados simulados
│   ├── components/
│   │   └── ui/                # Componentes shadcn/ui
│   ├── hooks/
│   │   └── useJobs.js         # Hooks customizados
│   ├── utils/
│   │   └── exportUtils.js     # Utilitários de exportação
│   ├── App.jsx                # Componente principal
│   ├── App.css                # Estilos globais
│   └── main.jsx               # Ponto de entrada
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- pnpm (ou npm/yarn)

### Instalação e Execução
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd job-finder-br

# Instale as dependências
pnpm install

# Execute em modo desenvolvimento
pnpm run dev

# Acesse http://localhost:5173
```

### Build para Produção
```bash
# Gera build otimizado
pnpm run build

# Preview do build
pnpm run preview
```

## 📊 Funcionalidades Detalhadas

### 1. Sistema de Busca
- **Filtros por cargo**: Seleção de cargos pré-definidos
- **Filtro por cidade**: Campo livre para especificar localização
- **Filtro por modalidade**: Remoto, Presencial ou Híbrido
- **Busca personalizada**: Campo livre para termos customizados

### 2. Exibição de Resultados
- **Cards responsivos** com informações completas da vaga
- **Indicadores visuais** para vagas recentes (24h)
- **Informações exibidas**: título, empresa, localização, data, salário, modalidade
- **Links diretos** para candidatura

### 3. Sistema de Favoritos
- **Persistência local** usando localStorage
- **Toggle de favoritos** com feedback visual
- **Contador de favoritos** no header
- **Ícones intuitivos** (estrela preenchida/vazia)

### 4. Exportação de Dados
- **CSV**: Formato tabular para análise em planilhas
- **JSON**: Formato estruturado para integração
- **Relatório**: Análise estatística em texto

### 5. Scroll Infinito
- **Carregamento automático** ao aproximar do fim da página
- **Indicador de loading** durante carregamento
- **Otimização de performance** com Intersection Observer

## 🎨 Design e UX

### Responsividade
- **Mobile-first**: Design otimizado para dispositivos móveis
- **Breakpoints**: Adaptação para tablet e desktop
- **Touch-friendly**: Botões e áreas de toque adequadas

### Acessibilidade
- **Contraste adequado** para legibilidade
- **Navegação por teclado** suportada
- **Semântica HTML** correta
- **Textos alternativos** em ícones

### Animações
- **Micro-interações** com Framer Motion
- **Transições suaves** entre estados
- **Feedback visual** em ações do usuário

## 🔧 Configuração de APIs

### Modo Demonstração
Por padrão, a aplicação roda em **modo demonstração** com dados simulados realistas.

### Integração com APIs Reais
Para usar APIs reais (Jooble, Adzuna), configure:

1. **Variáveis de ambiente**:
```env
VITE_JOOBLE_KEY=sua_chave_jooble
VITE_ADZUNA_APP_ID=seu_app_id_adzuna
VITE_ADZUNA_APP_KEY=sua_chave_adzuna
```

2. **Proxy server-side** (necessário para CORS):
```javascript
// Exemplo de endpoint proxy
app.post('/api/jooble', async (req, res) => {
  const response = await fetch(`https://jooble.org/api/${JOOBLE_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
});
```

## 📈 Performance

### Otimizações Implementadas
- **Lazy loading** de componentes
- **Debounce** em campos de busca
- **Memoização** de cálculos pesados
- **Intersection Observer** para scroll infinito
- **Bundle splitting** automático pelo Vite

### Métricas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🧪 Testes

### Testes Manuais Realizados
- ✅ Busca com diferentes filtros
- ✅ Sistema de favoritos
- ✅ Exportação de dados
- ✅ Scroll infinito
- ✅ Responsividade mobile/desktop
- ✅ Indicadores de vagas recentes

### Cenários de Teste
1. **Busca básica**: Filtro por cargo padrão
2. **Filtros combinados**: Cargo + cidade + modalidade
3. **Favoritos**: Adicionar/remover favoritos
4. **Exportação**: CSV, JSON e relatório
5. **Scroll**: Carregamento de múltiplas páginas
6. **Responsividade**: Teste em diferentes tamanhos de tela

## 🚀 Deploy

### Opções de Deploy
1. **Vercel** (recomendado)
2. **Netlify**
3. **GitHub Pages**
4. **Servidor próprio**

### Configuração para Deploy
```bash
# Build de produção
pnpm run build

# Arquivos gerados em dist/
# Upload da pasta dist/ para seu provedor
```

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### Padrões de Código
- **ESLint**: Configuração padrão
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de mensagens

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

### Problemas Conhecidos
- **CORS**: APIs externas requerem proxy server-side
- **Rate Limiting**: APIs podem ter limites de requisições

### FAQ

**Q: Por que não vejo vagas reais?**
A: A aplicação roda em modo demonstração. Para vagas reais, configure as APIs conforme documentação.

**Q: Como adicionar mais fontes de vagas?**
A: Edite o arquivo `src/api/jobService.js` e adicione novos provedores.

**Q: A aplicação funciona offline?**
A: Parcialmente. Os favoritos são salvos localmente, mas a busca requer conexão.

## 📞 Contato

Para dúvidas ou sugestões sobre a aplicação JobFinderBR.

---

**Desenvolvido com ❤️ para a comunidade brasileira de content design e technical writing.**

