// add event listener for the form
let searchButton = $('#search_button');
searchButton.on('click', validateFormDetails);

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
            const actorId = data.d[0].id //creating variables to be inserted into constructors
            const actorName = data.d[0].l
            const actorImg = data.d[0].i.imageUrl
            console.log(actorId)
            console.log(actorName)
            console.log(actorImg)
            let Actor00 = new ActorObject(actorId, actorName, actorImg)
            console.log(Actor00)
        })
        .catch(err => {
            console.error(err);
        });
    });
}
    
