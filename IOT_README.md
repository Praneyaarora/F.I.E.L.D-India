# FIELD INDIA: IoT System Setup & Working Principles

## Overview

The FIELD INDIA IoT system is the physical infrastructure that automates aquaponics management and smart irrigation. Built on Raspberry Pi, it integrates multiple sensors and actuators to monitor and control environmental conditions, water quality, and field irrigation in real-time.

## System Architecture

### Hardware Components

#### 1. Central Controller
- **Raspberry Pi 4 Model B (4GB RAM)**
  - Quad-core ARM Cortex-A72 processor
  - WiFi 802.11ac for cloud connectivity
  - 40-pin GPIO header for sensor/actuator interfacing
  - MicroSD card (64GB) for OS and data logging

#### 2. Water Quality Sensors (Tank 1)

**A. Water Temperature Sensor**
- **Model:** DS18B20 Digital Temperature Sensor
- **Interface:** 1-Wire protocol
- **Range:** -55°C to +125°C
- **Accuracy:** ±0.5°C
- **Purpose:** Monitor Tank 1 water temperature for fish and Azotobacter bacteria health
- **Wiring:** VCC → 3.3V, GND → GND, DATA → GPIO 4 (with 4.7kΩ pull-up resistor)

**B. Dissolved Oxygen Sensor**
- **Model:** Atlas Scientific DO Probe
- **Interface:** I2C or UART
- **Range:** 0.01 to 100+ mg/L
- **Accuracy:** ±0.05 mg/L
- **Purpose:** Ensure adequate oxygen for fish respiration and aerobic bacteria
- **Wiring:** VCC → 5V, GND → GND, SDA → GPIO 2, SCL → GPIO 3
- **Calibration:** Performed monthly using air-saturated water reference

**C. pH Sensor**
- **Model:** Atlas Scientific pH Probe
- **Interface:** I2C
- **Range:** 0 to 14 pH
- **Accuracy:** ±0.02 pH
- **Purpose:** Maintain optimal pH for fish health and bacterial nitrification
- **Wiring:** VCC → 5V, GND → GND, SDA → GPIO 2, SCL → GPIO 3
- **Maintenance:** Probe storage in pH 4.0 solution; calibration every 2 weeks

#### 3. Environmental Sensors

**DHT22 Temperature & Humidity Sensor**
- **Model:** DHT22 (AM2302)
- **Interface:** Digital single-wire
- **Temperature Range:** -40°C to +80°C (±0.5°C accuracy)
- **Humidity Range:** 0-100% RH (±2% accuracy)
- **Purpose:** Monitor ambient conditions affecting evapotranspiration
- **Wiring:** VCC → 5V, GND → GND, DATA → GPIO 13 (with 10kΩ pull-up resistor)
- **Sampling Rate:** Every 2 seconds (sensor limitation)

#### 4. Soil Moisture Sensors (×2)

**Capacitive Soil Moisture Sensor**
- **Model:** Capacitive v1.2 (corrosion-resistant)
- **Interface:** Analog output (0-3.3V) via ADC
- **Range:** 0-100% volumetric water content
- **Purpose:** Detect irrigation needs for each crop zone
- **Wiring:** 
  - Sensor 1 → ADS1115 ADC Channel A0
  - Sensor 2 → ADS1115 ADC Channel A1
  - ADC → I2C (SDA GPIO 2, SCL GPIO 3)
- **Calibration:** 
  - Dry soil: ~2.8V (0%)
  - Water-saturated soil: ~1.2V (100%)
  - Interpolate intermediate values

#### 5. Actuators & Control Devices

**A. Water Pumps (×2)**
- **Model:** 12V DC Submersible Pump (1000L/hr capacity)
- **Pump 1 (Tank 1):** Transfer fish waste to Tank 2
- **Pump 2 (Tank 2):** Distribute fertilizer water to fields
- **Control:** Via relay modules (5V trigger)
- **Wiring:**
  - Pump 1 Relay → GPIO 5
  - Pump 2 Relay → GPIO 6
  - Relay COM → 12V Power Supply
  - Relay NO → Pump positive terminal
  - Pump negative → Power supply GND

