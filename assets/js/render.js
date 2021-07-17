// function to make a string from an array of actors names
// ------------------ this will break in future non actor filter phases
// function turns Natalie Portman into Natalie P
function makeStringOfActorsNames(searchObj) {
  let ActorFilterNames = searchObj.filters.map((x) => {
    console.log("Starting with actor name: ", x.name);
    // example is 'Chris Hemsway'
    let names = x.name.split(" ");
    let firstName = names[0];
    let secondName = names[1];
    let firstInitial = firstName.charAt(0);
    let secondInitial = secondName.charAt(0);
    let result = firstName + " " + secondInitial;
    return result;
  });

  // return the array list result as a string but replace the comma with a space
  let result = ActorFilterNames.toString().replace(",", " ");
  return result;
}

function createButtonForCurrentSearchObject() {
  let searchHistoryEl = $("#search_history");

  // make display string from searchObject filters names - map the name elements to the return but also replace [ and ] with spaces, then trim whitespace
  let filterNames = makeStringOfActorsNames(currentSearchObj);

  //sanity log
  console.log(filterNames);

  let actorTextEl = makeNewJqueryElement(
    "button",
    "btn search_history_button",
    "",
    filterNames,
    { name: "search-index", value: currentUserChoiceIndex }
  );

  searchHistoryEl.append(actorTextEl);
}

function setActiveButtonToCurrentObject() {
  // reset the id's of the buttons for styling before rendering
  resetButtonIds();

  // find the button with the id of the currentUserChoiceIndex
  let buttons = $("#search_history").children();

  // set the id of the matching button to 'selected_history_button'
  for (let i = 0; i < buttons.length; i++) {
    let button = $(buttons[i]);
    let buttonIndexStr = button.attr("data-search-index");
    let buttonIndexInt = parseInt(buttonIndexStr);
    if (buttonIndexInt === currentUserChoiceIndex) {
      // this button is the one the user currently has active
      button.attr("id", "selected_history_button");
    }
  }
}

// this will render the movie results of the current search object
// it purges the div and then fills it again, simple
function renderCurrentMovieResults() {
  // clear the dom text for div
  resetDomLogResultDiv();

  let logResultsDiv = $("#log_results");
  for (let i = 0; i < currentSearchObj.movieObjectList.length; i++) {
    let movieObj = currentSearchObj.movieObjectList[i];
    console.log("Adding movie to dom: ", movieObj.title);
    //<div class="row" id="log_results">
    // collected above as logResultsDiv
    //<div class="col s6 l3">
    let newColEl = makeNewJqueryElement("div", "col");
      //<h3 class="pri_text_color">$movieObj.title</p>
        let titleEl = makeNewJqueryElement("h4","center-align pri_text_color", null, movieObj.title);
        //<h5 class="sec_text_color">$movieObj.rating</p>
        let ratingEl = makeNewJqueryElement("h5","center-align sec_text_color", null, "Rating: " + movieObj.rating);
        //<h5 class="sec_text_color">$movieObj.ratingsCount</p>
        let ratingsCountEl = makeNewJqueryElement("h5","center-align sec_text_color", null,"Rating Count: " + movieObj.ratingsCount);
        //<img src="$movieObj.imageUrl">
        let imgEl = makeNewJqueryElement("img");
        imgEl.attr('src', movieObj.imageUrl);
        imgEl.attr('width', '150px');
      newColEl.append(titleEl, ratingEl, ratingsCountEl, imgEl);
      //</div>
    logResultsDiv.append(newColEl);
    //</div>
  }
}

