// global pallet combinations, primary-secondary-tertiary etc limited to 5
pallettes = [
    ['#FF7F60', '#FFB26D', '#FDD272', '#3EB2A2', '#385663'],
    ['#8DA4CF', '#9EA9CE', '#B7B3CC', '#E2C3CC', '#F8CACC'],
    ['#F22738', '#A63247','#3E3740','#F2DDD0','#F2F2F2'],
    ['#2E4159', '#51718C','#698FB6','#91B7D9','#E4E4E4'],
    // nicks additions
    ['#330136','#5E1742','#962E40','#C9463D','#FF5E35'],
    ['#EFEDEF','#ACB1B6','#787A76','#04060A','#95050C'],
    ['#D9D9D9','#260B01','#A68F7B','#594B3F','#D9A566'],
]

currentPallette = randomPallette();
ChangeColorPallette();

// makes a jquery element with class and Id
function makeNewJqueryElement(elementType, classString, idString, textString, dataValue){
    let newElement = $('<'+elementType+'>');
    if(classString){
        newElement.addClass(classString);
    }
    if(idString){
        newElement.attr('id', idString);
    }
    if(textString){
      newElement.text(textString);
    }
    if(dataValue){
        newElement.attr('data-'+dataValue.name, dataValue.value);
    }
    return newElement;
}

// change colors in :root dom element
function ChangeColorPallette(){
    currentPallette = randomPallette();
    updateColorPallette();
}

function getRandomOrderFromArray(arrayLength){
    let tempArray = [];
    for(let i =0; i < arrayLength; i ++){
        // generate a number between 0 and arraylength
        let random = getRandomIntFromRange(0, arrayLength-1);

        // append item if first pass
        if(i > 0){
            // if item is already in array, don't push it and move I back 1 space
            if(tempArray.includes(random)){
                i -= 1;
            } else {
                tempArray.push(random);
            }
        } else {
            tempArray.push(random);
        }
    }
    console.log(tempArray);
    return tempArray;
}

function shufflePalletteArrangement(){
    console.log('shuffling palette');
    // get the style variables in root
    let r = document.querySelector(':root');
    let rs = getComputedStyle(r);
    let randomOrder = getRandomOrderFromArray(5);

    for (let i = 0; i < 5; i++){
        if(i===0){
            r.style.setProperty('--primary', currentPallette[randomOrder[i]]);
        } else if (i === 1){
            r.style.setProperty('--secondary', currentPallette[randomOrder[i]]);
        } else if (i === 2){
            r.style.setProperty('--tertiary', currentPallette[randomOrder[i]]);
        } else if (i === 3){
            r.style.setProperty('--quaternary', currentPallette[randomOrder[i]]);
        } else if (i === 4){
            r.style.setProperty('--quinary', currentPallette[randomOrder[i]]);
        }
    }
    console.log(`Primary Color: ${rs.getPropertyValue('--primary')}`);
    console.log(`Secondary Color: ${rs.getPropertyValue('--secondary')}`);
    console.log(`Tertiary Color: ${rs.getPropertyValue('--tertiary')}`);
    console.log(`Quaternary Color: ${rs.getPropertyValue('--quaternary')}`);
    console.log(`Quinary Color: ${rs.getPropertyValue('--quinary')}`);

}

function updateColorPallette(){
    // get the style variables in root
    let r = document.querySelector(':root');
    let rs = getComputedStyle(r);
    // set all the properties to the new index
    currentPallette = randomPallette();
    r.style.setProperty('--primary', currentPallette[0]);
    r.style.setProperty('--secondary', currentPallette[1]);
    r.style.setProperty('--tertiary', currentPallette[2]);
    r.style.setProperty('--quaternary', currentPallette[3]);
    r.style.setProperty('--quinary', currentPallette[4]);
    
    console.log(`Primary Color: ${rs.getPropertyValue('--primary')}`);
    console.log(`Secondary Color: ${rs.getPropertyValue('--secondary')}`);
    console.log(`Tertiary Color: ${rs.getPropertyValue('--tertiary')}`);
    console.log(`Quaternary Color: ${rs.getPropertyValue('--quaternary')}`);
    console.log(`Quinary Color: ${rs.getPropertyValue('--quinary')}`);
}

// generate a random integer inside a range
function getRandomIntFromRange(min, max){
    let result = Math.floor(Math.random()*(max-min+1)+min);
    return result
};

// get a random color pallette
function randomPallette(){
    let palletteCount = pallettes.length
    let randomPallette = pallettes[getRandomIntFromRange(0, palletteCount-1)];
    return randomPallette;
}

// get the change color button as element
let changeP = $('#change_pallete_button');

// add event listener to color change button
changeP.on('click', ChangeColorPallette);

// get the shuffle pallette button as element
let shuffleP = $('#shuffle_pallette_button');

// add event listener to color change button
shuffleP.on('click', shufflePalletteArrangement);

// || SCREEN SIZE MODE CHANGER
window.addEventListener('resize', logPixelSizeAndMaterializePrefix);

function logPixelSizeAndMaterializePrefix(){
    let currentWidth = window.innerWidth;

    // console.log(`New Width: ${currentWidth}`);

    if(currentWidth <= 600){
        // console.log(`width: ${currentWidth} Materialize prefix: s`);
        console.log(' Materialize prefix: s')
    } else if (currentWidth > 600 && currentWidth <= 992){
        // console.log(`width: ${currentWidth} Materialize prefix: m`)
        console.log(' Materialize prefix: m')
    } else if (currentWidth > 992 && currentWidth <= 1200){
        // console.log(`width: ${currentWidth} Materialize prefix: l`)
        console.log(' Materialize prefix: l')
    } else {
        // console.log(`width: ${currentWidth} Materialize prefix: xl`)
        console.log(' Materialize prefix: xl')
    }

}
