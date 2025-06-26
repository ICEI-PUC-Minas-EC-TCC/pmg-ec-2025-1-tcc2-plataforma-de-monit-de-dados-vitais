# TCC2 - Mobile Code

## Sobre o App

O **TCC Monitor** é um aplicativo móvel de monitoramento de saúde conectado ao Firebase. O app oferece funcionalidades essenciais para acompanhamento de atividades físicas e segurança pessoal:

### Funcionalidades Principais

- **🔐 Autenticação**: Sistema de login/registro integrado com Firebase Auth
- **🏃‍♂️ Atividades Físicas**: Registro e acompanhamento de atividades físicas realizadas
- **🚨 Botão SOS**: Funcionalidade de emergência que envia requisições para webhook no n8n
- **👥 Contatos de Confiança**: Sistema para registrar contatos que serão alertados em caso de emergência
- **📊 Monitoramento**: Acompanhamento de dados vitais e histórico de atividades

### Tecnologias Utilizadas

- **React Native** com Expo
- **Firebase** (Auth, Firestore, Realtime Database)
- **TypeScript**
- **React Navigation**
- **Expo Location** para rastreamento de localização

## Configuração do Ambiente

### Variáveis de Ambiente

Este projeto usa variáveis de ambiente para configurar o Firebase. Para configurar o ambiente de desenvolvimento:

1. Copie o arquivo `.env.example` para `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e preencha com suas configurações do Firebase:
   ```
   FIREBASE_API_KEY=sua_api_key_aqui
   FIREBASE_AUTH_DOMAIN=seu_project_id.firebaseapp.com
   FIREBASE_DATABASE_URL=https://seu_project_id-default-rtdb.firebaseio.com
   FIREBASE_PROJECT_ID=seu_project_id
   FIREBASE_STORAGE_BUCKET=seu_project_id.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
   FIREBASE_APP_ID=seu_app_id
   ```

### Como obter as configurações do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para Configurações do Projeto (ícone de engrenagem)
4. Na aba "Geral", role até "Seus aplicativos"
5. Selecione o app web ou crie um novo
6. Copie as configurações fornecidas

### Segurança

- O arquivo `.env` está no `.gitignore` e não será commitado
- O arquivo `.env.example` serve como template e pode ser versionado
- Nunca commite credenciais reais no repositório

## Instalação e Execução

```bash
npm install
npm start
```
