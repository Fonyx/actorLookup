// name used by save and load functions to refer to the file object
storageName = 'searchListObjects'

// testMemoryFunctions();

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
        console.log('Found results in local storage');
        // update the global list
        searchObjectHistory = PastStorage;
        // set the global current choice to the most recent one in the list
        updateCurrentSearchIndexAndObj(PastStorage.length-1);
        return PastStorage;
    } else {
        console.log('No results in local storage at the moment, returning null');
        // set the global current choice to 0, it was initialized to -1 for clarity
        updateCurrentSearchIndexAndObj(0)
        // reset the global search object list
        searchObjectHistory = [];
        return null;
    }
}

// used to completely remove local storage elements
function resetMemory(){
    localStorage.clear();
    console.log('Memory reset');
    updateCurrentSearchIndexAndObj(0);
    // reset the global search object list
    searchObjectHistory = [];
}

// accepts a searchObject and appends it to locally stored results, if empty, creates a storage list
function saveSearchObject(newSearchObject){
    // append the search object to the global list
    searchObjectHistory.push(newSearchObject);

    // set the global current choice to the most recent one in the list
    updateCurrentSearchIndexAndObj(searchObjectHistory.length-1);

    // turn storage element into a string for storage
    let stringStorage = JSON.stringify(searchObjectHistory);
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
    storedObjectCount = saveSearchObject(testSearchObject);
    console.log('\tShould have printed out: Created new local storage list and appended result');

    // adding to state test
    storedObjectCount = saveSearchObject(test2SearchObject);
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