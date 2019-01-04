//Storage
var storage = {
	 url: "https://api.themoviedb.org/3/",
    key: '?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=en-US',
    articleList: [],
	total_pages: '',
	current_page: 1,
	articleListLength: '',
	limit: 10,
	movieList: [],
	movieIdClicked: '',
    movieItem: {},
     list : document.getElementById('listM'),
    movieBackground: document.getElementById('movieBackground'),
};

//--------------------------  Movies List page (GRID)

//--------------------------  API request function

function getData (apiName, num) {
    return fetch(      storage.url + apiName + storage.key + num,
        {  method: 'GET'  }
    )
}

// ------------------------Build Movie list grid

window.onload = function () {
    render()
};


// render results of API response

function render () {
    getData('movie/top_rated', '&page=' + storage.current_page)//API request for movie list
        .then(function(res) {
            return res.json()
        })
        .then(function(res) {
			console.log(res.results) 
            storage.articleList = storage.articleList.concat(res.results); // add new object to existing array
			storage.total_pages	= res.total_pages;
			storage.articleListLength = storage.articleList.length;
			console.log(storage)
            ArticalList()
        })
}
// Create global div with id="articleList" to add all movies in grid here
function ArticalList () {
	//--------------------------  Infinite scroll  > render() while limit allows
window.onscroll = function() {
  var d = document.documentElement;
  var offset = d.scrollTop + window.innerHeight;
  var height = d.offsetHeight;

 //console.log('offset = ' + offset);
	//console.log('height = ' + height);		
	
		if (offset === height) {		
							
			storage.current_page++
					
			if (storage.current_page < storage.limit) {	
				render()	 
			}		
		}	
};

	var i = (storage.current_page-1)*20+1
    storage.articleList.slice(i).forEach(function(item) {
        articleList.appendChild(ArticalItem(item))
    })
}

function ArticalItem (data) {
    // -----------------------create DOM elements of one element of grid 
	
		var itemArticle = document.createElement('div');
		
			var itemArticleInner = document.createElement('div');

				var rowMovieDiv = document.createElement('div');
		
					var imgDiv = document.createElement('div');
					var img = document.createElement('img');
					
					var textDiv = document.createElement('div');
						var cardBodyDiv = document.createElement('div');
							var h4 = document.createElement('h4');
							var p = document.createElement('p');
						 

						var moreFooterDiv = document.createElement('div');
							var a = document.createElement('a');


		// ------------------add classes and ids to elements 
		itemArticle.className = 'col-12 col-sm-12 col-md-9 col-lg-6';
			itemArticleInner.className = 'card movie-card';
				rowMovieDiv.className = 'rowMovieDiv row no-gutters';
				 imgDiv.className = 'imgDiv col-12 col-sm-4 col-md-4 col-lg-5 col-xl-4';
					 img.setAttribute('class', 'poster');


					textDiv.className = 'textDiv col-12 col-sm-8 col-md-8 col-lg-7 col-xl-8 d-flex flex-column justify-content-around';

						cardBodyDiv.className = 'card-body';
							h4.className = 'card-title';
							p.className = 'card-text';
							a.id = data.id;

					moreFooterDiv.className = 'card-footer';
							a.className = 'moreInfo';

		storage.movieBackground.style.display = 'none';

		// -------------------define API content for the elements 


		img.src = "https://image.tmdb.org/t/p/w500/" + data.poster_path;
		
		h4.innerText = data.title;
	   
	   // function to cut visible description text to last dot 
	   
		var cutString =  data.overview.slice(0,200);
		p.innerText = cutString.slice(0, cutString.lastIndexOf('.'))+'.';
	   
	   // events on More info link click 
	   
		a.innerText = 'More info';
		
				let id = storage.articleList.id
				
				a.addEventListener('click', 
						(function(){clearList('movie')})
						);
				a.addEventListener('click', 
						(function(){clearList('articleList')})
						);
					 
				a.addEventListener('click', 
					 
					 (function() {
						storage.movieIdClicked = this.id
						// console.log(storage.movieIdClicked)				 
						//console.log(storage.movieItem)
						})				 
					 );				 
					 
				a.addEventListener('click', 				 
					 renderMovie 				 
					 );
	   

		// -------------------------Append elements to page

		itemArticle.appendChild(itemArticleInner)
		
			itemArticleInner.appendChild(rowMovieDiv)

				rowMovieDiv.appendChild(imgDiv)
		
					imgDiv.appendChild(img)

					rowMovieDiv.appendChild(textDiv);

						textDiv.appendChild(cardBodyDiv)
							cardBodyDiv.appendChild(h4)
							cardBodyDiv.appendChild(p)

						textDiv.appendChild(moreFooterDiv)
							moreFooterDiv.appendChild(a)
 storage.list.style.display = 'block';

    return itemArticle
}



//--------------------------  About movie page


function renderMovie () {	
 //----  API request for movie by ID
		getData('movie/'+ storage.movieIdClicked, '') //--API request for deffinite movie (fetch movie id from storage.movieIdClicked parameter) 
//----  parse response body to JSON object 
        .then(function(res) {
            return res.json()
			 
        })
//----  add the result to storage object 
        .then(function(res) {
            storage.movieItem = res
            //console.log(storage.movieItem.title)
			//console.log(storage.movieItem)
			//console.log(storage.articleList)
            MovieItem()
        })
		
}
//--------------------------  create dom elements for about movie page

