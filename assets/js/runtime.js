// add event listener for the form
var searchButton = $('#search_button');
searchButton.on('click', validateFormAndSearch);
var singleActorMovieLimit = 1;
// this count limit keeps the low popularity/familiarity movies out
var ratingCountLimit = 200;
// this is used to keep track of the currently rendered search object
var currentUserChoiceIndex = -1;
// this is a global list of all search objects
var searchObjectHistory = [];
// the current searchObject
var currentSearchObj = null;


// details for the api queries - currently Chris's key
apiDetails = {
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "a4ec962206mshf309408bd994b33p1bda1fjsn30b09c0bd162",
        "x-rapidapi-host": "imdb8.p.rapidapi.com"
    }
}

function updateCurrentSearchIndexAndObj(index){
    console.log('Updating global variables')
    console.log('updating index from: ', currentUserChoiceIndex,' to: '+index);
    currentUserChoiceIndex = index;

    if(searchObjectHistory.length > 0){
        console.log('setting current object from: ', currentSearchObj,' to: '+searchObjectHistory[index]);
        currentSearchObj = searchObjectHistory[index];
    } else {
        console.log('No objects to update to, setting current to null')
        currentSearchObj = null;
    }

}

// add event handler for body tag onload to load storage and render
window.addEventListener('load', loadAndRenderSearchObjects);

// add event delegation to the search history section for buttons
let searchHistoryEl = $('#search_history');
searchHistoryEl.on('click', '.search_history_button', function (event) {

    let searchIndexRaw = event.target.dataset['searchIndex'];
    let searchIndexInt = parseInt(searchIndexRaw, 10);
    // using a global
    updateCurrentSearchIndexAndObj(searchIndexInt);
    setActiveButtonToCurrentObject();
    renderCurrentMovieResults();
})

// function that loads elements from storage
// then calls render on all searchObjects for their buttons
// then calls render on the last searchObject as that was the most recent
function loadAndRenderSearchObjects(){

    loadSearchObjects();
  
    // check there are some
    if(searchObjectHistory.length > 0){
        console.log('resetting current choice index to: ',currentUserChoiceIndex);

        console.log('Found local results: ',searchObjectHistory);

        // the button for the current choice is rendered with the object itself below
        for(let i = 0; i < searchObjectHistory.length; i++){
            console.log('Now rendering current object: ', searchObjectHistory[currentUserChoiceIndex]),
            updateCurrentSearchIndexAndObj(i);
            // call the render method for the movie cards of the current search object
            renderCurrentSearchObject();
        }
    }
}

// run search
// validating the form details
function validateFormAndSearch(event){
    event.preventDefault();

    let buttonElement = $(event.target)
    let parentForm = buttonElement.parents('form');

    // get the two input fields from the form
    let userInputs = parentForm.children().find('input');

    // get text elements out of strings
    let userInputTexts = [];
    for(let i = 0; i < userInputs.length; i++){
        let userInputEl = userInputs[i];
        console.log('Input element: ',userInputEl);
        let textValue = userInputEl.value;
        console.log('Text value of input was: ',textValue);
        // filter out empty strings as they are falsy
        if(textValue){
            userInputTexts.push(textValue);
        }
    }
  
    // check if we have already run this search before and if so, will return the index of the search object, else it will be null
    let duplicateIndex = getDuplicateSearchIndex(userInputTexts);
    if(!duplicateIndex){
        // run a new search
        console.log('No duplicates found in history, new api search');

        // build new query strings
        // take all valid user text values, build a query string for IMDB and make array
        let queryStrings = userInputTexts.map((inputText) => {
            let queryString = buildQueryStringForIMDb(inputText);
            return queryString;
        });

        console.log('Query strings are: ',queryStrings);

        runSearchWithInputValues(queryStrings);
    }else{
        console.log('rendering previous search result: ', duplicateSearchObject)
        // set the current search object to the object we already have
        updateCurrentSearchIndexAndObj(duplicateIndex)
        // render the object we had in history again
        renderCurrentSearchObject();
    }
}

// Chris's matching function
function getCommonMovieObjects(movieNumberLists){
    let resultMovieList = [];
    let movieNumberList1 = movieNumberLists[0];
    let movieNumberList2 = movieNumberLists[1];

    // if there are actually 2 lists, otherwise the match criteria says return everything
    if(movieNumberList2){
        for(let i = 0; i < movieNumberList1.length; i++){
            for(let j = 0; j < movieNumberList2.length; j++){
                if(movieNumberList2[j] === movieNumberList1[i]){
                    resultMovieList.push(movieNumberList1[i]);
                }
            }
        }
    }else{
        resultMovieList = movieNumberList1.slice(0, singleActorMovieLimit);
    }
    
    return resultMovieList;
}

// check the searchObject list we have for the user inputs, if we find them in forwards or backwards order, return the index of the search object
function getDuplicateSearchIndex(inputStringsArray){
    // placeholder return so we run a fresh search until this function has been built
    return null;
}

// function makes the query string from user input to query the auto-complete endpoint
function buildQueryStringForIMDb(userInput){
    // using IMDb API
    let rootFilmographyApi = "https://imdb8.p.rapidapi.com/auto-complete?q="

    // this trims leading and trailing spaces, and replaces middle spaces with
    // %20 character as required by api
    let encodedUserInput = userInput.replace(/\W/g, "").replace(/[0-9]/g, "");
    encodedUserInput = encodeURIComponent(encodedUserInput.trim());
    let queryString = rootFilmographyApi + encodedUserInput;
    console.log(encodedUserInput)
    
    return queryString;
}

