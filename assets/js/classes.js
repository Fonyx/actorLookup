// name used by save and load functions to refer to the file object
storageName = 'searchListObjects'

// function that gets the most recent search
function getMostRecentSearchObject(){
    let searchObjects = loadSearchObjects();
    if(searchObjects){
        return searchObjects[0];
    }else{
        return null
    }
}

//function that prints movie cards to log_results id
function renderMovieNameToLogResultsDiv(searchObject){
    // clear the dom text for div
    resetDomLogResultText();

    let logResultsDiv = $('#log_results'); 

    
    searchObject.movieObjectList.forEach((movieObj) => {

        console.log('Adding movie to dom: ',movieObj.title);

        //<div class="row" id="log_results">
            // collected above as logResultsDiv
            //<div class="col s6 l3">
            let newColEl = makeNewJqueryElement('div', 'col s6 l3')
                //<p class="pri_text_color">$element.title</p>
                let newEl = makeNewJqueryElement('p', 'pri_text_color', null, movieObj.title.title+" Rating: "+movieObj.ratings.rating);
            newColEl.append(newEl);
            //</div>
        logResultsDiv.append(newColEl)
        //</div>
    })
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

// function to reset any text we need to set to zero
function resetDomLogResultText(){
    let logResultsDiv = $('#log_results'); 
    // empty out the div to avoid overflow
    logResultsDiv.text("");
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

function testObjectBuild(){
    let movieObject1 = new movieObject('tt1234567', 
        'V for vendetta', 
        2009, 
        1300, 
        3.5, 
        'https://m.media-amazon.com/images/M/MV5BOTI5ODc3NzExNV5BMl5BanBnXkFtZTcwNzYxNzQzMw@@._V1_.jpg',
        ['drama', 'action'],
        'A guy blows up a building with a mask on')

    let movieObject2 = new movieObject('tt2345678', 
        'star wars episode 1', 
        2004, 
        3000, 
        3.1, 
        'https://static.wikia.nocookie.net/starwars/images/b/ba/Ep1_PC_front.jpg/revision/latest?cb=20170521222822',
        ['sci-fi', 'action'],
        'The jedi do stuff')
    

    let search = new actorObject('nm1234567', 
        'natalie portman',
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ-umCzL4zUJ6W1OCXyoYkbwHhkKLS9ks8YP3rh6y1W_iQtPOnh',
        [movieObject1, movieObject2]
        )

    console.log(search);
}

// class that builds searchObjects
// class accepts
/*
actorObj1           - actorObject
actorObj2           - actorObject
shared_movie_list   - list of movieObjects - after filter
*/
class searchObject{
    constructor(actor1, actor2, movieObjectList){
        this.actor1 = actor1;
        this.actor2 = actor2;
        this.movieObjectList = movieObjectList;
    }
}

// class accepts
/*
actor_id            -str eg 'nm1234567'
actor_name          -str eg 'natalie portman'
actor_img           -str eg 'http://path_to_thing.png'
movie_object_list   -list of MovieObjects eg [MovieObject1, MovieObject2,]
*/
// constructor that builds Actor Objects
class actorObject {
    constructor(id, name, imgUrl, movieNumberList){
        this.id = id;
        this.name = name;
        this.imgUrl = imgUrl;
        this.movieNumberList = movieNumberList;
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
class movieObject {
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

