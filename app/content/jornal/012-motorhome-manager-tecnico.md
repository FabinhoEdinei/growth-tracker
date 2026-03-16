---
title: "Motorhome Manager: Stack Tecnológica e Integração com Hardware"
slug: "motorhome-manager-tecnico-implementacao"
date: "2026-03-16"
author: "Fabio Edinei"
category: "Tecnologia"
excerpt: "Parte 2 da série: explore a stack tecnológica, estrutura do projeto, como executar localmente e integrar com Arduino/ESP32 no Motorhome Manager."
series: "Motorhome Manager"
seriesPart: 2
---

# 🔧 Motorhome Manager: Stack Tecnológica e Integração com Hardware

> **Repositório Oficial:** [github.com/FabinhoEdinei/motorhome-manager](https://github.com/FabinhoEdinei/motorhome-manager)  
> *Parte 2 de 3 da série completa sobre o Motorhome Manager*

Nesta segunda parte da série, mergulhamos nos detalhes técnicos que tornam o Motorhome Manager possível: arquitetura, tecnologias, estrutura de pastas e integração com hardware real.

> ✨ **Leitura recomendada:** Se ainda não leu a [Parte 1: Apresentação e Funcionalidades](/motorhome-manager-apresentacao-funcionalidades), comece por lá para entender o contexto do app.

---

## 🛠️ Stack Tecnológica Completa

O app foi construído com tecnologias modernas, escaláveis e com foco em performance mobile:

```yaml
Framework & Core:
  • Expo SDK 50+ - Ambiente de desenvolvimento unificado
  • React Native 0.73+ - Renderização nativa multiplataforma
  • TypeScript 5.x - Type safety e melhor DX

Navegação & Roteamento:
  • Expo Router (file-based routing) - Navegação tipo Next.js
  • React Navigation v6 - Fallback para navegação programática
  • Tab bar nativa com suporte a Liquid Glass (iOS)

Estado & Persistência:
  • React Context API - Estado global leve e previsível
  • AsyncStorage (@react-native-async-storage) - Dados locais offline
  • Zustand (opcional) - Para estados mais complexos no futuro

UI & Animações:
  • react-native-reanimated 3.x - Animações 60fps na thread UI
  • react-native-gesture-handler - Gestos nativos performáticos
  • Componentes customizados com design system próprio

Tema & Estilização:
  • Dark mode nativo com detecção automática do sistema
  • Cores: fundo #0A0E17, superfície #151E2E, acento #00E5C5 (teal)
  • Styled-components ou TailwindRN (configurável)

Conectividade:
  • react-native-ble-plx - Bluetooth Low Energy robusto
  • WebSocket/HTTP - Comunicação via WiFi com microcontroladores
  • expo-network - Detecção de conectividade e tipo de rede
```

---

## 📁 Estrutura do Projeto Detalhada---

## 🚀 Como Executar Localmente (Passo a Passo)

### Pré-requisitos:
- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Expo Go app no seu smartphone (iOS/Android)
- (Opcional) Emulador Android ou Simulator iOS para testes

### Instalação e Execução:

```bash
# 1. Clone o repositório
git clone https://github.com/FabinhoEdinei/motorhome-manager.git
cd motorhome-manager

# 2. Instale as dependências (usando pnpm para workspaces)
pnpm install

# 3. Inicie o servidor de desenvolvimento do Expo
pnpm --filter @workspace/motorhome run dev
# Ou simplesmente: pnpm dev (se configurado no package.json raiz)

# 4. Escaneie o QR code exibido no terminal com o app Expo Go
#    OU conecte um dispositivo físico via USB para desenvolvimento nativo

# 5. (Opcional) Ative o modo de simulação nas configurações
#    para testar sem hardware real conectado
```

### Scripts Disponíveis:

```json
{
  "scripts": {
    "dev": "expo start",              // Inicia servidor de desenvolvimento
    "android": "expo start --android", // Abre no emulador Android
    "ios": "expo start --ios",        // Abre no Simulator iOS
    "web": "expo start --web",        // Versão web experimental
    "build:preview": "eas build --profile preview", // Build para teste
    "build:production": "eas build --profile production", // Build para loja
    "lint": "eslint . --ext .ts,.tsx", // Verificação de código
    "test": "jest",                   // Executa testes unitários
    "test:watch": "jest --watch"      // Testes em modo watch
  }
}
```

> 💡 **Dica Pro:** Use `EXPO_NO_TELEMETRY=1 pnpm dev` para desativar telemetria do Expo durante desenvolvimento local.

---

## 🔗 Conexão com Hardware Real (Arduino/ESP32)

O app está preparado para integrar com microcontroladores populares via dois protocolos:

### Via Bluetooth Low Energy (BLE)

Ideal para conexão direta, baixo consumo e pareamento simples:

```typescript
// services/ble/deviceScanner.ts
import { BleManager, Device } from 'react-native-ble-plx';

export class BLEScanner {
  private manager = new BleManager();

  async scanForDevices(serviceUUID: string): Promise<Device[]> {
    await this.manager.startDeviceScan([serviceUUID], null, (error, device) => {
      if (error) {
        console.error('Erro no scan BLE:', error);
        return;
      }
      if (device?.name?.includes('MotorHome')) {
        // Adiciona dispositivo encontrado à lista
        this.onDeviceFound(device);
      }
    });
    
    // Para scan após 10 segundos
    setTimeout(() => this.manager.stopDeviceScan(), 10000);
    return this.foundDevices;
  }

  async readSensor(
    deviceId: string, 
    serviceUUID: string, 
    characteristicUUID: string
  ): Promise<number> {
    const device = await this.manager.connectToDevice({ id: deviceId });
    await device.discoverAllServicesAndCharacteristics();
    const data = await device.readCharacteristicForService(serviceUUID, characteristicUUID);
    return this.parseSensorData(data.value);
  }

  private parseSensorData(base64Value: string | null): number {
    if (!base64Value) return 0;
    const bytes = Buffer.from(base64Value, 'base64');
    // Implementar lógica específica do seu protocolo
    return bytes.readInt16LE(0) / 100; // Exemplo: valor com 2 casas decimais
  }
}
```

### Via WiFi (WebSocket/HTTP)

Ideal para maior largura de banda e integração com rede local:

```typescript
// services/wifi/apiClient.ts
export class WiFiClient {
  private baseUrl: string;
  private ws: WebSocket | null = null;

  constructor(ip: string, port: number = 80) {
    this.baseUrl = `http://${ip}:${port}`;
  }

  // Polling HTTP para dados de sensores
  async fetchSensorData(): Promise<SensorData> {
    const response = await fetch(`${this.baseUrl}/api/sensors`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  }

  // Envio de comandos para atuadores
  async sendCommand(endpoint: string, payload: any): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.ok;
  }

  // Conexão WebSocket para dados em tempo real
  connectRealtime(onData: (data: any) => void): void {
    this.ws = new WebSocket(`ws://${this.baseUrl}/ws`);
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onData(data);
      } catch (e) {
        console.error('Erro ao parsear mensagem WebSocket:', e);
      }
    };
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }
}
```

### Hardware Recomendado para Integração:

| Componente | Função | Modelo Sugerido | Custo Aprox. |
|-----------|--------|----------------|--------------|
| 🧠 Microcontrolador | Processamento central + WiFi+BLE | ESP32-WROOM-32 | R$ 35-50 |
| 🔋 Sensor de Bateria | Monitoramento de carga/voltagem | INA219 + Shunt 0.1Ω | R$ 25-40 |
| 💧 Sensor de Nível | Tanques de água limpa/esgoto | Ultrassônico JSN-SR04T (à prova d'água) | R$ 45-70 |
| ☀️ Sensor Solar | Medição de geração fotovoltaica | ACS712 (corrente) + Voltage Divider (tensão) | R$ 30-50 |
| 🌡️ Sensor de Temperatura | Ambiente interno/externo | BME280 (temp+umidade+pressão) | R$ 20-35 |
| 🔌 Relés/SSR | Controle de equipamentos 12V/110V/220V | Módulo relé 4 canais + SSR para AC | R$ 40-80 |
| 💡 Controlador PWM | Dimmer para iluminação LED | MOSFET + PWM do ESP32 | R$ 15-25 |

### Exemplo de Firmware ESP32 (Arduino IDE):

```cpp
// firmware/esp32-motorhome.ino (trecho simplificado)
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

