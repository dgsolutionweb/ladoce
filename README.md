# Sistema de Gerenciamento de Vendas - Doceria

Sistema de gerenciamento de vendas desenvolvido para controle de produtos, vendas e relatórios de uma doceria.

## Funcionalidades

- Gestão de Vendas Diárias
- Gestão de Produtos
- Gestão Financeira
- Relatórios e Análises

## Tecnologias Utilizadas

- Vite + React
- TypeScript
- Chakra UI
- Supabase

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Preencha as variáveis com suas credenciais do Supabase

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços e integrações
  ├── contexts/      # Contextos do React
  ├── types/         # Tipos TypeScript
  └── utils/         # Funções utilitárias
```

## Configuração do Banco de Dados

O projeto utiliza Supabase como banco de dados. As seguintes tabelas são necessárias:

- products (produtos)
- sales (vendas)
- sale_items (itens de venda)
- expenses (despesas)
- monthly_goals (metas mensais)

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