// fetches the general movie details from a list of movie numbers
async function fetchMovieGeneralDetailsResponse(movieNumberList){

    movieObjectsLists = [];

    // ends with a list of json data from an asynchronous fetch of numerous urls
    movieObjectsLists = await Promise.all(
        // for each actor obj in the list, asynchronously fetch api response, and map the json data
        movieNumberList.map(async movieNumber => {
            let movieOverviewEndpointUrl = "https://imdb8.p.rapidapi.com/title/get-overview-details?tconst="+movieNumber+"&currentCountry=US";
            let response = await fetch(movieOverviewEndpointUrl, apiDetails);
            let movieJson = await response.json();
            
            // screen the data for necessary fields
            // filter the details down
            try{
                var id = movieJson.id.substring(7,16);
                var title = movieJson.title.title;
                var released = movieJson.title.year;
                var ratingCount = movieJson.ratings.ratingCount;
                var rating = movieJson.ratings.rating;
                var imageUrl = movieJson.title.image.url;
                var genres = movieJson.genres;
                var plotOutline = movieJson.plotOutline.text;
                // if we get a result that doesn't have this structure, log error and don't append it to list
            }catch(error) {
                console.log('Movie details were: ',movieJson);
                console.log('but something went wrong for a detail: ',error);
            }
            // filter out low rating results
            if(ratingCount > ratingCountLimit){
                return new movieObject(id, title, released, ratingCount, rating, imageUrl, genres, plotOutline);
            } else {
                return 'Movie Too Small';
            }
        })
    )
    // remove elements that are too small (unpopular < ratingCountLimit)
    let popularMovieObjectLists = movieObjectsLists.filter(movie => movie !== 'Movie Too Small');
    console.log('Popular Actor Movie Lists: ',popularMovieObjectLists);
    return popularMovieObjectLists;
}

// function that query's multiple query strings to get actor details
async function fetchActorObjects(queryStringList){
    // https://dev.to/jamesliudotcc/how-to-use-async-await-with-map-and-promise-all-1gb5
    actorObjectList = await Promise.all(
        queryStringList.map(async queryString => {
            console.log('Attempting query string: ',queryString);
            let filmResponse = await fetch(queryString, apiDetails)
            let ActorData =  await filmResponse.json();
            return new actorObject(
                // parameters are id, name and imgUrl
                ActorData.d[0].id, 
                ActorData.d[0].l, 
                ActorData.d[0].i.imageUrl
            )           
        })
    )
    console.log('Actor Data List: ',actorObjectList);
    return actorObjectList;
}

// function that query's multiple filmographies from actor objects
async function fetchActorFilmographyList(actorObjs){

    // ends with a list of json data from an asynchronous fetch of numerous urls
    movieNumberLists = await Promise.all(
        // for each actor obj in the list, asynchronously fetch api response, and map the json data
        actorObjs.map(async actorObj => {
            let filmographyApiUrlRoot = "https://imdb8.p.rapidapi.com/actors/get-all-filmography?nconst=";
            let actorMovieList = [];
            let response = await fetch(filmographyApiUrlRoot + actorObj.id, apiDetails);
            let jsonObject = await response.json();

            for(let i=0; i < jsonObject.filmography.length; i++){

                let movieObj = jsonObject.filmography[i];
        
                let titleType = movieObj.titleType;
                let category = movieObj.category;
                let movieId = movieObj.id.substring(7, 16);
                let acceptedStatus = ["completed", "released"]
                /* filters: 
                titleType = movie
                category = actor or actress
                image.url exists!
                status is in []
                */
                if(titleType === "movie" && (category === "actor" || category === "actress")){
                    // if it has an image
                    if(movieObj.image){
                        // if the status is either completed or released
                        if(acceptedStatus.includes(movieObj.status)){
                            actorMovieList.push(movieId);
                        }
                    }
                }
            }
            return actorMovieList;
        })
    )
    console.log('Actor Movie Lists: ',movieNumberLists);
    return movieNumberLists;
}

// runs the search for the search strings from page input
async function runSearchWithInputValues(searchStrings){

    // -----------------------------------------LOADING ACTOR ID'S-------------------------------------
    // this function calls both fetches simultaneously to save time since the query's are independent
    let actorObjs = await fetchActorObjects(searchStrings);
    
    // -----------------------------------------QUERYING FILMOGRAPHYS-------------------------------------
    let movieNumberLists = await fetchActorFilmographyList(actorObjs);

    // -----------------------ADDING MOVIE NUMBER LISTS TO ACTOR OBJECTS-------------------------------------

    // append the movie number lists to the actor objects - to make lookups easier in the future
    // since movie lists and actor objects must be the same length by design we can assume their lengths match
    for(let i = 0; i < actorObjs.length; i++){
        actorObjs[i].movieNumberList = movieNumberLists[i];
    }

    // this is where we use chris's matching function to get the shared movie list
    // make the list of objects that match and save it to the search object
    let matchedMovieNumbers = getCommonMovieObjects(movieNumberLists);

    //sanity log
    console.log('Matched movie strings: ',matchedMovieNumbers)
    

    // -----------------------------------------GET MOVIE OVERVIEW DETAILS----------------------------------

    // run fetch on movie numbers to get movie general details
    let matchedMovieDetailObjects = await fetchMovieGeneralDetailsResponse(matchedMovieNumbers);

    // sanity log
    console.log('Matched movie objects: ',matchedMovieDetailObjects)
    

    // -----------------------------------------STORING AND RENDERING-------------------------------------

    // create a new search object with both actor objects and the matched movie list
    // set the index to the current search object index
    var newSearchObj = new searchObject(actorObjs, matchedMovieDetailObjects);

    // save the new object - this also updates the currentChoiceIndex
    saveSearchObject(newSearchObj);

    // dev: render to front page to confirm all is well with gathered results
    renderCurrentSearchObject();

}