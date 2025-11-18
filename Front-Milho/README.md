# Front Milho

Projeto Next.js com TypeScript e Context API para gerenciamento de entregas.

## Estrutura do Projeto

```
src/
  ├── app/            # Rotas e páginas do Next.js
  │   ├── business/   # Página de empresas
  │   ├── trucks/     # Página de caminhões
  │   ├── login/      # Página de login
  │   ├── layout.tsx  # Layout principal
  │   └── page.tsx    # Página inicial
  ├── screens/        # Screens da aplicação
  │   ├── HomeScreen.tsx
  │   ├── BusinessScreen.tsx
  │   └── DeliveryTruckScreen.tsx
  ├── components/     # Componentes reutilizáveis
  │   ├── Navigation.tsx
  │   └── ProtectedRoute.tsx
  ├── contexts/       # Context API providers
  │   └── AuthContext.tsx
  ├── services/       # Serviços de API
  │   ├── authService.ts
  │   ├── userService.ts
  │   ├── businessService.ts
  │   └── deliveryTruckService.ts
  ├── types/          # Tipos TypeScript
  │   └── index.ts
  └── utils/          # Funções utilitárias
      └── api.ts      # Cliente HTTP
```

## Funcionalidades

- ✅ Autenticação com Context API
- ✅ Gerenciamento de Usuários
- ✅ Gerenciamento de Empresas
- ✅ Gerenciamento de Caminhões de Entrega
- ✅ Rotas protegidas
- ✅ Navegação entre páginas

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `env.example` para `.env.local`:
```bash
cp env.example .env.local
```

2. Configure a URL da API no arquivo `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Build

```bash
npm run build
npm start
```

## Endpoints da API

### Autenticação
- `POST /auth/login` - Login do usuário

### Usuários
- `GET /api/v1/users/me` - Obter usuário atual
- `PUT /api/v1/users/me` - Atualizar usuário atual
- `DELETE /api/v1/users/me` - Deletar usuário atual
- `POST /api/v1/users` - Criar novo usuário

### Empresas
- `GET /api/v1/business/all` - Listar todas as empresas
- `GET /api/v1/business/{id}` - Obter empresa por ID
- `POST /api/v1/business/create` - Criar nova empresa
- `PUT /api/v1/business/{id}` - Atualizar empresa
- `DELETE /api/v1/business/{id}` - Deletar empresa

### Caminhões
- `GET /api/v1/delivery/trucks/{id}` - Obter caminhão por ID
- `POST /api/v1/delivery/trucks/create` - Criar novo caminhão
- `PUT /api/v1/delivery/trucks/update/{id}` - Atualizar caminhão
- `DELETE /api/v1/delivery/trucks/delete/{id}` - Deletar caminhão

## Tecnologias

- Next.js 14
- TypeScript
- React Context API
- CSS Modules (inline styles)

