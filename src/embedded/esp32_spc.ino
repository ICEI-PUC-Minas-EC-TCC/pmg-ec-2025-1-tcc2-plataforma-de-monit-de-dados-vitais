#include <Arduino.h>
#include <Wire.h>

// --------------------

#include<WiFi.h>
#include<Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// --------------------

#define WIFI_SSID "TROCAR PARA NOME DO WIFI"
#define WIFI_PASSWORD "TROCAR PARA SENHA DO WIFI"

// --------------------

#define API_KEY "ADICIONAR CHAVE DA API"
#define DATABASE_URL "ADICIONAR URL DA API"

// --------------------

#define DEBUG 1

#if DEBUG == 1
#define debug(x) Serial.print(x)
#define debugln(x) Serial.println(x)
#else
#define debug(x)
#define debugln(x)
#endif

// --------------------

#include "MAX30100_PulseOximeter.h"
#include <MPU6050_tockn.h>
#include <Adafruit_BMP085.h>

// --------------------

unsigned long sendDataPrevMillis = 0;
bool SPCflag = false;

// --------------------

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool signupOK = false;

// --------------------

Adafruit_BMP085 bmp;
PulseOximeter pox;
MPU6050 mpu6050(Wire);

// --------------------

void onBeatDetected() {
    Serial.println("Beat!");
}

// --------------------

int readCloudInt(String var_name) 
{
  if (Firebase.RTDB.getInt(&fbdo, var_name)) 
  {  
    int returned_value = fbdo.intData();

    return returned_value;
  } 
  
  else 
  {
    debug("FAILED REASON: ");
    debug(fbdo.errorReason());
    debugln();

    return 9999999;
  }
}

void writeCloudInt(String var_name, int var_value) 
{
  if(Firebase.RTDB.setInt(&fbdo, var_name, var_value)) 
  {
    debug("SENT TO: ");
    debug(fbdo.dataPath());
    debug(" ");
    debug(fbdo.dataType());
    debug(" ");
    debug(var_value);
    debugln();
  } 
  
  else 
  {
    debug("FAILED REASON: ");
    debug(fbdo.errorReason());
    debugln();
  }
}

int readCloudDouble(String var_name) 
{
  if (Firebase.RTDB.getDouble(&fbdo, var_name)) 
  {  
    int returned_value = fbdo.doubleData();

    return returned_value;
  } 
  
  else 
  {
    debug("FAILED REASON: ");
    debug(fbdo.errorReason());
    debugln();

    return 9999999.99;
  }
}

void writeCloudDouble(String var_name, double var_value) 
{
  if(Firebase.RTDB.setDouble(&fbdo, var_name, var_value)) 
  {
    debug("SENT TO: ");
    debug(fbdo.dataPath());
    debug(" ");
    debug(fbdo.dataType());
    debug(" ");
    debug(var_value);
    debugln();
  } 
  
  else 
  {
    debug("FAILED REASON: ");
    debug(fbdo.errorReason());
    debugln();
  }
}

void writeCloudBool(String var_name, bool var_value) 
{
  if(Firebase.RTDB.setBool(&fbdo, var_name, var_value)) 
  {
    debug("SENT TO: ");
    debug(fbdo.dataPath());
    debug(" ");
    debug(fbdo.dataType());
    debug(" ");
    debug(var_value);
    debugln();
  } 
  
  else 
  {
    debug("FAILED REASON: ");
    debug(fbdo.errorReason());
    debugln();
  }
}

String readCloudString(String var_name) 
{
  if (Firebase.RTDB.getString(&fbdo, var_name)) 
  {  
    String returned_value = fbdo.stringData();

    return returned_value;
  } 
  
  else 
  {
    debug("FAILED REASON: ");
    debug(fbdo.errorReason());
    debugln();

    return "FAIL";
  }
}

// --------------------

void setup() 
{
  debugln("SETUP");
  Serial.begin(9600);

  // --------------------

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  debug("conetando ao wifi");

  while (WiFi.status() != WL_CONNECTED)
  {
    debugln("ainda conectando"); 
    delay(300);
  }

  debugln();
  debug("Conectado ao ip: ");
  debugln(WiFi.localIP());
  debugln();
  
  // --------------------

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if(Firebase.signUp(&config, &auth, "", "")){
    debugln("signUp OK");
    signupOK = true;
  }

  else 
  { 
    debugln(config.signer.signupError.message.c_str());
  }
  
  config.token_status_callback = tokenStatusCallback;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // --------------------
  
  debugln("Initializing pulse oximeter..");

  if (!pox.begin()) {
    debugln("pulse oximeter FAILED");
    for(;;);
  } else {
    debugln("pulse oximeter SUCCESS");
  }

  // Configure sensor to use 6MA for LED drive
  pox.setIRLedCurrent(MAX30100_LED_CURR_30_6MA);

  // Register a callback routine
  pox.setOnBeatDetectedCallback(onBeatDetected);

  // --------------------
  
  mpu6050.begin();
  mpu6050.calcGyroOffsets(true);

  // --------------------
  
  bmp.begin();
}

void loop() {
  // Read temperature (°C)
  float temperature = bmp.readTemperature();
  
  // Read pressure (Pa)
  float pressure = bmp.readPressure();
  
  // Read altitude (approximation, based on sea level pressure)
  float altitude = bmp.readAltitude(101325); // Standard pressure at sea level
  
  // --------------------

  mpu6050.update();
  pox.update();

  // --------------------

  float accX = mpu6050.getAccX();
  float accY = mpu6050.getAccY();
  float accZ = mpu6050.getAccZ();

  if (sqrt(sq(accX) + sq(accY) + sq(accZ)) > 24) {
    SPCflag = true;
  }

  // --------------------

  if (millis() - sendDataPrevMillis > 1000 || sendDataPrevMillis == 0) {
    if (Firebase.ready() && signupOK) {
      sendDataPrevMillis = millis();
	  
	  float heartRate = pox.getHeartRate();
      float oxigenRate = pox.getSpO2(); 

      writeCloudDouble("/Dados_vitais/altitude", altitude);
      writeCloudDouble("/Dados_vitais/bpm", heartRate);
      writeCloudDouble("/Dados_vitais/oxigenacao", oxigenRate);
      writeCloudDouble("/Dados_vitais/pressao_atmosferica", pressure);

      writeCloudBool("/Flags/socorro", false);
      writeCloudBool("/Flags/spc", SPCflag);
    }
  }
}