//--------------------------  create BACK link for user to go back to movies list
function MovieItem () {
   let backLinkDiv = document.createElement('div');
    backLinkDiv.className = 'col-12 col-sm-12 col-md-12 col-lg-12 my-3';
    let backLink = document.createElement('button');
    backLink.addEventListener('click',
        (function(){clearList('movie')})
    );
    backLink.addEventListener('click',
        ArticalList                            // надо передавать тело
    );


    backLink.className = 'btn btn-outline-info my-2 my-sm-0';
    backLink.innerText = 'Back to Movie List';


    movie.appendChild(backLinkDiv);
    backLinkDiv.appendChild(backLink);


    // -----------------------создаем переменную DOM-элементы
    let itemMovie = document.createElement('h4');
    let back_poster = document.createElement('img');
    let imgAbout = document.createElement('div');
    // console.log(imgAbout);
    let imgAboutSrc = document.createElement('img');
    let textAbout = document.createElement('div');
    let pTextAbout = document.createElement('p');
    // ------------------добавили HTML class для дальнейшей стилизации
    itemMovie.className = 'card-title';
    imgAbout.className = 'col-12 col-sm-4 col-md-4 col-lg-5 col-xl-4';
    textAbout.className = 'col-12 col-sm-8 col-md-8 col-lg-7 col-xl-8 d-flex flex-column ';
    imgAboutSrc.className = 'imgAboutSrc'
    // -------------------определяем наполнение этих элементов из API

    itemMovie.innerText = storage.movieItem.title;
    imgAboutSrc.src = 'https://image.tmdb.org/t/p/w500' + storage.movieItem.poster_path;
    pTextAbout.innerText = storage.movieItem.overview;
 //   back_poster.src = 'https://image.tmdb.org/t/p/w500' + storage.movieItem.backdrop_path;
    // -------------------------Выводим элементы на страницу

    //imgAbout.appendChild(imgAboutSrc);

    movie.appendChild(imgAbout);
    imgAbout.appendChild(imgAboutSrc);
    movie.appendChild(textAbout);
    textAbout.appendChild(itemMovie);
    textAbout.appendChild(pTextAbout);

   storage.movieBackground.style.display = 'block';
    storage.movieBackground.style.background = `url('https://image.tmdb.org/t/p/w500${storage.movieItem.backdrop_path}') no-repeat`;
    storage.movieBackground.style.backgroundSize = "cover";
   // movieBackground.style.backgroundColor
    //--------------------------  Infinite scroll  > render() while limit allows
    window.onscroll = function() {
       return null;
    };
	storage.list.style.display = 'none';
}
//--------------------------  clearList function to use on different events 
function clearList(elId)
{
    document.getElementById(elId).innerHTML = "";
}

// ----------------------------------Search movies section ---------------------------------------------------------
// -------------------------- API request to show search results


// -------------------------- Sarch Movies 
let input = document.getElementById('searchMovie');

input.oninput = function() {
    clearSearch('searchList')
       getData('search/movie', '&page=1&include_adult=false&query=' + input.value)
       .then(function(res) { return res.json()})
        .then(function(res) {
            //console.log(res)
            storage.movieList = res.results
            searchList.appendChild(MovieList())
        })
    };


function clearSearch(el){
    document.getElementById(el).innerHTML = "";
};
function clearSearchValue(el){
    document.getElementById(el).value = "";
};

function MovieList () {
    var div = document.createElement('div')
    div.className = 'MovieList'
    if (input.value) {
        storage.movieList.forEach(function (item) {
            div.appendChild(ItemMovieFromList(item));
        })
    }
    return div
};


function ItemMovieFromList(data) {
    var searchList = document.createElement('div');

    var searchListUl = document.createElement('ul');
    var searchListLi = document.createElement('li');


    var aSearch = document.createElement('a')
	
	aSearch.className = 'ItemMovieFromSearchList'
    aSearch.innerText = data.title
	let idFoundMovie = data.id
	aSearch.id = idFoundMovie;
	// ----------- clear movie description div (if any) 
			aSearch.addEventListener('click', 
					(function(){clearSearchValue('searchMovie')})
					);
			aSearch.addEventListener('click', 
					(function(){clearSearch('searchList')})
					);
			aSearch.addEventListener('click', 
					(function(){clearList('movie')})
					);

            aSearch.addEventListener('click', 
					(function(){clearList('articleList')})
					);
				 
            aSearch.addEventListener('click', 
				 
				 (function() {
					storage.movieIdClicked = this.id
					// console.log(storage.movieIdClicked)				 
					//console.log(storage.movieItem)
				})
				 
				 );				 
				 
			aSearch.addEventListener('click', 
				 
				 renderMovie 
				 
				 );		
					
            


    searchList.className = 'col-12 col-sm-12 col-md-8 input-group ';

    searchListUl.className = 'suggests-component';
   
    searchList.appendChild(searchListUl)
    searchListUl.appendChild(aSearch)
    aSearch.appendChild(searchListLi)



    return searchList
}
// }
