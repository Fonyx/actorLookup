(function ($) {
  $(function () {
    $(".sidenav").sidenav();
  }); // end of document ready
})(jQuery); // end of jQuery name space

//Carousel//
$(document).ready(function () {
  $(".carousel").carousel();
});


// general structure of movie_object_list
// movie_details_obj = {
//   id: 'tt1234567',
//   title: 'v for vendetta',
//   released: moment().format('y'),
//   ratingsCount : 300,
//   rating: 4.5,
//   imageUrl: "path_to_url",
//   Genres: ['x', 'y', 'z'],
//   plotOutline: "a long string describing the movie",
// }

// searchObject = {
//   actor_id: "nm1231234",
//   actor_name: "natalie portman",
//   actor_img_url: "path to url for actor",
//   movie_objs: [movieObject1, movieObject2,],
// }

makeFakeMoviesAndSaveToStorage();

function makeFakeMoviesAndSaveToStorage(){
    let movieObject1 = new MovieObject('tt1234567', 
        'V for vendetta', 
        2009, 
        1300, 
        3.5, 
        'https://m.media-amazon.com/images/M/MV5BOTI5ODc3NzExNV5BMl5BanBnXkFtZTcwNzYxNzQzMw@@._V1_.jpg',
        ['drama', 'action'],
        'A guy blows up a building with a mask on');

    let movieObject2 = new MovieObject('tt2345678', 
        'star wars episode 1', 
        2004, 
        3000, 
        3.1, 
        'https://static.wikia.nocookie.net/starwars/images/b/ba/Ep1_PC_front.jpg/revision/latest?cb=20170521222822',
        ['sci-fi', 'action'],
        'The jedi do stuff');
    
    let movieObject3 = new MovieObject('tt3456789',
        'Priscilla queen of the desert',
        2003,
        12000,
        4.7,
        'https://flxt.tmsimg.com/assets/p17043_p_v10_ac.jpg',
        ['drama', 'LGBTQ'],
        '3 drag queens drive through australia');

    let searchObj1 = new ActorObject('nm1234567', 
        'natalie portman',
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ-umCzL4zUJ6W1OCXyoYkbwHhkKLS9ks8YP3rh6y1W_iQtPOnh',
        [movieObject1, movieObject2]
        )

    let searchObj2 = new ActorObject('nm2345678', 
        'hugo weaving',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqGkJXzir7KYyIwm7acViaMTg2B8FMyJ4oDA&usqp=CAU',
        [movieObject1, movieObject3]
        )

    
    resetMemory();
    saveSearchObject(searchObj1);
    saveSearchObject(searchObj2);
    fakeGlobalSearchObjects = loadSearchObjects();
    console.log(fakeGlobalSearchObjects);
}

function getCommonMovieObjects(search1, search2){
  let resultMovieList = [];
  for(let j=0; j< search2.movie_object_list.length; j++){
    for(let i = 0; i<search1.movie_object_list.length; i++){
      if(search2.movie_object_list[j].id === search1.movie_object_list[i].id){
        resultMovieList.push(search1.movie_object_list[i]);
      }
    }
  }
  return resultMovieList;
}

function getMovieIds (actorObject) {
  let tempArray = [];
  for (let i = 0; i<actorObject.movie_object_list.length; i++){
    tempArray.push(actorObject.movie_object_list[i].id);
  }
  return tempArray;
}

function getCommonMovieIds (list1,list2) {
  let tempArray = [];
  for (let i = 0; i<list1.length; i++){
    console.log(list1[i]);
    for (let j = 0; j<list2.length; j++){
      console.log(list2[j]);   
      if (list1[i] === list2[j]){
        tempArray.push(list1[i])
      }
    }
  }
  return tempArray;
}


// finds a given id, returns corresponding movie object
function lookupMovieFromId(ids, actor){
  let results = [];
  for(let j=0; j< ids.length; j++){
    for(let i = 0; i<actor.movie_object_list.length; i++){
      if(actor.movie_object_list[i].id === ids[j]){
        results.push(actor.movie_object_list[i]);
      }
    }
  }
  return results;
}

function getMatchingMovies(){
  // load from memory the two actors
  let searchObjects = loadSearchObjects();
  // assuming that searchObjects has 2 entries
  let MovieIds1 = getMovieIds(searchObjects[0]);
  let MovieIds2 = getMovieIds(searchObjects[1]);

  console.log(MovieIds1);
  console.log(MovieIds2);
  
  let sharedMovieIds =  getCommonMovieIds(MovieIds1, MovieIds2);
  
  console.log(sharedMovieIds);
  
  let sharedMovieObjects = lookupMovieFromId(sharedMovieIds, fakeGlobalSearchObjects[0]);
  
  console.log(sharedMovieObjects);

  return sharedMovieObjects;
}

getMatchingMovies();

console.log('change');
let searchObjects = loadSearchObjects();
let movies = getCommonMovieObjects(searchObjects[0], searchObjects[1]);

console.log(movies);

