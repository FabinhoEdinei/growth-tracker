---
author: Fabio Edinei
category: Motorhome
date: 2026-03-27
description: Guia definitivo sobre sistema elétrico para motorhome,
  consumo, segurança e dicas.
keywords:
- motorhome
- energia motorhome
- ecoflow delta 2 max
- sistema elétrico camper
- renault master motorhome
slug: sistema-eletrico-motorhome-app
title: "Sistema Elétrico de Motorhome: Guia Completo com EcoFlow Delta 2
  Max (Mercedes Sprinter)"
---
# Plano de Hardware — Motorhome Manager

Guia completo de equipamentos, sensores e acessórios necessários para deixar o app 100% funcional com dados reais do motorhome.

---

## Visão Geral da Arquitetura

```
[Sensores físicos]
        │
        ▼
[Arduino / ESP32]  ──BT/WiFi──►  [App Motorhome Manager]
        │
        ▼
[Relés / Atuadores]  ◄──────────  [Comandos do App]
```

O cérebro do sistema é um **ESP32** (recomendado) ou Arduino com módulo de comunicação. Ele lê os sensores, envia os dados ao app e recebe comandos para ligar/desligar equipamentos.

---

## 1. Microcontrolador Principal

### Opção A — ESP32 (Recomendado ✅)

| Item | Modelo sugerido | Preço estimado |
|------|----------------|----------------|
| Placa ESP32 | ESP32 DevKit V1 / WROOM-32 | R$ 40–70 |
| Case/gabinete | Caixa patola PB-170 | R$ 15–25 |

**Por que ESP32?**
- WiFi + Bluetooth integrados (sem módulos extras)
- 18 pinos analógicos/digitais
- Suporta múltiplos sensores simultaneamente
- Programável via Arduino IDE
- Opera em 3.3V e 5V

### Opção B — Arduino Mega + Módulos

| Item | Modelo | Preço estimado |
|------|--------|----------------|
| Arduino Mega 2560 | Original ou clone | R$ 80–150 |
| Módulo WiFi | ESP8266 NodeMCU | R$ 25–40 |
| Módulo Bluetooth | HC-05 ou HC-06 | R$ 20–35 |

> Recomendamos o **ESP32** pela praticidade e custo-benefício.

---

## 2. Sensores — Dados do App

### 2.1 Nível de Água (Tanque)

