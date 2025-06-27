# TCC2 - Plataforma para monitoramento de dados vitais

Este repositório contém o desenvolvimento completo de um sistema de **monitoramento de saúde pessoal** distribuído entre um **dispositivo embarcado com ESP32** e um **aplicativo móvel**. O objetivo do projeto é oferecer uma solução integrada para acompanhamento de sinais fisiológicos e ambientais, com alertas inteligentes e interface amigável para o usuário.

---

## 🧩 Visão Geral da Arquitetura

O sistema é composto por dois módulos principais:

- **📟 Dispositivo embarcado (`/embedded`)**  
  Responsável pela **coleta de dados em tempo real** por meio de sensores conectados ao ESP32, incluindo frequência cardíaca, temperatura, umidade e aceleração. Os dados são enviados para a nuvem via protocolo HTTP, utilizando um webhook configurado em um servidor intermediário (n8n).

- **📱 Aplicativo móvel (`/mobile`)**  
  Desenvolvido em React Native com integração ao Firebase, permite que o usuário visualize os dados coletados, registre atividades físicas, gerencie contatos de emergência e utilize o botão SOS para acionamento rápido em situações críticas.

---

## 📂 Estrutura do Repositório

```bash
├── src/embedded   # Código do sistema embarcado (ESP32 + sensores)
├── src/mobile     # Aplicativo React Native para Android/iOS
└── README.md      # Introdução geral do sistema
```

---

## 🔧 Tecnologias Utilizadas

| Componente       | Tecnologias / Ferramentas                                  |
|------------------|------------------------------------------------------------|
| Dispositivo      | ESP32, MAX30100, BMP180, MPU6050, Arduino IDE               |
| Comunicação      | Wi-Fi, HTTP, Webhook (n8n), Firebase Realtime Database     |
| App Mobile       | React Native, Expo, Firebase Auth, Firestore, TypeScript   |
| Integração       | n8n para automação de alertas e armazenamento na nuvem     |

---

## 🎯 Objetivo do Projeto

Desenvolver uma solução portátil e conectada capaz de:

- Monitorar em tempo real a **frequência cardíaca**, **condições ambientais** e **movimentos bruscos**
- Alertar contatos de confiança em **caso de emergência ou queda**
- Disponibilizar os dados de forma acessível por meio de um aplicativo móvel intuitivo
- Utilizar serviços de nuvem e automação para **garantir escalabilidade e segurança**

---

## 📘 Documentação Individual

Para mais detalhes sobre cada módulo, acesse os README específicos:

- [`src/embedded/README.md`](./src/embedded/README.md) – Código do ESP32 e sensores
- [`src/mobile/README.md`](./src/mobile/README.md) – Aplicativo móvel com React Native
