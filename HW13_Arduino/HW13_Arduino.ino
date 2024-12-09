int potVal = 0;      
int soundSensorVal = 0; 

void setup() {
  pinMode(A0, INPUT); 
  pinMode(A1, INPUT); 
  Serial.begin(9600);
}

void loop() {
  potVal = analogRead(A0);      
  soundSensorVal = analogRead(A1); 

  Serial.print("A0:");
  Serial.print(potVal);
  Serial.print(",A1:");
  Serial.println(soundSensorVal);

  delay(50);
}
