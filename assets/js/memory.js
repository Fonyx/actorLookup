// name used by save and load functions to refer to the file object
storageName = 'searchListObjects'

// function that gets the most recent search
function getMostRecentSearchObject(){
    if(searchObjectHistory){
        return searchObjectHistory[0];
    }else{
        return null
    }
}

// function that loads all search Objects from local storage and returns them in a list
// - if local storage is empty returns special null - not string
function loadSearchObjects(){
    let PastStorage = JSON.parse(localStorage.getItem(storageName));
    if (PastStorage){
        console.log('Found results in local storage')
        return PastStorage;
    } else {
        console.log('No results in local storage at the moment, returning null')
        return null;
    }
}

// used to completely remove local storage elements
function resetMemory(){
    localStorage.clear();
    console.log('Memory reset');
    resetDomLogResultText();
    console.log('reset the dom log results div text');
}

// accepts a searchObject and appends it to locally stored results, if empty, creates a storage list
function saveSearchObject(newSearchObject){
    // load the current list in storage of searchObjects
    let storage = JSON.parse(localStorage.getItem(storageName));
    // if it finds there are results already, add the result to the end
    if(storage){
        console.log('Found search objects in storage, appended element onto list');
        storage.push(newSearchObject);
    } else {
        // creates an empty string and puts the searchObject into the list for saving
        console.log('Created new local storage list and appended result')
        storage = [newSearchObject, ];
    }
    // turn storage element into a string for storage
    let stringStorage = JSON.stringify(storage);
    // save to local storage
    localStorage.setItem(storageName, stringStorage);
}

function testMemoryFunctions(){
    let testSearchObject = 'This is a test';
    let test2SearchObject = 'This is a second test string';

    // reset test
    resetMemory();
    console.log('\tShould have printed out: Memory reset')
    
    // empty state test
    saveSearchObject(testSearchObject);
    console.log('\tShould have printed out: Created new local storage list and appended result');

    // adding to state test
    saveSearchObject(test2SearchObject);
    console.log('\tShould have printed out: Found search objects in storage, appended element onto list');

    // checking load test
    let recoveredResult = loadSearchObjects();
    console.log('\tShould have printed out: Found results in local storage');

    // final reset and load test
    resetMemory();
    console.log('\tShould have printed out: Memory reset');
    // should return nothing
    let emptySet = loadSearchObjects();
    console.log('\tShould have printed out: No results in local storage at the moment, returning null')
}