// function to render the actor images
function renderCurrentMovieActorImages(){
  resetDomActorImgDiv();

  // for each actor
  for(let i = 0; i < currentSearchObj.filters.length; i++){
    let actorObj = currentSearchObj.filters[i];
    
    // parentDiv
    let parentDiv = $('#actor_img_div');
      //<div class="col s6 l3">
      let colDivEl = makeNewJqueryElement('div', 'centre-align col s12 m6 offset-m3 l6 offset-l3');
        //<div class="card horizontal">
        let cardDiv = makeNewJqueryElement('div', 'card horizontal');
          //<div class="card-image">
          let cardImgDiv = makeNewJqueryElement('div', 'card-image');
            //<img src="$actorObj.imgUrl">
            let cardImgEl = makeNewJqueryElement('img');
            cardImgEl.attr('src', actorObj.imgUrl);
          cardImgDiv.append(cardImgEl);
          //</div>
          //<div class="card-stacked">
          let cardStacked = makeNewJqueryElement('div', 'card-stacked');
            //<div class="card-content">
            let contentDiv = makeNewJqueryElement('div', 'card-content valign-wrapper');
              //<h2 class="card-title grey-text text-darken-4">$actorObj.name</h2>
              let titleEl = makeNewJqueryElement('p', 'card-title', null, actorObj.name);
            contentDiv.append(titleEl); 
            //</div>
            cardStacked.append(contentDiv);
          //</div>
        cardDiv.append(cardImgDiv, cardStacked);
        //</div>
      colDivEl.append(cardDiv);
      //</div
    parentDiv.append(colDivEl);
  }
  
}

// function to reset the actor img section
function resetDomActorImgDiv(){
  let parentDiv = $('#actor_img_div');
  parentDiv.text("");
}

// function to reset any text we put into the search history div
function resetDomSearchHistoryDiv() {
  let searchResultsDiv = $("#search_history");
  console.log("Resetting search history div");
  searchResultsDiv.text("");
}

// function to reset any cards we put into the cards list div
function resetDomCardsListDiv() {
  let cardListDiv = $("#cards_list");
  console.log("Resetting cards list div");
  cardListDiv.text("");
}

// function to reset any details we put into the log results section
function resetDomLogResultDiv() {
  let logResultsDiv = $("#log_results");
  console.log("Resetting log results div");
  logResultsDiv.text("");
}

// reset the page dom for all dynamic content
function resetDynamicContentOnDom() {
  // resets the content of each section to be empty, the order of these calls corresponds to
  // vertically moving down the page
  resetDomActorImgDiv();
  resetDomSearchHistoryDiv();
  resetDomCardsListDiv();
  resetDomLogResultDiv();
}

// reset the entire page, memory and DOM
function fullResetOfPage() {
  resetMemory();
  resetDynamicContentOnDom();
}

// function to clear all ids in buttons
function resetButtonIds() {
  let buttons = $("#search_history").children();
  console.log("buttons: ", buttons);
  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    console.log("button had id: ", $(button).attr("id"));
    $(button).attr("id", "");
  }
}

// render all search object history buttons -- ELLA

// render current search object
function renderCurrentSearchObject() {
  let searchObj = searchObjectHistory[currentUserChoiceIndex];
  console.log("rendering search object: ", searchObj);
  console.log("user choice index currently is: ", currentUserChoiceIndex);

  createButtonForCurrentSearchObject();

  setActiveButtonToCurrentObject();

  renderCurrentMovieResults();

  renderCurrentMovieActorImages();
}

// render all search object history buttons -- ELLA
function renderCards(searchObj) {
  let cardHorizontal = $("<div>").addClass(["card", "horizontal"]);
  let cardImg = $("div.card-image");
  let cardStacked = $("<div>").addClass(["card", "stacked"]);
  let cardContent = $("div.card-content").children();
  body.appendChild(cardHorizontal, cardImg, cardStacked, cardContent);
  console.log(searchObj);
  
  // let resultSection = $('#search_history');
  // let cardHorizontal = makeNewJqueryElement('div', 'card horizontal');
  // let cardImg = makeNewJqueryElement('div', 'card-image');
  // let cardStacked = makeNewJqueryElement('div', 'card stacked');
  // let cardContent = makeNewJqueryElement('div', 'card content');
  // resultSection.append(cardHorizontal, cardImg, cardStacked, cardContent);
  
}