**B. Solenoid Valves (×2)**
- **Model:** 12V DC Normally Closed Solenoid Valve (1/2" inlet)
- **Purpose:** Direct water flow to specific field zones
- **Control:** Via relay modules
- **Wiring:**
  - Valve 1 Relay → GPIO 3
  - Valve 2 Relay → GPIO 4
  - Relay wiring same as pumps

**C. Water Heater**
- **Model:** 300W Aquarium Heater with external relay control
- **Purpose:** Maintain Tank 1 temperature at 22-25°C
- **Control:** Relay-switched (GPIO 7)
- **Safety:** Thermal cutoff at 30°C
- **Wiring:** Relay controls AC power to heater (via optocoupler for isolation)

**D. Oxygen Supplier**
- **Model:** 12V DC Air Pump with air stone
- **Flow Rate:** 3 L/min
- **Purpose:** Increase dissolved oxygen when levels drop below 5 mg/L
- **Control:** Relay (GPIO 10)
- **Wiring:** Same relay configuration as water pumps

**E. pH Moderator (Dosing Pump)**
- **Model:** 12V Peristaltic Dosing Pump
- **Purpose:** Inject pH up/down solution to maintain pH 7-7.5
- **Control:** Relay (GPIO 12) with PWM for dosing amount
- **Solution:** Food-grade potassium hydroxide (pH up) or citric acid (pH down)
- **Safety:** Maximum dosing 10mL per event with 30-minute wait before retest

#### 6. Display Module

**16×2 I2C LCD Display**
- **Model:** HD44780 with PCF8574 I2C adapter
- **Interface:** I2C (Address 0x27)
- **Purpose:** Local display of sensor readings and system status
- **Wiring:** VCC → 5V, GND → GND, SDA → GPIO 2, SCL → GPIO 3
- **Display Format:**
  - Line 1: "T:24.2C pH:7.3"
  - Line 2: "O2:6.5 M1:45%"
  - Rotates every 5 seconds between different metrics

#### 7. Manual/Auto Mode Switch

**Toggle Switch (SPDT)**
- **Purpose:** Switch between automatic IoT control and manual operation
- **Wiring:** 
  - Common → GPIO 14
  - NO → 3.3V (Manual mode)
  - NC → GND (Auto mode)
- **Internal Pull-Down:** Enabled on GPIO 14
- **Logic:** HIGH = Manual, LOW = Auto

#### 8. Power Supply System

- **Main Power:** 12V 10A DC Power Supply
- **Voltage Regulators:**
  - 5V 3A Buck Converter for Raspberry Pi, sensors, relays
  - 3.3V supplied by Raspberry Pi GPIO
- **Backup:** UPS module (8000mAh battery) for 4-hour operation during power cuts
- **Protection:** Fuses on all high-current lines

## Working Principles

### Tank 1: Aquaponics Module

**Biological System:**
- **Fish:** Provide protein and ammonia-rich waste
- **Azotobacter Bacteria:** Fix atmospheric nitrogen, enhance water quality
- **Bacillus Bacteria:** Decompose organic waste, reduce feed requirements

**IoT Control Loop:**

1. **Temperature Management:**


IF water_temp < 22°C:
TURN ON heater
ELSE IF water_temp > 25°C:
TURN OFF heater
ALERT: "High temperature - check ambient conditions"


2. **Oxygen Management:**

IF dissolved_oxygen < 5.0 mg/L:
TURN ON oxygen supplier
ELSE IF dissolved_oxygen > 7.0 mg/L:
TURN OFF oxygen supplier


3. **pH Management:**

IF pH < 7.0:
DOSE pH_up solution (5mL)
WAIT 30 minutes
RETEST
ELSE IF pH > 7.5:
DOSE pH_down solution (5mL)
WAIT 30 minutes
RETEST


**Data Collection:**
- Sensors polled every 5 minutes
- Moving average (15-minute window) to smooth noise
- Anomaly detection: Alert if any parameter changes >20% in 30 minutes
- Upload to cloud every 10 minutes via HTTPS

### Tank 2: NPK Production Module

**Biological System:**
- **Nitrifying Bacteria:** Convert ammonia → nitrite → nitrate (Nitrogen)
- **Phosphate-Solubilizing Bacteria:** Release phosphorus from organic matter
- **Potassium-Releasing Bacteria:** Mobilize potassium from fish waste

**IoT Control Loop:**

1. **Waste Transfer (Scheduled):**

IF time == 06:00 AND day_of_week == Monday:
TURN ON Pump 1 for 10 minutes
LOG: "Waste transfer initiated"
START NPK conversion timer


2. **Conversion Monitoring:**
- Track pH and temperature trends (bacterial activity indicators)
- Estimate NPK readiness based on time since transfer and temperature
- Typical conversion time: 5-7 days at 25°C

3. **Fertilizer Distribution:**
- Triggered by field irrigation demand (see below)
- No direct sensors in Tank 2 (cost optimization)
- Manual sampling recommended weekly

### Field Irrigation System

**Crop Zones:**
- **Zone 1:** Monitored by Moisture Sensor 1, controlled by Solenoid Valve 1
- **Zone 2:** Monitored by Moisture Sensor 2, controlled by Solenoid Valve 2

**IoT Control Loop:**

1. **Moisture Monitoring:**

moisture_1 = READ_SENSOR(MOISTURE_SENSOR_1)
moisture_2 = READ_SENSOR(MOISTURE_SENSOR_2)

Convert voltage to percentage (calibrated)
moisture_1_pct = MAP(moisture_1, 1.2V, 2.8V, 100%, 0%)
moisture_2_pct = MAP(moisture_2, 1.2V, 2.8V, 100%, 0%)


2. **Irrigation Decision (Every 15 minutes):**

THRESHOLD_1 = 40% # Crop-specific (e.g., tomatoes)
THRESHOLD_2 = 35% # Crop-specific (e.g., lettuce)

irrigation_needed = False

IF moisture_1_pct < THRESHOLD_1:
OPEN Valve 1
irrigation_needed = True
LOG: "Zone 1 irrigation started"
ELSE:
CLOSE Valve 1

IF moisture_2_pct < THRESHOLD_2:
OPEN Valve 2
irrigation_needed = True
LOG: "Zone 2 irrigation started"
ELSE:
CLOSE Valve 2

IF irrigation_needed:
TURN ON Pump 2
IRRIGATE for 15 minutes OR until moisture > (THRESHOLD + 10%)
TURN OFF Pump 2
CLOSE all valves


3. **Weather Integration:**

IF rain_forecast_next_6_hours > 70% probability:
SKIP irrigation
LOG: "Irrigation postponed due to rain forecast"


4. **Time-of-Day Optimization:**


IF current_hour < 6 OR current_hour > 18:
SKIP irrigation (unless critical)
LOG: "Irrigation delayed to optimal time window"


### Carbon Filtration (Passive System)

- **Activated Carbon Filter** installed in water supply line to Tank 1
- **Purpose:** Remove chlorine, organic compounds, heavy metals
- **Maintenance:** Replace carbon every 3 months or 10,000 liters
- **No IoT control required** (passive flow-through)

### Data Transmission to Cloud

**Communication Protocol:**
- **Method:** HTTPS POST requests to [fieldindia.co.in/api/sensor](http://fieldindia.co.in/api/sensor)
- **Frequency:** Every 10 minutes (adjustable)
- **Payload Format:** JSON with all sensor readings and actuator states
- **Retry Logic:** If upload fails, queue data locally and retry every 2 minutes
- **Local Storage:** Last 7 days of data on Raspberry Pi SD card as backup

**Sample Payload:**

{
"device_id": "FIELD_INDIA_001",
"timestamp": "2025-10-21T15:30:00Z",
"tank1": {
"water_temp": 24.2,
"dissolved_oxygen": 6.5,
"ph": 7.3,
"heater_status": "ON",
"oxygen_supplier_status": "OFF"
},
"environment": {
"ambient_temp": 28.5,
"humidity": 62
},
"field": {
"soil_moisture_1": 45,
"soil_moisture_2": 52,
"valve_1_status": "CLOSED",
"valve_2_status": "OPEN",
"pump_2_status": "ON"
},
"mode": "AUTO"
}


### Manual Mode Operation

When **Mode Switch** is toggled to MANUAL:
- All automatic control loops PAUSE
- LCD displays: "MANUAL MODE"
- Farmers can manually control pumps/valves via dashboard ForceStop buttons
- Sensor data collection and cloud upload CONTINUE
- No automated actuator operations occur
- Safety limits still enforced (e.g., heater won't exceed 30°C)

### Safety Features

1. **Thermal Runaway Protection:**
   - If Tank 1 temperature >30°C, heater permanently disabled until manual reset
   - Emergency alert sent via SMS/email

2. **Pump Dry-Run Protection:**
   - Maximum continuous pump runtime: 30 minutes
   - Automatic shutoff with alert if exceeded

3. **pH Safety:**
   - Maximum 3 dosing attempts per hour
   - If pH still out of range, manual intervention required

4. **Power Failure Handling:**
   - UPS provides backup power for Raspberry Pi and critical sensors
   - Pumps/heater disabled during backup mode to conserve battery
   - System auto-resumes when main power restored

5. **Sensor Failure Detection:**
   - If sensor returns constant value for >1 hour, marked as faulty
   - Alert sent; system switches to safe default operation

## Installation & Setup

### Hardware Assembly

1. **Mount Raspberry Pi** in weatherproof enclosure
2. **Connect sensors:**
   - Temperature probe in Tank 1 (submerged, avoid direct sunlight)
   - pH probe in Tank 1 (submerged, away from air bubbles)
   - Oxygen probe in Tank 1 (submerged near water surface)
   - DHT sensor in shade, away from water spray
   - Soil moisture sensors buried at root depth in each zone
3. **Install actuators:**
   - Submersible pumps in tanks (anchored to prevent movement)
   - Solenoid valves in irrigation pipes (before field branching)
   - Oxygen air stone near tank bottom
   - Heater in Tank 1 (with guard to prevent fish contact)
4. **Wire all components** following wiring diagram (see `docs/wiring_diagram.pdf`)
5. **Connect I2C LCD** and mount at eye level for easy viewing
6. **Install Mode Switch** in accessible location
7. **Test each component individually** before integration

### Software Installation

1. **Prepare Raspberry Pi:**

Flash Raspberry Pi OS Lite (64-bit) to SD card
Enable SSH and configure WiFi (via raspi-config)
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip git -y

2. **Clone Repository:**

git clone https://github.com/fieldindia/iot-system.git
cd iot-system


3. **Install Dependencies:**

pip3 install -r requirements.txt
Includes: RPi.GPIO, adafruit-circuitpython-dht, adafruit-ads1x15,
requests, RPLCD (for I2C LCD), atlas-i2c (for pH/DO sensors)


4. **Configure Settings:**

cp config.example.json config.json
nano config.json

Edit: API_KEY, device_id, sensor calibration values, thresholds

Verify all sensors return valid readings


6. **Enable Auto-Start:**

sudo nano /etc/systemd/system/fieldindia.service

Add service configuration (see docs/systemd_service.txt)
sudo systemctl enable fieldindia.service
sudo systemctl start fieldindia.service


7. **Verify Cloud Connection:**

Check dashboard at fieldindia.co.in for incoming data
Should see first reading within 10 minutes


### Calibration Procedures

**Soil Moisture Sensors:**
1. Dry calibration: Leave sensor in air for 5 minutes, record voltage
2. Wet calibration: Submerge in water for 5 minutes, record voltage
3. Update `config.json` with calibration values

**pH Probe:**
1. Rinse with distilled water
2. Calibrate with pH 7.0 buffer (midpoint)
3. Calibrate with pH 4.0 buffer (low point)
4. Calibrate with pH 10.0 buffer (high point)
5. Follow Atlas Scientific calibration procedure

**Dissolved Oxygen Probe:**
1. Air saturation calibration (probe in air-saturated water)
2. Zero-oxygen calibration (optional, using sodium sulfite solution)

## Maintenance Schedule

| Component | Frequency | Task |
|-----------|-----------|------|
| pH Probe | Every 2 weeks | Calibration + cleaning |
| DO Probe | Every month | Calibration + membrane check |
| Soil Moisture | Every 3 months | Clean corrosion, recalibrate |
| Carbon Filter | Every 3 months | Replace activated carbon |
| Pumps | Every 6 months | Clean impellers, check seals |
| Valves | Every 6 months | Clean valve seats, test operation |
| Heater | Every 6 months | Descale heating element |
| All Sensors | Annually | Replace or professional service |

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| No data on dashboard | WiFi disconnected | Check router; verify credentials |
| Sensor reads constant value | Faulty sensor or wiring | Test with multimeter; replace sensor |
| Pump won't start | Relay failure or low power | Check relay LED; verify 12V supply |
| pH unstable | Old probe or contaminated solution | Recalibrate or replace probe |
| Heater always on | Stuck relay or sensor error | Manual shutoff; check temp sensor |

## Technical Specifications Summary

| Specification | Value |
|---------------|-------|
| Operating Voltage | 12V DC (main), 5V/3.3V (logic) |
| Power Consumption | 15W idle, 350W peak (heater on) |
| WiFi Range | 30m indoor, 100m outdoor (line of sight) |
| Operating Temperature | 0°C to 50°C ambient |
| Sensor Accuracy | ±0.5°C (temp), ±0.02 pH, ±0.05 mg/L (DO) |
| Data Upload Frequency | Every 10 minutes |
| Local Data Storage | 7 days on SD card |
| Control Loop Speed | 5 minutes for water quality, 15 min for irrigation |

## Support & Resources

- **Wiring Diagrams:** `docs/wiring_diagram.pdf`
- **Video Setup Guide:** [YouTube Playlist](https://youtube.com/fieldindia-setup)
- **Community Forum:** [community.fieldindia.co.in](http://community.fieldindia.co.in)
- **Technical Support:** iot-support@fieldindia.co.in
- **Emergency Hotline:** +91-XXXXXXXXXX (24/7)

---

**The FIELD INDIA IoT system brings industrial-grade automation to small and medium farms, ensuring optimal growing conditions while minimizing resource waste and manual labor.**


