// functions to save and load movie objects

storageName = 'searchListObjects'
fakeGlobalSearchObjects = [];
// testMemoryFunctions();

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
    console.log('Memory reset')
}

// class accepts
/*
actor_id            -str eg 'nm1234567'
actor_name          -str eg 'natalie portman'
actor_img           -str eg 'http://path_to_thing.png'
movie_object_list   -list of MovieObjects eg [MovieObject1, MovieObject2,]
*/
// constructor that builds SearchObjects
class ActorObject {
    constructor(actor_id, actor_name, actor_img, movie_object_list){
        this.actor_id = actor_id;
        this.actor_name = actor_name;
        this.actor_img = actor_img;
        this.movie_object_list = movie_object_list;
    }
}

// constructor that build Movie sub objects
// class accepts 
/* 
id              -number eg 1
title           -string eg 'v for vendetta'
released        -moment().format('y) object 
ratingsCount    -number
rating          -number
imageUrl        -string
genres          -list of strings eg ['action', 'comedy', 'drama']
plotOutline     -string
*/
class MovieObject {
    constructor(id, title, released, ratingsCount, rating, imageUrl, genres, plotOutline){
        this.id = id;
        this.title = title;
        this.released = released;
        this.ratingsCount = ratingsCount;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.genres = genres;
        this.plotOutline = plotOutline;
    }
}

