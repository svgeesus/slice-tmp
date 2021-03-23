import Color from "https://colorjs.io/color.js";

let rgbspace = "sRGB"; // get from form
let hue = 90; // get from form

let slice = [];
let boundary = [];
let edge;
let max_chroma = 0;


let lightness, chroma;
let fill;

for (lightness = 0; lightness <=100; lightness+=0.5) {
    edge = undefined;

    for (chroma = 0; chroma <= 140; chroma+=0.5) {
        let swatch = new Color("lch", [lightness, chroma, hue]);
        let rgb = swatch.to(rgbspace);
        // console.log({swatch, rgb});
        if (rgb.inGamut("srgb")) {
            fill = rgb.to("srgb").toString();
            // console.log({fill});
        }
        else  {
            fill = "#777";
            if (edge === undefined) {
                edge = chroma;
                if (chroma > max_chroma) {
                    max_chroma = chroma;
                }
                console.log({lightness, edge});
            }
        };
        slice.push(`<rect x='${chroma - 0.25}' y='${-lightness - 0.25}' width='0.55' height='0.55' fill='${fill}' />`);
        // console.log ({slice});
    };
    boundary.push(`${edge}, ${-lightness} `);
};

let l_axis = [];

for (lightness = 0; lightness <=100; lightness+=25) {
    l_axis.push(`<text x='-2' y='${-lightness}'>${lightness}</text>`);
}

let markup = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -104 148 108'>
<rect x='0' y='-100' width='140' height='100' fill='none' stroke='white'
stroke-width='2' font-family='Helvetica Neue, Helvetica, sans-serif'/>
<g stroke='none'>
${slice.join('\n')}
</g>
<polyline fill='none' stroke='#CCC' stroke-width='0.3' points='${max_chroma}, 0.5, ${max_chroma}, -100.5' />
<polyline fill='none' stroke='white' stroke-width='0.5' stroke-linecap='round' points='0,0 ${boundary.join('\n')} 0,-100' />
<g font-size="3" text-anchor='end'>

</g>
</svg>`;

textarea.value = markup;
output.data = `data:image/svg+xml,${encodeURIComponent(markup)}`;

window.markup = markup;
