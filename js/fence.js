let options;
let currentPos;
let currentPoint;
let currentDistance;
let pointCount = 0;
let searchRadius = 0.02;
let hasStarted = false;
let wakeLock = null;
let wakeLockSupported = false;
let changeCount = 0;
let playCount = 0;

//Position Array 
//mit Positions Name / Latitude, Longitude / Video, Bild Link
const posArray =   
[
  {
    name: ['Reihe1'],
    coord: "0,0"
  },
  {
    name: ['01_Die_Ortsansaessigen','02_Steinbruch_Ort'],
    coord: "48.214148,15.632561"
  },
  {
    name: ['07_Die_Einfahrt'],
    coord: "48.214284,15.632033"
  },
  {
    name: ['03_Verladestation','04_Das_Lager'],
    coord: "48.214132,15.631491"
  },
  {
    name: ['05_Die_Ortschaften','06_Die_Kirche'],
    coord: "48.213796,15.631206"
  },
  {
    name: ['Reihe2'],
    coord: "0,0"
  },
  {
    name: ['24_Das_Lager_im_Westen'],
    coord: "48.213412,15.631252"
  },
  {
    name: ['08_Die_Wirtschaft','13_Das_Ziegelwerk'],
    coord: "48.213058,15.631027"
  },
  {
    name: ['15_Das_Steinbrecherhaus_Betrieb'],
    coord: "48.687434,15.853374"
  },
  {
    name: ['33_Der_Landschaftsgarten','34_Die_Passionsspiele'],
    coord: "48.687487,15.853916"
  },
  {
    name: ['31_Der_Badeunfall'],
    coord: "48.687339,15.854404"
  },
  {
    name: ['Reihe3'],
    coord: "0,0"
  },
  {
    name: ['32_Die_Austrocknung_des_Teichs','11_Der_Baron'],
    coord: "48.687012,15.854614"
  },
  {
    name: ['17_Das_NS-Arbeitsbuch_des_Steinbrucharbeiters','19_Die_Zwangsarbeit'],
    coord: "48.686785,15.855027"
  },
  {
    name: ['22_Der_Kellerausbau','23_Der_Aufseher'],
    coord: "48.686426,15.855102"
  },
  {
    name: ['07_Die_Einfahrt','09_Die_Kollegen'],
    coord: "48.686072,15.855005"
  },
  {
    name: ['27_Denunziert_und_deportiert','28_Die_Schotterwerbung'],
    coord: "48.685856,15.854571"
  },
  {
    name: ['Reihe4'],
    coord: "0,0"
  },
  {
    name: ['29_Der_Badeteich','30_Der_Badeteich_und_das_Steinbrecherhaus'],
    coord: "48.687120,15.853970"
  },
  {
    name: ['16_Das_Steinbrecherhaus_Stilllegung'],
    coord: "48.687077,15.853421"
  },
  {
    name: ['35_Die_Wehrsportuebungen'],
    coord: "48.686724,15.853362 "
  },
  {
    name: ['14_Das_Waechterhaus','12_Die_Betriebsbaracke'],
    coord: "48.686369,15.853397"
  },
  {
    name: ['18_Der_Gefolgschaftsraum','20_Der_Betriebsfuehrer'],
    coord: "48.686014,15.853445"
  },
  {
    name: ['21_Der_Nahrungsmangel','25_Vor_der_Befreiung'],
    coord: "48.685660,15.853467"
  },
  {
    name: ['26_Tag_der_Befreiung','36_Rechtsradikale_Umtriebe'],
    coord: "48.685348,15.853703"
  }
]

navigator.geolocation.watchPosition(succesCallback, errorCallback, options);

//Get the current position
function succesCallback(pos)
{

  currentPos = pos.coords;
  UpdateHtmlText();
  if(hasStarted)
  {
    console.log("Successs");
    SearchTriggerPos();
  }
}

//Called if an error appears
function errorCallback(error)
{
  console.log(error);
}

options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

function SearchTriggerPos()
{
  changeCount++;
  let currentPointTemp;

  //Geht durch das posArray
  for (let index = 0; index < posArray.length; index++) {
    const element = posArray[index];
    const posSplit = element.coord.split(',');
    //Berechnet die Distanz von der aktuellen Position zum Array Punkt
    distance = calculateDistance(currentPos.latitude, currentPos.longitude,parseFloat(posSplit[0]), parseFloat(posSplit[1]));
    
    if(distance <= searchRadius && element.name[0] != currentPoint)
    {
      console.log(currentPoint + " / " + element.name);
      currentPointTemp = element;
      pointCount++;
      console.log(currentPos);
      console.log(currentPointTemp);
    }
  }

  if(pointCount < 2 && pointCount != 0 && audio.paused)
  {
    currentPoint = currentPointTemp.name[0];
    const currentPosSplit = currentPointTemp.coord.split(',');
    currentDistance = calculateDistance(currentPos.latitude, currentPos.longitude,parseFloat(currentPosSplit[0]), parseFloat(currentPosSplit[1]));

    console.log(currentPointTemp.name.length);
    if(currentPointTemp.name.length < 2)
    {
      console.log("One");
      $.getScript("player.js",loadPosition(currentPointTemp.name[0]));
    } else
    {
      console.log("Multi");
      $.getScript("player.js",loadPosition(currentPointTemp.name[0]));
      
      audio.onended = function() {
        console.log("Eeeeend");
        if(playCount < currentPointTemp.name.length-1)
        {
          playCount++;
          $.getScript("player.js",loadPosition(currentPointTemp.name[playCount]));
        } else
        {
          playCount = 0;
          audio.onended = null;
        }
      };
    }
    document.getElementById("pointCountText").innerHTML = "Point Count: " + pointCount + "Change Count: " + changeCount;
  }
  else
  {
    document.getElementById("pointCountText").innerHTML = "Point Count: " + pointCount + "Change Count: " + changeCount;
  }

  pointCount = 0;
}

//Aktualisiert den Html Text
function UpdateHtmlText(){
      $("#currentLat").text(currentPos.latitude);
      $("#currentLon").text(currentPos.longitude);
      $("#accuracyText").text(currentPos.accuracy);
      $("#distance").text(currentDistance);
}

// Reused code - copyright Moveable Type Scripts - retrieved May 4, 2010.
// http://www.movable-type.co.uk/scripts/latlong.html
// Under Creative Commons License http://creativecommons.org/licenses/by/3.0/
function calculateDistance(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = (lat2-lat1).toRad();
  var dLon = (lon2-lon1).toRad();
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

Number.prototype.toRad = function()
{
  return this * Math.PI / 180;
}

function ToggleDebug() {
  var x = document.getElementById("debug");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

if('wakeLock' in navigator)
{
  wakeLockSupported = true;
  document.getElementById("wakeText").innerHTML = wakeLockSupported;
}
else
{
  wakeLockSupported = false;
}

async function acquireLock(){
  wakeLock = await navigator.wakeLock.request("screen");
}

function releaseLock(){

}

function isPlaying(audelem) {
  return!audelem.paused;
}