#define BATTERY_PIN 34
#define WATER_PIN 35
#define RELAY_PIN 2

WebServer server(80);

void setup() {
  Serial.begin(115200);
  WiFi.begin("SSID", "PASSWORD");
  
  // Configura endpoints da API
  server.on("/api/sensors", HTTP_GET, []() {
    StaticJsonDocument<200> doc;
    doc["battery"] = analogRead(BATTERY_PIN) * 0.004; // Exemplo de conversão
    doc["water"] = analogRead(WATER_PIN) * 0.097;
    String response;
    serializeJson(doc, response);
    server.send(200, "application/json", response);
  });
  
  server.on("/api/equipment/toggle", HTTP_POST, []() {
    String equipment = server.arg("equipment");
    bool state = server.arg("state") == "true";
    if (equipment == "fridge") {
      digitalWrite(RELAY_PIN, state ? HIGH : LOW);
    }
    server.send(200, "text/plain", "OK");
  });
  
  server.begin();
}

void loop() {
  server.handleClient();
  delay(100);
}
```

> 🔐 **Segurança**: Em produção, implemente autenticação básica, HTTPS e firewall no ESP32 para evitar acesso não autorizado à sua rede local.

---

## 🧪 Testes e Qualidade de Código

### Testes Unitários (Jest + React Native Testing Library):

```typescript
// tests/components/SensorCard.test.tsx
import { render, screen } from '@testing-library/react-native';
import { SensorCard } from '../../components/sensors/SensorCard';

