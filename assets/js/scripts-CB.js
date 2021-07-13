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
movie_details_obj = {
  id: 'tt1234567',
  title: 'v for vendetta',
  released: moment().format('y'),
  ratingsCount : 300,
  rating: 4.5,
  imageUrl: "path_to_url",
  Genres: ['x', 'y', 'z'],
  plotOutline: "a long string describing the movie",
}

searchObject = {
  actor_id: "nm1231234",
  actor_name: "natalie portman",
  actor_img_url: "path to url for actor",
  movie_objs: [movieObject1, movieObject2,],
}


function getMovieIds (actorObject) {
  let temparray = [];
  for (let i = 0; i<actorObject.movie_details_obj.length; i++){
    temparray.push(actorObject.movie_details_obj[i].id);
  }
  return temparray;
}

function getCommonMovieIds (list1,list2) {
  let temparray = [];
  for (let i = 0; i<list1.length; i++){
    console.log(list1[i]);
    for (let j = 0; j<list2.length; j++){
      console.log(list2[j]);   
      if (list1[i] === list2[j]){
        temparray.push(list1[i])
      }
    }
  }
  return temparray;
}

