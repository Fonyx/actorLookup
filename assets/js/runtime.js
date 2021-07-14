// add event listener for the form
let searchButton = $('#search_button');
searchButton.on('click', validateFormAndSearch);

// load local on reload case
searchObjects = loadSearchObjects();
currentSearchObjectIndex = 0;
console.log('Found local results: ',searchObjects);

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

// details for the api queries
apiDetails = {
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "b848faf30dmshb6025eea31e365cp1f247djsndf3f818dbefb",
        "x-rapidapi-host": "imdb8.p.rapidapi.com"
    }
}

// Chris's matching function
function getCommonMovieObjects(actorObj1, actorObj2){
  let resultMovieList = [];
  for(let j=0; j< actorObj2.movie_object_list.length; j++){
    for(let i = 0; i<actorObj1.movie_object_list.length; i++){
      if(actorObj2.movie_object_list[j].id === actorObj1.movie_object_list[i].id){
        resultMovieList.push(actorObj1.movie_object_list[i]);
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
    let response = await fetch(filmographyApiUrlRoot + actorObj.actor_id, apiDetails);
    return response;
}

// processes the movie list json object into a js object
function processMovieListJson(jsonObject){
    let actorMovieList = [];

    for(let i=0; i < jsonObject.filmography.length; i++){

        let movieObj = jsonObject.filmography[i];

        let titleType = movieObj.titleType;
        let category = movieObj.category;
        // let movieId = movieObj.id.substring(7, 16);
        // note that hugo weaving was an actor and Natalie Portman was an actress
        if(titleType === "movie" && (category === "actor" || category === "actress")){
            actorMovieList.push(movieObj);
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
        // note the use of keyword assignment, this is for clarity
        actor_id = actor1data.d[0].id, 
        actor_name = actor1data.d[0].l, 
        actor_img = actor1data.d[0].i.imageUrl
    )

    let actor2obj = new actorObject(
        actor_id = actor2data.d[0].id, 
        actor_name = actor2data.d[0].l, 
        actor_image = actor2data.d[0].i.imageUrl
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

    let movieList1 = processMovieListJson(movieListJson1);
    let movieList2 = processMovieListJson(movieListJson2);
    
    // sanity check that the movie lists are not empty and are returned when expected
    if(debug){
        console.log('movie list 1 object is: ',movieList1);
        console.log('movie list 2 object is: ',movieList2);
    }

    // append the movie objects to the actor objects
    actor1obj.movie_object_list = movieList1;
    actor2obj.movie_object_list = movieList2;

    // this is where we use chris's matching function to get the shared movie list
    // make the list of objects that match and save it to the search object
    let matchedMovies = getCommonMovieObjects(actor1obj, actor2obj);

    // create a new search object with both actor objects and the matched movie list
    new_search_object = new searchObject(actor1obj, actor2obj, matchedMovies);
    // save the new object
    saveSearchObject(new_search_object);
    renderMovieNameToLogResultsDiv(new_search_object)

}