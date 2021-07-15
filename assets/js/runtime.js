// add event listener for the form
let searchButton = $('#search_button');
searchButton.on('click', validateFormAndSearch);

// global variable name for the list of history objects
searchObjectHistory = [];

// load local on reload case
searchObjectHistory = loadSearchObjects();
currentSearchObjectIndex = 0;
console.log('Found local results: ',searchObjectHistory);

// run search
// validating the form details
function validateFormAndSearch(event){
  event.preventDefault();

  let buttonElement = $(event.target)
  let parentForm = buttonElement.parents('form');

  // get the two input fields from the form
  let userInputs = parentForm.children().find('input');

  // get form elements
  let userInputEl1 = userInputs[0];
  let userInputEl2 = userInputs[1];
  
  let UserInputText1 = userInputEl1.value;
  let UserInputText2 = userInputEl2.value;
  
  console.log(UserInputText1);
  console.log(UserInputText2);
  // this method should scale to any number of query's
  let inputStringArray = [
      buildQueryStringForIMDb(UserInputText1),
      buildQueryStringForIMDb(UserInputText2),
  ]
  // getActorIdsFromInputs(inputStringArray);
  runSearchWithInputValues(inputStringArray);
}

// details for the api queries - currently Ella's key
apiDetails = {
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "ab94207db6mshf69c29d83b5ee26p1abc45jsnff5a13e8da6d",
        "x-rapidapi-host": "imdb8.p.rapidapi.com"
    }
}

// Chris's matching function
function getCommonMovieObjects(movie_number_list_1, movie_number_list_2){
  let resultMovieList = [];
  for(let i = 0; i < movie_number_list_1.length; i++){
    for(let j = 0; j < movie_number_list_2.length; j++){
      if(movie_number_list_2[j] === movie_number_list_1[i]){
        resultMovieList.push(movie_number_list_1[i]);
      }
    }
  }
  return resultMovieList;
}

// function makes the query string from user input to query the auto-complete endpoint
function buildQueryStringForIMDb(userInput){
    // using IMDb API
    let rootFilmographyApi = "https://imdb8.p.rapidapi.com/auto-complete?q="

    // this trims leading and trailing spaces, and replaces middle spaces with
    // %20 character as required by api
    let encodedUserInput = encodeURIComponent(userInput.trim());
    let queryString = rootFilmographyApi + encodedUserInput;
    
    return queryString;
}

// fetches the movie list response from the filmography endpoint
async function fetchMovieListFromActor(actorObj){
    let filmographyApiUrlRoot = "https://imdb8.p.rapidapi.com/actors/get-all-filmography?nconst=";
    let response = await fetch(filmographyApiUrlRoot + actorObj.id, apiDetails);
    return response;
}

// fetches the general movie details from a list of movie numbers
async function fetchMovieGeneralDetailsResponse(movieNumberList){
    let movieDetailsList = [];
    
    for(let i = 0; i < movieNumberList.length; i++){
        try{
            let movieNumber = movieNumberList[i];

            let movieOverviewEndpointUrl = "https://imdb8.p.rapidapi.com/title/get-overview-details?tconst="+movieNumber+"&currentCountry=US";
    
            console.log('Querying with url: ',movieOverviewEndpointUrl);
            console.log('Using settings: ',apiDetails);

            let response = await fetch(movieOverviewEndpointUrl, apiDetails);
            let movieDetails = await response.json();
            console.log('Movie details found: ',movieDetails)

            // filter the details down
            movieDetailsList.push(movieDetails);

        }catch{(error)=>{
            console.log(error);
        }}
    }
    return movieDetailsList;
}

// processes the movie list json object into a js object
function processMovieNumberListJson(jsonObject){
    let actorMovieList = [];

    for(let i=0; i < jsonObject.filmography.length; i++){

        let movieObj = jsonObject.filmography[i];

        let titleType = movieObj.titleType;
        let category = movieObj.category;
        let movieId = movieObj.id.substring(7, 16);
        // note that hugo weaving was an actor and Natalie Portman was an actress
        if(titleType === "movie" && (category === "actor" || category === "actress")){
            actorMovieList.push(movieId);
        }
    }
    return actorMovieList;
}

// runs the search for the search strings from page input
async function runSearchWithInputValues(searchStrings){
    let input1 = searchStrings[0];
    let input2 = searchStrings[1];
    let debug = true;

    const [ActorId1Response, ActorId2Response] = await Promise.all([
        /* fetch is a function that is declared as an async function i.e. async function fetch(){}; 
        so the await function in the promise understands how to handle waiting for it 
        We should be able to make our own functions like the fetch function that are 
        asynchronous and can be 'awaited' similarly*/
        fetch(input1, apiDetails),
        fetch(input2, apiDetails),
    ])

    let actor1data = await ActorId1Response.json();
    let actor2data = await ActorId2Response.json();

    // sanity log of returned data
    if(debug){
        console.log('actor 1 returned data: ',actor1data);
        console.log('actor 2 returned data: ',actor2data);
    }

    // get actor id's from the actor query objects
    let actor1obj = new actorObject(
        // parameters are id, name and imgUrl
        actor1data.d[0].id, 
        actor1data.d[0].l, 
        actor1data.d[0].i.imageUrl
    )
        
    let actor2obj = new actorObject(
        // parameters are id, name and imgUrl
        actor2data.d[0].id, 
        actor2data.d[0].l, 
        actor2data.d[0].i.imageUrl
    )

    // sanity log of returned data
    if(debug){
        console.log('actor1 object is: ',actor1obj);
        console.log('actor2 object is: ',actor2obj);
    }
    
    // query movie list for the actors
    let [movieListResponse1, movieListResponse2] = await Promise.all([
        fetchMovieListFromActor(actor1obj),
        fetchMovieListFromActor(actor2obj),
    ]);

    // process responses from movie list api
    let movieListJson1 = await movieListResponse1.json();
    let movieListJson2 = await movieListResponse2.json();

    // log out the json object for both
    if(debug){
        console.log('Movie list 1 json is: ', movieListJson1);
        console.log('Movie list 2 json is: ', movieListJson2);
    }

    let movieNumberList1 = processMovieNumberListJson(movieListJson1);
    let movieNumberList2 = processMovieNumberListJson(movieListJson2);
    
    // sanity check that the movie lists are not empty and are returned when expected
    if(debug){
        console.log('movie list 1 object is: ',movieNumberList1);
        console.log('movie list 2 object is: ',movieNumberList2);
    }

    // append the movie number lists to the actor objects - to make lookups easier in the future
    actor1obj.movieNumberList = movieNumberList1;
    actor2obj.movieNumberList = movieNumberList2;

    // this is where we use chris's matching function to get the shared movie list
    // make the list of objects that match and save it to the search object
    let matchedMovieNumbers = getCommonMovieObjects(movieNumberList1, movieNumberList2);

    //sanity log
    if(debug){
        console.log('Matched movie strings: ',matchedMovieNumbers)
    }

    // run fetch on movie numbers to get movie general details
    let matchedMovieDetailObjects = await fetchMovieGeneralDetailsResponse(matchedMovieNumbers);

    // sanity log
    if(debug){
        console.log('Matched movie objects: ',matchedMovieDetailObjects)
    }

    // create a new search object with both actor objects and the matched movie list
    new_search_object = new searchObject(actor1obj, actor2obj, matchedMovieDetailObjects);

    // save the new object
    saveSearchObject(new_search_object);

    // dev: render to front page to confirm all is well with gathered results
    renderMovieNameToLogResultsDiv(new_search_object);

}