describe('SensorCard', () => {
  it('exibe valor formatado com unidade', () => {
    render(<SensorCard label="Bateria" value={87.5} unit="%" />);
    expect(screen.getByText('87.5%')).toBeTruthy();
  });

  it('aplica cor crítica para bateria <20%', () => {
    render(<SensorCard label="Bateria" value={15} unit="%" type="battery" />);
    const card = screen.getByTestId('sensor-card');
    expect(card.props.style).toContainEqual({ borderColor: '#F44336' });
  });
});
```

### Testes de Integração com Mocks de BLE:

```typescript
// tests/services/ble.test.ts
jest.mock('react-native-ble-plx', () => ({
  BleManager: jest.fn().mockImplementation(() => ({
    startDeviceScan: jest.fn(),
    connectToDevice: jest.fn().mockResolvedValue({
      discoverAllServicesAndCharacteristics: jest.fn(),
      readCharacteristicForService: jest.fn().mockResolvedValue({
        value: 'AQE=' // Base64 para valor de exemplo
      })
    })
  }))
}));

test('lê dados de sensor via BLE com sucesso', async () => {
  const scanner = new BLEScanner();
  const value = await scanner.readSensor('device-123', 'svc-uuid', 'char-uuid');
  expect(value).toBe(25.7); // Valor esperado após parse
});
```

### Checklist de Qualidade:

- [ ] TypeScript sem erros (`tsc --noEmit`)
- [ ] ESLint sem warnings (`pnpm lint`)
- [ ] Testes passando com >80% de coverage (`pnpm test -- --coverage`)
- [ ] Build do Expo sem erros (`eas build --profile preview --local`)
- [ ] Performance: <16ms por frame em dispositivos médios (usar Flipper Profiler)

---

## 🔗 Navegação da Série Completa

| Parte | Título | Link |
|-------|--------|------|
| **1** | 🚐 Apresentação e Funcionalidades | [motorhome-manager-apresentacao](/motorhome-manager-apresentacao-funcionalidades) |
| **2** | ✅ Aspectos Técnicos e Implementação | *Você está aqui* |
| **3** | 🚀 Roadmap, Melhorias e Como Contribuir | [motorhome-manager-roadmap](/motorhome-manager-roadmap) |

---

> 🔧 *"Código limpo e hardware bem integrado: a base para uma viagem sem preocupações."*

**Motorhome Manager** — Tecnologia open source a serviço da liberdade sobre rodas.

---

*Última atualização: Março 2026*  
*Versão do App: 0.1.0 (Alpha)*  
*Licença: MIT*  
*Série: Motorhome Manager (2/3)*