// // general structure of movie_object_list
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
//   movie_objs = [movieObject1, movieObject2,]
// }
//functions
const ratings = {
  movie_a: 2.8,
  movie_b: 3.3,
  movie_c: 1.9,
  movie_d: 4.3,
  movie_e: 4.74,
};
const starTotal = 5;

for (const rating in ratings) {
  // 2
  const starPercentage = (ratings[rating] / starTotal) * 100;
  // 3
  const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
  // 4
  //document.querySelector(`.${rating} .stars-inner`).style.width = starPercentageRounded;
}
