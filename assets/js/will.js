// add event listener for the form
let searchButton = $('#search_button');
searchButton.on('click', validateFormDetails);
actorList = [];

apiDetails = {
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "b848faf30dmshb6025eea31e365cp1f247djsndf3f818dbefb",
        "x-rapidapi-host": "imdb8.p.rapidapi.com"
    }
}

// validating the form details
function validateFormDetails(event){
    event.preventDefault();

    let buttonElement = $(event.target)
    let parentForm = buttonElement.parent();

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
    fetchMoviesFromInput(inputStringArray);
}

function buildQueryStringForIMDb(userInput){
    // using IMDb API
    // https://rapidapi.com/apidojo/api/imdb8/
    let rootFilmographyApi = "https://imdb8.p.rapidapi.com/auto-complete?q="

    // this trims leading and trailing spaces, and replaces middle spaces with
    // %20 character as required by api
    let encodedUserInput = encodeURIComponent(userInput.trim());
    let queryString = rootFilmographyApi + encodedUserInput;
    
    return queryString;
}

function getActorIdsFromInputs(queryStrings){
    console.log(queryStrings);
    queryStrings.forEach((element) => {

        fetch(element, apiDetails)
        .then(response => {
            return response.json();
        })
        .then(data =>{
            // get the actor details from the first element of the returned data - most popular video they did I think
            let ActorId = data.d[0].id;
            let ActorName = data.d[0].l;
            let ActorImage = data.d[0].i.imageUrl;
            // await this function call as it is an asynchronous fetch
            let actorMovieList = getFilmographyFromActorId(data.d[0].id);
            // then make new object
            console.log('Actor: ',ActorName,'returned: ',actorMovieList.length,' movies from the filmography function');
            let actor = new actorObject(ActorId, ActorName, ActorImage, actorMovieList);
            actorList.push(actor);
        })
        .catch(err => {
            console.error(err);
        });
    });
}

async function getFilmographyFromActorId(actorId){ //rip the title ids from the filmography to the actor objects
    let filmographyApiUrlRoot = "https://imdb8.p.rapidapi.com/actors/get-all-filmography?nconst="
    let actorMovieList = [];
    try{
        let response = await fetch(filmographyApiUrlRoot + actorId, apiDetails);
        let json = await response.json();
        
        
        console.log('found: ',json.filmography.length,' movies in the api call');
        for(let i=0; i < json.filmography.length; i++){
            if(json.filmography[i].titleType == "movie", 
            json.filmography[i].category == "actor"){
                let MovieId = json.filmography[i].id;
                MovieId = MovieId.substring(7, 16);
                actorMovieList.push(MovieId);
            }
        }
        return actorMovieList;
        
    }catch{(error => {
        console.log(error);
    })}
}

async function fetchMovieListFromActor(actorObj){
    let filmographyApiUrlRoot = "https://imdb8.p.rapidapi.com/actors/get-all-filmography?nconst=";
    let response = await fetch(filmographyApiUrlRoot + actorObj.actor_id, apiDetails);
    return response;
}

function processMovieListJson(jsonObject){
    let actorMovieList = [];

    for(let i=0; i < jsonObject.filmography.length; i++){

        let movie = jsonObject.filmography[i];

        let titleType = movie.titleType;
        let category = movie.category;
        let movieId = movie.id.substring(7, 16);
        // note that hugo weaving was an actor and Natalie Portman was an actress
        if(titleType === "movie" && (category === "actor" || category === "actress")){
            actorMovieList.push(movieId);
        }
    }
    return actorMovieList;
}

async function fetchMoviesFromInput(searchStrings){
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

    //placeholder
    chrisMatchedMovieList = ['', '', ''];

    // create a new search object with both actor objects and the matched movie list
    search_object = new SearchObject(actor1obj, actor2obj, chrisMatchedMovieList)

    saveSearchObject(search_object);
}

function obtainMovieData(ID){
    let overviewApiUrlRoot = "https://imdb8.p.rapidapi.com/title/get-overview-details?tconst=";
    let urlDetail = "7&currentCountry=US";
    fetch(overviewApiUrlRoot + ID + urlDetail, apiDetails)
.then(response => {
	return response.json();
})
.then(data =>{
    let MvTitle = data.title.title;
    let MvReleased = data.title.year;
    let MvRatingscount = data.ratings.ratingsCount;
    let MvRating = data.ratings.rating;
    let MvImageUrl = data.title.image.url;
    let MvGenres = data.genres;
    let MvPlotOutline = data.plotOutline.text;
})
.catch(err => {
	console.error(err);
});
}
    

