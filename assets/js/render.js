//function that prints movie cards to log_results id
function renderMovieNameToLogResultsDiv(searchObj){
    // clear the dom text for div
    resetDomLogResultText();

    let logResultsDiv = $('#log_results'); 
    searchObj.movieObjectList.forEach((movieObj) => {
        console.log('Adding movie to dom: ',movieObj.title);

        //<div class="row" id="log_results">
            // collected above as logResultsDiv
            //<div class="col s6 l3" data-search-index="$currentSearchObjectIndex">
            let newColEl = makeNewJqueryElement('div', 'col s6 l3', null, null, {'name': 'search-index','value':currentSearchObjectIndex});
                //<p class="pri_text_color" data-index=$currentSearchObjectIndex>$searchObj.actor1.name+":"+$searchObj.actor2.name</p>
                let actorTextEl = makeNewJqueryElement('p', 'pri_text_color', null, searchObj.actor1.name+" + "+searchObj.actor2.name);
                //<p class="pri_text_color">$movieObj.title</p>
                let newEl = makeNewJqueryElement('p', 'pri_text_color', null, movieObj.title.title+" Rating: "+movieObj.ratings.rating);
            newColEl.append(actorTextEl);
            newColEl.append(newEl);
            //</div>
        logResultsDiv.append(newColEl)
        //</div>
    })
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
    renderMovieNameToLogResultsDiv(currentSearchObject);
}