| Item | Especificação | Quantidade | Preço est. |
|------|---------------|------------|------------|
| Sensor ultrassônico | JSN-SR04T (à prova d'água) | 1 | R$ 30–50 |
| Ou sensor de boia | Sensor de nível float vertical | 1 | R$ 15–30 |
| Ou sensor capacitivo | XKC-Y25-T12V (sem contato) | 1 | R$ 35–60 |

**Recomendação:** JSN-SR04T para tanques fechados (mede distância até a água).

**Instalação:** Montado na tampa superior do tanque apontado para baixo. O ESP32 calcula o nível com base na distância medida.

---

### 2.2 Nível e Voltagem da Bateria

| Item | Especificação | Quantidade | Preço est. |
|------|---------------|------------|------------|
| Divisor de tensão | Resistores 100kΩ + 10kΩ (montagem simples) | 1 kit | R$ 5–10 |
| Ou módulo divisor | Módulo sensor de tensão 0–25V | 1 | R$ 8–15 |
| Sensor de corrente | Módulo ACS712 (20A ou 30A) | 1 | R$ 15–25 |
| Shunt + amperímetro | 100A/75mV para banco de baterias grande | 1 | R$ 20–40 |

**Como funciona:** O divisor de tensão reduz a tensão da bateria (12V) para a faixa segura do ESP32 (0–3.3V). O ACS712 mede a corrente que entra/sai do banco.

> ⚠️ **Importante:** NUNCA conecte 12V diretamente ao pino analógico do ESP32. Use o divisor de tensão.

---

### 2.3 Energia Solar (Painel + Controlador)

| Item | Especificação | Quantidade | Preço est. |
|------|---------------|------------|------------|
| Sensor de tensão solar | Módulo divisor 0–25V (mesmo da bateria) | 1 | R$ 8–15 |
| Sensor de corrente | ACS712 30A | 1 | R$ 20–30 |
| Controlador de carga MPPT | Victron MPPT 75/15 ou similar | 1 | R$ 300–800 |

**Alternativa inteligente:** Controladores de carga como o **Victron SmartSolar** têm porta VE.Direct que pode ser lida pelo ESP32, fornecendo todos os dados solares sem sensores adicionais.

---

### 2.4 Temperatura

| Item | Especificação | Quantidade | Preço est. |
|------|---------------|------------|------------|
| Sensor interno | DHT22 (temperatura + umidade) | 1 | R$ 20–35 |
| Sensor externo | DS18B20 à prova d'água | 1 | R$ 15–25 |
| Sensor de água | DS18B20 à prova d'água (mesmo modelo) | 1 | R$ 15–25 |

**Dica:** O DS18B20 usa protocolo OneWire — você pode ligar vários na mesma porta do ESP32 com resistor pull-up de 4.7kΩ.

---

## 3. Controle de Equipamentos (Liga/Desliga)

Para cada equipamento que o app controla, você precisa de um **relé** correspondente.

### Módulos de Relé

| Item | Especificação | Quantidade | Preço est. |
|------|---------------|------------|------------|
| Módulo 1 relé | 5V, 10A, para cargas 12V | 8 (um por equipamento) | R$ 10–18 cada |
| Ou módulo 8 relés | Módulo 8 canais 5V | 1 | R$ 35–60 |
| Módulo 4 relés | 5V, 10A (complementar) | 1 | R$ 20–35 |

### Mapeamento de Relés por Equipamento

| Equipamento (App) | Relé | Carga Máxima | Observação |
|-------------------|------|--------------|------------|
| Inversor | 1 canal 30A | Alta corrente | Usar relé de estado sólido (SSR) |
| Bomba d'água | 1 canal 10A | 12V/80W | Relé comum |
| Ar-condicionado | 1 canal SSR | 220V/1200W | SSR para CA 220V |
| Aquecedor | 1 canal SSR | 220V/800W | SSR para CA 220V |
| TV | 1 canal 5A | 12V/60W | Relé comum |
| Geladeira | 1 canal 5A | 12V/45W | Relé comum |
| Câmera traseira | 1 canal 2A | 12V/5W | Relé comum |
| Alarme | 1 canal 2A | 12V/3W | Relé comum |

> ⚠️ Para inversor e aparelhos 220V, use **Relé de Estado Sólido (SSR)** com dissipador de calor.

---

## 4. Controle de Iluminação

### LEDs e Dimmer

| Item | Especificação | Quantidade | Preço est. |
|------|---------------|------------|------------|
| Fita LED 12V | LED branco quente 5050, 5m | 2–4 (por cômodo) | R$ 25–60 cada |
| Módulo MOSFET | IRLZ44N ou módulo PWM 12V | 1 por zona | R$ 5–15 cada |
| Driver PWM | Controlador PWM 12V 8A | 1 por zona | R$ 15–25 cada |

**Como funciona:** O ESP32 gera sinal PWM (0–255) para cada zona de iluminação. O MOSFET amplifica esse sinal para controlar a fita LED 12V com o brilho desejado.

### Mapeamento de Zonas de Luz

| Zona (App) | Saída PWM | Corrente máxima |
|------------|-----------|-----------------|
| Sala | GPIO ESP32 + MOSFET | ~3A |
| Quarto | GPIO ESP32 + MOSFET | ~3A |
| Cozinha | GPIO ESP32 + MOSFET | ~3A |
| Banheiro | GPIO ESP32 + MOSFET | ~2A |
| Externo | GPIO ESP32 + MOSFET | ~4A |
| Cabine | GPIO ESP32 + MOSFET | ~2A |

---

## 5. Alimentação do Sistema

| Item | Especificação | Preço est. |
|------|---------------|------------|
| Conversor DC-DC | Step-down 12V → 5V, 3A (para ESP32 e módulos) | R$ 15–30 |
| Fusíveis | Porta-fusível + fusível 5A (proteção do sistema) | R$ 10–20 |
| Barra de distribuição 12V | Barra com terminais e fusíveis individuais | R$ 30–80 |
| Fios | Cabo flexível 2,5mm² (vermelho e preto) | R$ 20–40 |

---

## 6. Comunicação App ↔ ESP32

### Via Bluetooth (BLE)

O ESP32 já possui BLE nativo. Configure o firmware para expor um serviço BLE com as características dos sensores.

**Biblioteca Arduino:** `BLEDevice`, `BLEServer`, `BLEService`

**Sem custo adicional de hardware.**

### Via WiFi (Recomendado para dados contínuos)

O ESP32 cria um servidor WebSocket ou HTTP local na rede WiFi do motorhome.

| Item | Para que serve | Preço est. |
|------|---------------|------------|
| Roteador WiFi 12V | TP-Link TL-MR3020 ou similar | R$ 80–150 |
| Ou ponto de acesso | ESP32 em modo AP (Access Point) | Sem custo extra |

**Recomendação:** O próprio ESP32 pode funcionar como ponto de acesso WiFi. O celular conecta na rede do ESP32 e o app recebe os dados.

---

## 7. Lista de Compras Consolidada

### Kit Básico (Sensores Essenciais) — ~R$ 400–600

| Item | Qtd | Preço est. |
|------|-----|------------|
| ESP32 DevKit V1 | 1 | R$ 55 |
| Sensor ultrassônico JSN-SR04T | 1 | R$ 40 |
| Módulo sensor de tensão 0–25V | 2 | R$ 28 |
| Sensor de corrente ACS712 30A | 2 | R$ 50 |
| DHT22 (temp. interna) | 1 | R$ 25 |
| DS18B20 à prova d'água | 2 | R$ 40 |
| Módulo 8 relés 5V | 1 | R$ 50 |
| Módulo 4 relés 5V | 1 | R$ 28 |
| Conversor DC-DC 12V→5V 3A | 1 | R$ 22 |
| Fios, resistores, fusíveis | — | R$ 50 |
| Caixa patola para ESP32 | 1 | R$ 20 |
| **Total estimado** | | **~R$ 408** |

### Kit Iluminação Inteligente — ~R$ 200–400

| Item | Qtd | Preço est. |
|------|-----|------------|
| Fita LED 12V 5m | 4 | R$ 160 |
| Módulo MOSFET IRLZ44N | 6 | R$ 60 |
| Dissipador de calor | 2 | R$ 20 |
| **Total estimado** | | **~R$ 240** |

### Kit Controle 220V (Inversor/AC) — ~R$ 150–300

| Item | Qtd | Preço est. |
|------|-----|------------|
| Relé de Estado Sólido 40A | 2 | R$ 80 |
| Dissipador para SSR | 2 | R$ 30 |
| Caixa elétrica para SSR | 1 | R$ 25 |
| **Total estimado** | | **~R$ 135** |

---

## 8. Onde Comprar

| Loja | Tipo | Site |
|------|------|------|
| FilipeFlop | Nacional, componentes eletrônicos | filipeflop.com |
| Baú da Eletrônica | Nacional, amplo estoque | baudaeletronica.com.br |
| Mercado Livre | Diversas procedências | mercadolivre.com.br |
| AliExpress | Importado, mais barato, mais lento | aliexpress.com |
| Amazon Brasil | Importado com entrega rápida | amazon.com.br |

---

## 9. Firmware do ESP32 — O que Programar

O firmware precisa implementar as seguintes funcionalidades para o app funcionar:

### Leitura de Sensores (a cada 3 segundos)
```
- Nível de água via JSN-SR04T → percentual 0–100%
- Tensão da bateria via divisor → volts (ex: 12.6V)
- Nível da bateria → estimado pela tensão (12.7V=100%, 11.6V=0%)
- Corrente solar via ACS712 → Watts (V × A)
- Temperatura interna via DHT22
- Temperatura externa e água via DS18B20
```

### Envio de Dados (JSON via BLE ou WiFi)
```json
{
  "waterLevel": 73,
  "batteryLevel": 85,
  "batteryVoltage": 12.6,
  "solarPower": 240,
  "solarVoltage": 18.4,
  "internalTemp": 24.1,
  "externalTemp": 28.3,
  "waterTemp": 22.0,
  "timestamp": 1234567890
}
```

### Recebimento de Comandos
```
- toggle_relay:{id}  → ligar/desligar equipamento
- set_pwm:{zona}:{0-255}  → controlar brilho da luz
- toggle_light:{id}  → ligar/desligar luz
```

### Bibliotecas Arduino Recomendadas
- `ArduinoJson` — serialização JSON
- `BLEDevice` — Bluetooth BLE
- `WebSocketsServer` — WebSocket via WiFi
- `OneWire` + `DallasTemperature` — DS18B20
- `DHT` — DHT22
- `NewPing` — sensor ultrassônico

---

## 10. Integração com o App

Após montar o hardware, os dados reais substituem a simulação no app. No arquivo `context/MotorHomeContext.tsx`, substitua a função `simulateSensorUpdate` por uma chamada real:

**Via WiFi (WebSocket):**
```typescript
// Conectar ao ESP32 via WebSocket local
const ws = new WebSocket('ws://192.168.4.1:81');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  setSensors(data);
};
```

**Via Bluetooth (BLE):**
```typescript
// Usar biblioteca expo-ble ou react-native-ble-plx
// para ler as características BLE do ESP32
```

---

## 11. Checklist de Instalação

- [ ] Montar ESP32 com conversor DC-DC na caixa patola
- [ ] Conectar sensor de nível de água ao tanque
- [ ] Conectar divisores de tensão nas baterias e painel solar
- [ ] Conectar sensores ACS712 nos cabos de corrente
- [ ] Instalar sensores de temperatura (interno, externo, água)
- [ ] Instalar módulos de relé e conectar aos equipamentos
- [ ] Instalar fitas LED e conectar MOSFETs para controle PWM
- [ ] Proteger todas as conexões 12V com fusíveis
- [ ] Testar cada sensor individualmente no monitor serial
- [ ] Fazer upload do firmware completo
- [ ] Conectar o app ao ESP32 e verificar dados em tempo real
- [ ] Testar liga/desliga de cada equipamento pelo app
- [ ] Testar controle de brilho de cada zona de luz

---

## Custo Total Estimado

| Kit | Valor |
|-----|-------|
| Kit Básico (sensores + ESP32 + relés) | R$ 400–600 |
| Kit Iluminação Inteligente | R$ 200–400 |
| Kit Controle 220V | R$ 135–300 |
| Cabeamento e acessórios extras | R$ 80–150 |
| **Total Geral** | **R$ 815 – R$ 1.450** |

> Os preços são estimativas para o mercado brasileiro em 2025. Compras no AliExpress podem reduzir o custo em 30–50% com prazo de entrega de 20–40 dias.

---

*Documento gerado pelo Motorhome Manager — plano técnico de integração de hardware.*

