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
    let queryStrings = [
        buildQueryStringForIMDb(UserInputText1),
        buildQueryStringForIMDb(UserInputText2),
    ]
    getActorIdsFromInputs(queryStrings);
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
            // console.log(data);
            let ActorId = data.d[0].id;
            let ActorName = data.d[0].l;
            let ActorImage = data.d[0].i.imageUrl;
            // await this function call as it is an asynchronous fetch
            let actorMovieList = getFilmographyFromActorId(data.d[0].id);
            // then make new object
            console.log('Actor: ',ActorName,'returned: ',actorMovieList.length,' movies');
            let actor = new ActorObject(ActorId, ActorName, ActorImage, actorMovieList);
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

        console.log(json);
        console.log(json.filmography.length);
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
    

