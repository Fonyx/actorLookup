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
  movie_objs = [movieObject1, movieObject2,] 
}



Function countDubMovies(CD) {
  var tempCompare1 = movieObject1.id;
  var tempCompare2 = movieObject2.id;
  var id = [];
  var count = 1;

  for(var i = 0; i<tempCompare1.length;i++){
    if(tempCompare1[i]=== tempCompare2[i+1]) {
      count++;
    }
    else {
      let value = `${count}${tempCompare1[i]}`;
      id = [...id,value];
      count=1
    }
  }
  return id
}