// global pallet combinations, primary-secondary-tertiary etc limited to 5
pallettes = [
    ['#FF7F60', '#FFB26D', '#FDD272', '#3EB2A2', '#385663'],
    ['#8DA4CF', '#9EA9CE', '#B7B3CC', '#E2C3CC', '#F8CACC'],
    ['#F22738', '#A63247','#3E3740','#F2DDD0','#F2F2F2'],
    ['#2E4159', '#51718C','#698FB6','#91B7D9','#E4E4E4'],
]

// change colors in :root dom element
function ChangeColor(){
    // get the style variables in root
    let r = document.querySelector(':root');
    let pallette = randomPallette();
    // set all the properties to the new index
    r.style.setProperty('--primary', pallette[0]);
    r.style.setProperty('--secondary', pallette[1]);
    r.style.setProperty('--tertiary', pallette[2]);
    r.style.setProperty('--quaternary', pallette[3]);
    r.style.setProperty('--quinary', pallette[4]);
}

// generate a random integer inside a range
function getRandomIntFromRange(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
};

// get a random color pallette
function randomPallette(){
    let randomPallette = pallettes[getRandomIntFromRange(0, 4)];
    return randomPallette;
}

// get the change color button as element
let changeC = $('#color_change_button');

// add event listener to color change button
changeC.on('click', ChangeColor);