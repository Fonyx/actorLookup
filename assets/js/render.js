//function that prints movie cards to log_results id
function renderMovieNameToLogResultsDiv(searchObj){
    // clear the dom text for div
    resetDomLogResultText();

    let logResultsDiv = $('#log_results'); 
    searchObj.movieObjectList.forEach((movieObj) => {
        console.log('Adding movie to dom: ',movieObj.title);

        //<div class="row" id="log_results">
            // collected above as logResultsDiv
            //<div class="col s6 l3">
            let newColEl = makeNewJqueryElement('div', 'col');
                //<p class="pri_text_color">$movieObj.title</p>
                let newEl = makeNewJqueryElement('p', 'center-align pri_text_color', null, movieObj.title.title+" Rating: "+movieObj.ratings.rating);
            newColEl.append(newEl);
            //</div>
        logResultsDiv.append(newColEl)
        //</div>
    })
}

// render a button for the search object
function renderSearchObjectButton(searchObj, index){
    let searchHistoryEl = $('#search_history');
    // append the search obj button to this element

    //<p class="pri_text_color" data-search-index="$currentSearchObjectIndex">$searchObj.actor1.name+":"+$searchObj.actor2.name</p>
    let actorTextEl = makeNewJqueryElement('button', 'pri_bg_color sec_text_color btn', null, searchObj.actor1.name+" + "+searchObj.actor2.name, {'name': 'search-index','value':index});

    searchHistoryEl.append(actorTextEl);
}

// function to reset any text we need to set to zero
function resetDomLogResultText(){
    let logResultsDiv = $('#log_results'); 
    // empty out the div to avoid overflow
    logResultsDiv.text("");
}

// render all search object history buttons -- ELLA


// render current search object
function renderCurrentSearchObject(){
    let currentSearchObject = searchObjectHistory[currentSearchObjectIndex];
    console.log('rendering search object: ',currentSearchObject);
    renderSearchObjectButton(currentSearchObject, currentSearchObjectIndex);
    renderMovieNameToLogResultsDiv(currentSearchObject);
}