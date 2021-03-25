import Color from "https://colorjs.io/color.js";
self.Color = Color; // for debugging

let rgbspace = "sRGB"; // get from form
let hue = 264.0585; // blue
// let hue = 109.7874 // yellow
// let hue = 29.2271; // red

let slice = [];
let boundary = [];
let edge;
let max_chroma = 0;

// scale factors - lightness 100, chroma 400
let lightness, chroma;
let fill = "red";
console.time();
let lstep = .005;
let cstep = .001;

let blue = new Color("blue");

function inRGBGamut(color) {
    // Ignore negative numbers
    let ε_low = .1;
    let ε_high = .0075;
    return color.coords.every(c => c < 1 + ε_high && c > 0 - ε_low);
}

for (lightness = 0; lightness <= 1; lightness += lstep) {
    edge = undefined;

    for (chroma = 0; chroma <= 0.35; chroma += cstep) {
        let swatch = new Color("oklch", [lightness, chroma, hue]);
        let rgb = swatch.to("sRGB");
        // console.log({swatch, rgb});
        let deltaE = blue.deltaE(swatch, "2000");
        let inGamut = inRGBGamut(rgb);

        if (inGamut) {
            fill = rgb.toGamut({method: "clip"}).toString();  // .to("srgb");
        }
        else  {
            fill = "#777";
            if (edge === undefined) {
                edge = chroma;

                if (chroma > max_chroma) {
                    max_chroma = chroma;
                }
            }
        }

        let rect = `<rect
            x='${400 * chroma  - 1.1 * cstep / 2}'
            y='${-lightness * 100 - 1.1 * lstep / 2}'
            width='${1.1 * cstep * 400}'
            height='${1.1 * lstep * 100}'
            fill='${fill}'
            data-oklch='${swatch.coords}'
            data-srgb='${swatch.srgb}'
            data-deltaE='${deltaE}'
            ${deltaE < 2? `stroke="red" stroke-width=".1"` : ""}
        />`;

        slice.push(rect);
    };
    boundary.push(`${edge * 400}, ${-lightness * 100} `);
};
console.timeEnd();

let l_axis = [];

for (lightness = 0; lightness <= 1; lightness+=0.25) {
    l_axis.push(`<text x='-2' y='${-lightness * 100 + 1}'>${lightness.toFixed(2)}</text>`);
}

let c_axis = [];

for (chroma = 0; chroma <= 0.35; chroma+=.05) {
    c_axis.push(`<text x='${chroma * 400}' y='5'>${chroma.toFixed(2)}</text>`);
}

let markup = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-14 -108 158 115'>
<rect x='0' y='-100' width='140' height='100' fill='none' stroke='white'
stroke-width='2'/>
<g stroke='none'>
${slice.join('\n')}
</g>
<polyline fill='none' stroke='#AAA' stroke-width='0.3' points='${max_chroma * 400}, 0.5, ${max_chroma * 400}, -100.5' />
<polyline fill='none' stroke='white' stroke-width='0.7' stroke-linecap='round' xpoints='-0.5,0 ${boundary.join('\n')} -0.5,-100' />
<g font-family='Helvetica Neue, Helvetica, sans-serif' fill='white'>
<g font-size='3' text-anchor='end'>
${l_axis.join('\n')}
</g>
<g font-size='3' text-anchor='middle'>
${c_axis.join('\n')}
</g>
<g font-size='6' text-anchor='end'>
 <text x='134' y='-90'>Hue: ${hue}°</text>
 <text x='134' y='-14'>OK LCH</text>
 <text x='134' y='-5'>Gamut: ${rgbspace}</text>
</g>
<text x='${max_chroma * 400}' y='-102' text-anchor='middle' font-size='4'>${max_chroma.toFixed(3)}</text>
</g>
</svg>`;

textarea.value = markup;
let blob = new Blob([markup], {type : "image/svg+xml"});
downloadLink.href = output.data = URL.createObjectURL(blob);
downloadLink.download = `slice-${hue}.svg`;

// window.markup = markup;
