# TCC2 - Código Embarcado - ESP32 (Sistema de Proteção Coletiva)

## 📖 Sobre o Sistema

Este código foi desenvolvido para o microcontrolador ESP32, com foco na **coleta de sinais fisiológicos e ambientais** e **comunicação com aplicativo móvel** via Wi-Fi e protocolo HTTP. O objetivo é ler sensores em tempo real e enviar os dados para a nuvem, permitindo o acompanhamento remoto por cuidadores ou pelo próprio usuário.

## 🚀 Funcionalidades Principais

- **📡 Comunicação com o App**: Envio de dados por HTTP POST para o backend (via n8n e Firebase)
- **❤️ Leitura de Sinais Vitais**: Frequência cardíaca via sensor MAX30100
- **🌡️ Monitoramento Ambiental**: Temperatura e umidade com o sensor BMP180
- **⚠️ Detecção de Queda**: Detecção de padrões de movimento abruptos via MPU6050
- **🔁 Transmissão Periódica**: Coleta e envio contínuo de dados a cada intervalo definido

## 🧰 Tecnologias e Componentes

- **Microcontrolador**: ESP32
- **Sensores**:
  - `MAX30100` – Batimentos cardíacos e SpO2
  - `BMP180` – Temperatura e umidade
  - `MPU6050` – Acelerômetro e giroscópio
- **Protocolos**:
  - HTTP POST para webhook remoto (n8n)
  - Wi-Fi para comunicação com a internet

## 🗂️ Estrutura do Código

- `setup()` — Inicializa os sensores, MPU6050, Wi-Fi e serial
- `loop()` — Lê os sensores, detecta quedas e envia os dados para o servidor
- Funções auxiliares:
  - `sendDataToServer()` — Envia os dados como JSON via HTTP POST
  - `detectFall()` — Detecta quedas com base em aceleração total
  - `readHeartRate()` — Lê dados do MAX30100
  - `readDHTData()` — Lê temperatura e umidade ambiente

## ⚙️ Configuração do Ambiente

### ✅ Requisitos

- **Arduino IDE** (versão recente)
- **Placa ESP32** instalada via Gerenciador de Placas
- **Bibliotecas necessárias**:
  - `WiFi.h`
  - `Wire.h`
  - `Firebase ESP32 Client`
  - `Adafruit_BMP180`
  - `Adafruit_Sensor`
  - `MPU6050_tockn`
  - `MAX30100lib`

> ⚠️ Instale essas bibliotecas via "Gerenciar Bibliotecas" no Arduino IDE.

### 📶 Configuração de Wi-Fi

Edite no topo do arquivo `esp32_spc.ino`:

```cpp
const char* ssid = "SEU_SSID";
const char* password = "SUA_SENHA";
```
