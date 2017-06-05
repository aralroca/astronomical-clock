import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Variables
const constelations = [
  { name: 'Piscis', angle: 38 },
  { name: 'Aries', angle: 62 },
  { name: 'Tauro', angle: 98 },
  { name: 'Geminis', angle: 126 },
  { name: 'Cancer', angle: 147 },
  { name: 'Leo', angle: 182 },
  { name: 'Virgo', angle: 228 },
  { name: 'Libra', angle: 246 },
  { name: 'Escorpio', angle: 277 },
  { name: 'Sagitario', angle: 307 },
  { name: 'Capricornio', angle: 335 },
  { name: 'Acuario', angle: 360 }
];

// Helpers
const daysToMilliseconds = days => days * 24 * 60 * 60 * 1000;
const calculateAngle = (period, initialAngle, referenceDate) => (date) => (initialAngle + (((360 / period) * Math.abs(date - referenceDate)))) % 360;

// Getters
const getSunAngleByDate = calculateAngle(daysToMilliseconds(365.26), 38, new Date('2017-04-19T00:00:00.752Z'));
const getMoonAngleByDate = calculateAngle(daysToMilliseconds(27.321597222), 147, new Date('2017-05-03T11:00:00.752Z'));
const getLunationAngleByDate = calculateAngle(daysToMilliseconds(29.53059028), 0, new Date('2017-01-28T01:07:00.752Z'));
const getLunationPerCent = angle => angle <= 180 ? ((angle * 100) / 180) : (100 - (((angle - 180) * 100) / 180))
const getConstelationByAngle = angle => constelations.filter(c => c.angle >= angle)[0];
const getFase = angle => {
  if (angle < 3.6) return 'Luna nueva';
  if (angle < 61.2) return 'Creciente cóncava';
  if (angle < 117) return 'Cuarto creciente';
  if (angle < 172) return 'Creciente convexa';
  if (angle < 180) return 'Luna llena';
  if (angle < 241.2) return 'Menguante convexa';
  if (angle < 297) return 'Cuarto menguante';
  if (angle < 354.6) return 'Menguante cóncava';
  if (angle < 360) return 'Luna nueva';
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  sunAngle: number;
  moonAngle: number;
  lunationAngle: number;
  sunConstelation: string;
  moonConstelation: string;
  screenSize: number;
  fase: string;
  lunationPerCent: number;
  timeStart;

  realTime() {
    this.timeStart = undefined;
  }

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    setInterval(() => {
      let date;
      if (!this.timeStart) {
        date = new Date();
      } else {
        date = new Date(this.timeStart)
      }
      this.sunAngle = getSunAngleByDate(date);
      this.moonAngle = getMoonAngleByDate(date);
      this.lunationAngle = getLunationAngleByDate(date);
      this.lunationPerCent = getLunationPerCent(this.lunationAngle);
      this.sunConstelation = getConstelationByAngle(this.sunAngle).name;
      this.moonConstelation = getConstelationByAngle(this.moonAngle).name;
      this.fase = getFase(this.lunationAngle);
    }, 1000);
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
