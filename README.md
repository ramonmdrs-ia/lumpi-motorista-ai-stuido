# Lumpi - Controladora de Rentabilidade para Motoristas

<div align="center">
<img width="1200" height="475" alt="Lumpi Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 🚗 Sobre o Projeto

O **Lumpi-Motorista** é uma plataforma robusta e inteligente desenvolvida especificamente para motoristas de aplicativos (Uber, 99, iFood, Indriver) que desejam ter controle total sobre suas finanças e produtividade. O sistema oferece uma visão clara da rentabilidade por quilômetro rodado, gestão de despesas, definição de metas e análises detalhadas de performance.

## ✨ Funcionalidades Principais

- **📊 Dashboard Inteligente:** Visão geral de ganhos, gastos, lucro líquido e progresso de metas em tempo real.
- **🛣️ Gestão de Corridas:** Registro detalhado de entradas integrando múltiplas plataformas.
- **💸 Controle de Despesas:** Monitoramento de gastos fixos e variáveis (combustível, manutenção, alimentação).
- **🎯 Definição de Metas:** Ferramentas para estabelecer e acompanhar objetivos diários e mensais.
- **📈 Analytics PRO:** Gráficos e análises de rentabilidade por KM e melhor plataforma/dia para trabalhar.
- **🏆 Ranking da Comunidade:** Compare seu desempenho com outros motoristas da plataforma.
- **🔧 Gestão de Manutenção:** Calendário e histórico de revisões do veículo.
- **🛡️ Conformidade LGPD:** Exportação de dados e direito ao esquecimento integrados.
- **👑 Painel Administrativo:** Gestão completa de usuários, planos PRO e códigos de convite.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as tecnologias mais modernas do ecossistema web:

- **Frontend:** [React.js](https://reactjs.org/) (com TypeScript)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Roteamento:** [React Router](https://reactrouter.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)

## 🛠️ Instalação e Execução Local

### Pré-requisitos
- Node.js (versão 18 ou superior)
- NPM ou Yarn

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/lumpi-motorista.git
   cd lumpi-motorista
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto e adicione suas chaves do Supabase:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador:**
   O projeto estará disponível em `http://localhost:5173`.

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---
<div align="center">
Feito com ❤️ para motoristas que movem o país.
</div>
