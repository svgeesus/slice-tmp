import Color from "https://colorjs.io/color.js";

let rgbspace = "sRGB"; // get from form
let hue = 301.37; // get from form

let slice = [];
let boundary = [];
let edge;
let max_chroma = 0;


let lightness, chroma;
let fill = "red";
console.time();
let step = .5;

for (lightness = 0; lightness <= 100; lightness += step) {
    edge = undefined;

    for (chroma = 0; chroma <= 140; chroma += step) {
        let swatch = new Color("lch", [lightness, chroma, hue]);
        let rgb = swatch.to("sRGB");
        // console.log({swatch, rgb});
        if (rgb.inGamut("srgb")) {
            fill = rgb.toString();  // .to("srgb");
        }
        else  {
            fill = "#777";
            if (edge === undefined) {
                edge = chroma;

                if (chroma > max_chroma) {
                    max_chroma = chroma;
                }
            }
        };
        slice.push(`<rect x='${chroma - 1.1 * step / 2}' y='${-lightness - 1.1 * step / 2}' width='${1.1 * step}' height='${1.1 * step}' fill='${fill}' />`);
    };
    boundary.push(`${edge}, ${-lightness} `);
};
console.timeEnd();

let l_axis = [];

for (lightness = 0; lightness <= 100; lightness+=25) {
    l_axis.push(`<text x='-2' y='${-lightness + 1}'>${lightness}</text>`);
}

let c_axis = [];

for (chroma = 0; chroma <= 140; chroma+=25) {
    c_axis.push(`<text x='${chroma}' y='5'>${chroma}</text>`);
}

let markup = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-14 -108 158 115'>
<rect x='0' y='-100' width='140' height='100' fill='none' stroke='white'
stroke-width='2'/>
<g stroke='none'>
${slice.join('\n')}
</g>
<polyline fill='none' stroke='#AAA' stroke-width='0.3' points='${max_chroma}, 0.5, ${max_chroma}, -100.5' />
<polyline fill='none' stroke='white' stroke-width='0.7' stroke-linecap='round' points='-0.5,0 ${boundary.join('\n')} -0.5,-100' />
<g font-family='Helvetica Neue, Helvetica, sans-serif' fill='white'>
<g font-size='3' text-anchor='end'>
${l_axis.join('\n')}
</g>
<g font-size='3' text-anchor='middle'>
${c_axis.join('\n')}
</g>
<g font-size='6' text-anchor='end'>
 <text x='134' y='-90'>Hue: ${hue}??</text>
 <text x='134' y='-14'>CIE LCH</text>
 <text x='134' y='-5'>Gamut: ${rgbspace}</text>
</g>
<text x='${max_chroma}' y='-102' text-anchor='middle' font-size='4'>${max_chroma}</text>
</g>
</svg>`;

textarea.value = markup;
let blob = new Blob([markup], {type : "image/svg+xml"});
downloadLink.href = output.data = URL.createObjectURL(blob);
downloadLink.download = `slice-${hue}.svg`;

// window.markup = markup;
