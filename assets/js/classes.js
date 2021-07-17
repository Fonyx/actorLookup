// class that builds searchObjects
// class accepts
/*
actorObj1           - actorObject
actorObj2           - actorObject
shared_movie_list   - list of movieObjects - after filter
*/
class searchObject{
    constructor(filters, movieObjectList){
        this.filters = filters;
        this.movieObjectList = movieObjectList;
    }

    sortMovieListDescending = function(){
        this.movieObjectList.sort(function(a, b){
            return b.ratingsCount - a.ratingsCount;
        })
    }
}
// class accepts
/*
actor_id            -str eg 'nm1234567'
actor_name          -str eg 'natalie portman'
actor_img           -str eg 'http://path_to_thing.png'
movie_object_list   -list of MovieObjects eg [MovieObject1, MovieObject2,]
*/
// constructor that builds Actor Objects
class actorObject {
    constructor(id, name, imgUrl, movieNumberList){
        this.id = id;
        this.name = name;
        this.imgUrl = imgUrl;
        this.movieNumberList = movieNumberList;
    }
}
// constructor that build Movie sub objects
// class accepts 
/* 
id              -number eg 1
title           -string eg 'v for vendetta'
released        -moment().format('y) object 
ratingsCount    -number
rating          -number
imageUrl        -string
genres          -list of strings eg ['action', 'comedy', 'drama']
plotOutline     -string
*/
class movieObject {
    constructor(id, title, released, ratingsCount, rating, imageUrl, genres, plotOutline){
        this.id = id;
        this.title = title;
        // parse numerics for comparisons
        this.released = released;
        this.ratingsCount = ratingsCount;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.genres = genres;
        this.plotOutline = plotOutline;
    }
}

function testObjectBuild(){
    let movieObject1 = new movieObject('tt1234567', 
        'V for vendetta', 
        2009, 
        1300, 
        3.5, 
        'https://m.media-amazon.com/images/M/MV5BOTI5ODc3NzExNV5BMl5BanBnXkFtZTcwNzYxNzQzMw@@._V1_.jpg',
        ['drama', 'action'],
        'A guy blows up a building with a mask on')

    let movieObject2 = new movieObject('tt2345678', 
        'star wars episode 1', 
        2004, 
        3000, 
        3.1, 
        'https://static.wikia.nocookie.net/starwars/images/b/ba/Ep1_PC_front.jpg/revision/latest?cb=20170521222822',
        ['sci-fi', 'action'],
        'The jedi do stuff')
    

    let search = new actorObject('nm1234567', 
        'natalie portman',
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ-umCzL4zUJ6W1OCXyoYkbwHhkKLS9ks8YP3rh6y1W_iQtPOnh',
        [movieObject1, movieObject2]
        )

    console.log(search);
}