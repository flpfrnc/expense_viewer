# Dashboard de Gastos Pessoais

Um sistema de adição e visualização de gastos pessoais, como valores pontuais ou dívidas parceladas, focado num histórico mensal detalhado.

## Funcionalidades

*   **Dashboard de Previsão:** Visualização imediata do total de gastos para o mês atual.
*   **Gestão de Parcelados:** Monitoramento de dívidas de longo prazo com barras de progresso automáticas.
*   **Histórico Mensal Expansível:** Visualização cronológica de todos os meses anteriores, permitindo expandir cada mês para ver a composição exata dos gastos (item a item).
*   **Gastos Avulsos:** Registro de compras únicas e controle de status (pago/pendente).
*   **Backend Serverless:** Persistência de dados segura e gratuita com Supabase.

## Tecnologias Utilizadas

*   **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
*   **Banco de Dados:** [Supabase / PostgreSQL](https://supabase.com/)
*   **ORM / Client:** Supabase JS SDK
*   **Ícones:** [Lucide React](https://lucide.dev/)
*   **Deploy:** [Vercel](https://vercel.com/)

## Pré-requisitos

Antes de começar, você precisará de:
*   [Node.js](https://nodejs.org/) instalado (v18+)
*   Uma conta no **Supabase**
*   Uma conta na **Vercel** (para deploy)

## Instalação e Setup

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/flpfrnc/expense_viewer.git
    cd expense_viewer
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione suas chaves do Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_key
    ```

4.  **Setup do Banco de Dados:**
    Execute o script SQL disponível em `/supabase/schema.sql` (ou no painel SQL Editor do Supabase) para criar as tabelas `gastos_parcelados`, `gastos_avulsos` e `historico_mensal`.

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    Acesse [http://localhost:3000](http://localhost:3000) para ver o app.
