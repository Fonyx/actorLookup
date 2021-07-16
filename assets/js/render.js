// function to make a string from an array of actors names 
// ------------------ this will break in future non actor filter phases
// function turns Natalie Portman into Natalie P
function makeStringOfActorsNames(searchObj){

    let ActorFilterNames = searchObj.filters.map(x => {
        console.log('Starting with actor name: ',x.name);
        // example is 'Chris Hemsway'
        let names = x.name.split(' ');
        let firstName = names[0];
        let secondName = names[1];
        let firstInitial = firstName.charAt(0);
        let secondInitial = secondName.charAt(0);
        let result = firstName+" "+secondInitial;
        return result;
    });

    // return the array list result as a string but replace the comma with a space
    let result = ActorFilterNames.toString().replace(',', ' ');
    return result;
}

//function that prints movie cards to log_results id
function renderMovieNameToLogResultsDiv(searchObj){
    // clear the dom text for div
    resetDomLogResultDiv();

    console.log(searchObj);

    let logResultsDiv = $('#log_results'); 
    for(let i = 0; i < searchObj.movieObjectList.length; i++){

        let movieObj = searchObj.movieObjectList[i];
        console.log('Adding movie to dom: ',movieObj.title);
        //<div class="row" id="log_results">
            // collected above as logResultsDiv
            //<div class="col s6 l3">
            let newColEl = makeNewJqueryElement('div', 'col');
                //<p class="pri_text_color">$movieObj.title</p>
                let newEl = makeNewJqueryElement('p', 'center-align pri_text_color', null, movieObj.title+" Rating: "+movieObj.rating);
            newColEl.append(newEl);
            //</div>
        logResultsDiv.append(newColEl)
        //</div>
    }
}

// render a button for the search object
function renderSearchObjectButton(searchObj){
    let searchHistoryEl = $('#search_history');
    // append the search obj button to this element

    // make display string from searchObject filters names - map the name elements to the return but also replace [ and ] with spaces, then trim whitespace
    let filterNames = makeStringOfActorsNames(searchObj);

    //sanity log
    console.log(filterNames);

    //<p class="pri_text_color" data-search-index="$currentSearchObjectIndex">$searchObj.actor1.name+":"+$searchObj.actor2.name</p>
    let actorTextEl = makeNewJqueryElement('button', 'pri_bg_color sec_text_color btn', null, filterNames, {'name': 'search-index','value':searchObj.index});

    searchHistoryEl.append(actorTextEl);
}

// function to reset any text we put into the search history div
function resetDomSearchHistoryDiv(){
    let searchResultsDiv = $('#search_history'); 
    console.log('Resetting search history div');
    searchResultsDiv.text("");
}

// function to reset any cards we put into the cards list div
function resetDomCardsListDiv(){
    let cardListDiv = $('#cards_list'); 
    console.log('Resetting cards list div');
    cardListDiv.text("");
}

// function to reset any details we put into the log results section
function resetDomLogResultDiv(){
    let logResultsDiv = $('#log_results'); 
    console.log('Resetting log results div');
    logResultsDiv.text("");
}

// reset the page dom for all dynamic content
function resetDynamicContentOnDom(){
    // resets the content of each section to be empty, the order of these calls corresponds to 
    // vertically moving down the page
    resetDomSearchHistoryDiv();
    resetDomCardsListDiv();
    resetDomLogResultDiv();
}

// reset the entire page, memory and DOM
function fullResetOfPage(){
    resetMemory();
    resetDynamicContentOnDom();
}

// render all search object history buttons -- ELLA

// render current search object
function renderSearchObject(searchObj){
    console.log('rendering search object: ',searchObj);
    renderSearchObjectButton(searchObj);
    renderMovieNameToLogResultsDiv(searchObj);
}