#include <SPI.h>
#include <WiFi101.h>
#include "SparkFun_ProDriver_TC78H670FTG_Arduino_Library.h" //Click here to get the library: http://librarymanager/All#SparkFun_ProDriver
#include "arduino_secrets.h" 
#define OPENLIMIT 11
#define CLOSELIMIT 10

PRODRIVER myProDriver; //Create instance of this object

char ssid[] = SECRET_SSID;    // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
int keyIndex = 0;             // your network key Index number (needed only for WEP)
int status = WL_IDLE_STATUS;
WiFiServer server(9109);

void setup() {
  pinMode(OPENLIMIT, INPUT_PULLUP);
  pinMode(CLOSELIMIT, INPUT_PULLUP);
  Serial.begin(9600);      // initialize serial communication
  pinMode(9, OUTPUT);      // set the LED pin mode
  WiFi.setPins(8,7,4,2);
  
  myProDriver.settings.controlMode = PRODRIVER_MODE_SERIAL; // non-default mode must be set here
  myProDriver.setTorque(PRODRIVER_TRQ_100);
  myProDriver.sendSerialCommand();
  myProDriver.begin(); // adjus
  
  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    while (true);       // don't continue
  }

  // attempt to connect to WiFi network:
  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);                   // print the network name (SSID);

    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);
    // wait 10 seconds for connection:
    delay(10000);
  }
  server.begin();                           // start the web server on port 80
  printWiFiStatus();                        // you're connected now, so print out the status
}


void loop() {

  WiFiClient client = server.available();   // listen for incoming clients
  //uint8_t i=digitalRead(SWITCH1)
  if (client) {                             // if you get a client,
    Serial.println("new client");           // print a message out the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor
        if (c == '\n') {                    // if the byte is a newline character

          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
              Serial.println("end of request, so responding now");
              client.println("HTTP/1.1 200 OK");
              client.println("Content-type:application/json");// GET /L turns the LED off
              client.println();
              client.println("{\"success\":true}");
              client.println();
            break;
          }
          else {      // if you got a newline, then clear currentLine:
            currentLine = "";
          }
        }
        else if (c != '\r') {    // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }

        // Check to see if the client request was "GET /H" or "GET /L":
              if (currentLine.endsWith("GET /O")) {
                Serial.println("calling open!");
                open();               // GET /O opens the drawer
              }
              if (currentLine.endsWith("GET /C")) {
                Serial.println("calling close!");
                close();     // GET /C closes the drawer
               
              }
      }
    }
    // close the connection:
    client.stop();
    Serial.println("client disonnected");
  }
}

void open(){
  Serial.println("opening!");
  Serial.println(digitalRead(OPENLIMIT));
  while (digitalRead(OPENLIMIT) != 1){ 
      myProDriver.stepSerial(50, 0);
  }
}

void close(){
  Serial.println("closing!");
  Serial.println(digitalRead(CLOSELIMIT));
  while (digitalRead(CLOSELIMIT) != 1){ 
      myProDriver.stepSerial(50, 1);
  }
  Serial.println("closed!"); 
}

void printWiFiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
  // print where to go in a browser:
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
}
