let primaries =    ['#FF7F60','#8DA4CF','#F22738','#2E4159','#D93662','#385663','#87878C','#4850E8','#0388A6','#0C2CFA','#F2F2F2'];
let secondaries =  ['#FFB26D','#9EA9CE','#A63247','#51718C','#3A3873','#F8CACC','#01070D','#724BF2','#63D8F2','#0B5FDE','#F2B705'];
let tertiaries =   ['#FDD272','#B7B3CC','#3E3740','#698FB6','#04BFAD','#F2F2F2','#0A1926','#954FDB','#F29F05','#00A3F5','#0477BF'];
let quaternaries = ['#3EB2A2','#E2C3CC','#F2DDD0','#91B7D9','#F2AF5C','#E4E4E4','#384D59','#CB4BF2','#F28705','#0BD0DE','#BF04A0'];
let quinaries =    ['#385663','#F8CACC','#F2F2F2','#E4E4E4','#F2695C','#F2695C','#A9C6D9','#E848DB','#F27405','#0CFACA','#F2059F'];

// random color generator
function getRandomColorIndex(){
    let max = primaries.length;
    return Math.floor(Math.random()*max+1);
}

// change colors in :root dom element
function ChangeColor(){
    // get the style variables in root
    let r = document.querySelector(':root');
    // get the computed style of that element
    let rs = getComputedStyle(r);
    // get the index in the primaries array from the current style value
    let currentIndex = getCurrentPrimaryScheme(rs.getPropertyValue('--primary'));
    // increment
    let newIndex = currentIndex + 1;

    // make sure no overload
    if (newIndex === primaries.length){
        newIndex=0;
    }

    // set all the properties to the new index
    r.style.setProperty('--primary', primaries[newIndex]);
    r.style.setProperty('--secondary', secondaries[newIndex]);
    r.style.setProperty('--tertiary', tertiaries[newIndex]);
    r.style.setProperty('--quaternary', quaternaries[newIndex]);
    r.style.setProperty('--quinary', quinaries[newIndex]);

    console.log(r.style);
}

// get current primary value index from color schemes - figure out where the current scheme is in the arrays
function getCurrentPrimaryScheme(colorCode) {
    return primaries.findIndex(x => x === colorCode);
}

// get the change color button as element
let changeC = $('#color_change_button');

// add event listener to color change button
changeC.on('click', ChangeColor);