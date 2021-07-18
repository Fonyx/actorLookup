// function that builds a response objet for how many full stars and half stars to use
function getStarCountForRating(floatMax10rating){
  // first scale it up to 0-20 by doubling it
  // next round it to the nearest round number
  // convert to int
  // return number int/2 and remainder - number of whole(2 half stars) and if there is a remainder

  let roundedFloat = Math.round(2*floatMax10rating);
  let flattenedInt = parseInt(roundedFloat);

  // get number of stars
  let starCount = Math.round(flattenedInt/4,1);

  // check the remainer from a divide by 1, if it is more than error set to true
  let halfStar = (roundedFloat % 1 > 0.1) ? 1 : 0;

  // set the total for ease downstream - if remainder total is 5 - starCount + 1
  let remainingEmpty = 5 - halfStar - starCount;

  let result = [];
  // push stars
  for(let i = 0; i<starCount; i++){
    result.push('star');
  }
  // push half stars
  for(let i = 0; i<halfStar; i++){
    result.push('star_half');
  }
  // push empty
  for(let i = 0; i<remainingEmpty; i++){
    result.push('star_border');
  }
  console.log(result);
  return result
}

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
    let result = firstName + "." + secondInitial;
    return result;
  });

  // return the array list result as a string but replace the comma with a space
  let result = ActorFilterNames.toString().replace(",", " + ");
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
  resetDomCardCarouselDiv();


  // parentDiv
  let parentDiv = $('#result_carousel');

  parentDiv.text("");

  // array of words - 5 is the max we will experience due to the movie list limit - movieListLengthLimit global
  let words = ['one', 'two', 'three', 'four', 'five'];


  // for each actor
  for(let i = 0; i < currentSearchObj.movieObjectList.length; i++){
    let movieObj = currentSearchObj.movieObjectList[i];
    let word = words[i];

    renderMovieDetails(movieObj);
    
    //<a class="carousel-item" href="#one!">
    let linkEl = makeNewJqueryElement('a', 'carousel-item', null, null, {name:'movie-index', value:i});
    linkEl.attr('href', '#'+word+"!");
      //<img src="$movieObj.imageUrl">
      let imgEl = makeNewJqueryElement('img');
      imgEl.attr('src', movieObj.imageUrl);
    linkEl.append(imgEl);
    //</a> 
    parentDiv.append(linkEl); 
  }

  //Carousel//
  $(document).ready(function () {
    $("#result_carousel").carousel({
      onCycleTo: function(data){
        console.log(data);
        console.log(data.dataset);
        // gets attached data index for the movie slide then gets the corresponding movieObj and renders
        let movieObj = currentSearchObj.movieObjectList[data.dataset.movieIndex];
        renderMovieDetails(movieObj);
      }
    });
  });

  var instance = M.Carousel.getInstance(parentDiv);
  console.log('carousel instance is: ',instance)

}

// function to render movie text outside of carousel
function renderMovieDetails(movieObj){

  resetDomMovieTitle();
  resetDomMovieGenres();
  resetDomMovieRating();
  resetDomMoviePlot();

  // render movie title
  let movieTitleDiv = $('#current_movie_title');
  let movieTitleEl = makeNewJqueryElement('h2', 'sec_text_color', null, movieObj.title);
  movieTitleDiv.append(movieTitleEl);

  // render movie genres
  let movieGenreDiv = $('#current_movie_genres');
  // since this is an array, space out the string
  // note that replace only replaces once because it is shit, so we use a regex replacement
  let arrayString = movieObj.genres.toString().replace(/,/g, " + ");
  let movieGenreEl = makeNewJqueryElement('h4', 'sec_text_color', null, arrayString);
  movieGenreDiv.append(movieGenreEl);

  // render movie rating
  let movieRatingDiv = $('#current_movie_rating');
  let stars = getStarCountForRating(movieObj.rating);
  for(let i = 0; i < stars.length; i++){
    console.log('added',stars[i]);
    let starType = stars[i];
    let iconEl = makeNewJqueryElement('i', 'small material-icons sec_text_color', null, starType);
    movieRatingDiv.append(iconEl);
  }

  // render movie plot
  let moviePlotDiv = $('#current_movie_plot');
  let moviePlotEl = makeNewJqueryElement('p', 'flow-text sec_text_color', null, movieObj.plotOutline);
  moviePlotDiv.append(moviePlotEl);
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
      let colDivEl = makeNewJqueryElement('div', 'centre-align col s8 offset-s2 m6 offset-m3 l6 offset-l3 xl4 offset-xl4');
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

// function to reset movie title
function resetDomMovieTitle(){
  let movieTitleEl = $('#current_movie_title');
  movieTitleEl.text('');
  console.log('reset movie title text div');
}

// function to reset dom movie genres
function resetDomMovieGenres(){
  let movieGenresEl = $('#current_movie_genres');
  movieGenresEl.text('');
  console.log('reset movie genres text div');
}

// function to reset movie rating text
function resetDomMovieRating(){
  let movieRatingEl = $('#current_movie_rating');
  movieRatingEl.text('');
  console.log('reset movie rating text div')
}

// function to reset movie plot outline text
function resetDomMoviePlot(){
  let moviePlotEl = $('#current_movie_plot');
  moviePlotEl.text('');
  console.log('reset movie plot text div')
}

// function to reset any text we put into the search history div
function resetDomSearchHistoryDiv() {
  let searchResultsDiv = $("#search_history");
  console.log("Resetting search history div");
  searchResultsDiv.text("");
}

// function to reset any cards we put into the cards list div
function resetDomCardCarouselDiv() {
  let cardListDiv = $("#result_carousel");
  console.log("Resetting carousel div");
  cardListDiv.text("");
}

// reset the page dom for all dynamic content
function resetDynamicContentOnDom() {
  // resets the content of each section to be empty, the order of these calls corresponds to
  // vertically moving down the page
  resetDomActorImgDiv();
  resetDomSearchHistoryDiv();
  resetDomCardCarouselDiv();
  resetDomMovieTitle();
  resetDomMovieGenres();
  resetDomMovieRating();
  resetDomMoviePlot();
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

// update current search object
function updateRenderCurrentSearchObject() {

  setActiveButtonToCurrentObject();

  renderCurrentMovieActorImages();

  renderCurrentMovieResults();

  renderCurrentMovieActorImages();
}

// render current search object
function renderCurrentSearchObject() {
  let searchObj = searchObjectHistory[currentUserChoiceIndex];
  console.log("rendering search object: ", searchObj);
  console.log("user choice index currently is: ", currentUserChoiceIndex);
  
  createButtonForCurrentSearchObject();

  setActiveButtonToCurrentObject();

  renderCurrentMovieActorImages();

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
