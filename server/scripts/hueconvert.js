const { timingSafeEqual } = require('crypto');
const fs = require('fs');




function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {r:0,g:0,b:0};
  }

  function EnhanceColor(normalized) {
    if (normalized > 0.04045) {
        return Math.pow( (normalized + 0.055) / (1.0 + 0.055), 2.4);
    }
    else { return normalized / 12.92; }      
  }

  function RGBtoXY(r, g, b) {
    let rNorm = r / 255.0;
    let gNorm = g / 255.0;
    let bNorm = b / 255.0;

    let rFinal = EnhanceColor(rNorm);
    let gFinal = EnhanceColor(gNorm);
    let bFinal = EnhanceColor(bNorm);

    let X = rFinal * 0.649926 + gFinal * 0.103455 + bFinal * 0.197109;
    let Y = rFinal * 0.234327 + gFinal * 0.743075 + bFinal * 0.022598;
    let Z = rFinal * 0.000000 + gFinal * 0.053077 + bFinal * 1.035763;

    if ( X + Y + Z === 0) {
        return [0,0];
    } else {
        let xFinal = X / (X + Y + Z);
        let yFinal = Y / (X + Y + Z);
    
        return [xFinal, yFinal];
    }
  }
  
const lines = fs.readFileSync('timings.csv', 'utf-8').split("\n");

const scripts = {};
const LABEL = 'episode1_timings';

lines.forEach((line,i)=>{
   const hex = line.split(",")[4];
   const {r,g,b} = hexToRgb(hex);
   const [x,y] = RGBtoXY(r,g,b);

   let obj = {
    "on": true,
    "effect": "none",
    "xy": [
       x,
       y,
    ]
    }
    scripts[`${LABEL}-${i+1}`] = obj;
});