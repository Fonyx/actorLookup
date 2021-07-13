// add event listener for the form
let searchButton = $('#search_button');
searchButton.on('click', validateFormDetails);
actorObj = [];



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
    queryFilmographyApi(queryStrings);
}

function buildQueryStringForIMDb(userInput){
    // using IMDb API
    // https://rapidapi.com/apidojo/api/imdb8/
    rootFilmographyApi = "https://imdb8.p.rapidapi.com/auto-complete?q="

    // this trims leading and trailing spaces, and replaces middle spaces with
    // %20 character as required by api
    let encodedUserInput = encodeURIComponent(userInput.trim());
    let queryString = rootFilmographyApi + encodedUserInput;
    
    return queryString;
}



function getFilmography(actorId){ //rip the title ids from the filmography to the actor objects
    fetch("https://imdb8.p.rapidapi.com/actors/get-all-filmography?nconst=" + actorId, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "d50580de85mshf5490ea0cca2bd9p1e342fjsn61b6890e257d",
		"x-rapidapi-host": "imdb8.p.rapidapi.com"
	}
})
.then(response => {
	return response.json();
})
.then(data => {
    console.log(data);
    console.log(data.filmography.length);
    for(let i=0; i < data.filmography.length; i++){
        if(data.filmography[i].titleType == "movie", data.filmography[i].category == "actor"){
            let MVID = data.filmography[i].id;
            MVID = MVID.substring(7, 15);
            actorMvList.push(MVID);
        }
    }
    console.log(actorMvList)
})
.catch(err => {
	console.error(err);
});
}


function queryFilmographyApi(queryStrings){
    console.log(queryStrings);
    queryStrings.forEach((element) => {

        fetch(element, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "b848faf30dmshb6025eea31e365cp1f247djsndf3f818dbefb",
                "x-rapidapi-host": "imdb8.p.rapidapi.com"
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data =>{
            console.log(data);
            for(let i=0; i < data.d.length; i++){
                console.log(data.d[i].l)
                console.log(data.d[i].s)
                console.log(data.d[i].rank)
            } 
            actorMvList = [];
            getFilmography(data.d[0].id);
            let actor = new ActorObject(data.d[0].id, data.d[0].l, data.d[0].i.imageUrl, actorMvList);
            actorObj.push(actor);
            console.log(actorObj);
            actorMvList.length = 0;
        })
        .catch(err => {
            console.error(err);
        });
    });
}
    
