	"use strict";
//--------------------------------------------- Storage Object -----------------------------
	var s = {
		url: "https://api.themoviedb.org/3/",
		imgUrl: "https://image.tmdb.org/t/p/w500",
		key: "?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=",
		xhrUrl: "",
		curLang: "en-US",
		curAPI: "",
		articleList: [],
		total_pages: "",
		current_page: 1,
		current_genre: 1,
		index: (this.current_page-1)*20+1,
		articleListLength: "",
		limit: 10,
		movieList: [],
		genresList: [],
		movieIdClicked: "",
		mediaTypeClicked: "",
		mediaIcon : "",
		movieItem: {},
		movieSimilar: {},
		gte: "",
		lte: "",
		list : document.getElementById("listM"),
		movieBg: document.getElementById("movieBg"),
		en: {"search":"Search","info":"More info","rating": "Users' rating","release":"Release date","back":"Back to Movie List ","genres":"By Genres", "all_genres":"All Genres","less":"Less"},
		ru: {"search":"Поиск", "info":"Подробнее","rating": "Рейтинг пользователя", "release":"Дата релиза", "back":"Обратно к списку фильмов", "genres":"По жанрам",  "all_genres":"Все жанры","less":"Меньше"}
	};

//--------------------------------- GET DATA FUNCTION -----------------------------------
	function getData(apiName, config, render, error) {
		s.xhr = $.ajax({
			url: s.url + apiName + s.key +s.curLang  + config,
			beforeSend: function(){s.xhrUrl = s.url + apiName + s.key +s.curLang  + config},
			dataType: "json",
			//resourceId: resourceId,
			success: render,
			error: error
		});
	}

//-----------------------------------------  EVENTS -----------------------------------------
	$(window).on('load', function (e) {
		renderSearchInput();
		
		var d = new Date();

		var y = d.getFullYear()
		var m = d.getMonth()+1
		var day = d.getDate()
		s.gte = y+'-'+m+'-'+day;
		//s.lte = y+'-'+m+'-'+ (day+7); causes 502, wrong date count

		$('#movieBg').hide();
		
		getArticleList();	
		s.curAPI="Grid";
	});

//--------------------------- Infinite Scroll  -------------------------------------
	$(window).on('scroll', function() {
		var d = document.documentElement;
		var offset = d.scrollTop + window.innerHeight;
		var height = d.offsetHeight;
		if (offset === height) {s.current_page++;
			if (s.current_page < s.limit) {	getArticleList () }
		}
	});
//--------------------------- Change language on click  -----------------------------------------
$(document).on("click", ".curLang", (function() {
			var langText = document.querySelector(".curLang");
			var text = document.querySelector(".headerSearchName");
			clearSearch("searchList");
			clearSearchValue("searchMovie");
		
			if(s.curLang === "en-US"){
				s.curLang = "ru-RU" ;
				langText.innerText =  "RU";
				//text.textContent = s.ru.search
			}
			else {
				s.curLang = "en-US";
				langText.innerText =  "EN";
				//text.textContent = s.en.search
			}
				if(s.curAPI === "Grid"){
					$('#listM').empty();
					s.articleList=[];
					getData("discover/movie", 'primary_release_date.gte='+s.gte+'&primary_release_date.lte='+'&sort_by=popularity.desc&page=' + s.current_page, toStorage , error); //API request for movie list
				}
				else if(s.curAPI === "Discover"){
					$('#listM').empty();
					s.articleList=[];
					getData("discover/movie", '&page=' + s.current_page + '&with_genres=' + s.current_genre, genreToStorage , error); 								
				}				
				else {
					movieAboutPage();
				}
			})
	);
	
		
		//--------------------------------- TRANSLATE certain strings -----------------------------------
	function translation(n){
		if ( s.curLang === 'en-US') {
			return s.en[n]
		}
		else {return s.ru[n] }
	}

//--------------------------- Back to movie list btn   -----------------------
	$(document).on("click", "#backBtn", (function() {
			$('#movieBg').hide();
			$('#listM').show();
			getArticleList();
		})
	);
//--------------------------- Label btn   -----------------------
$(document).on("click", ".label", (function() {
		$('#movieBg').hide();
		$('#listM').show();
		s.current_genre = this.id;
		getArticleListByLabel();
	})
);
//--------------------------- mouseleave   -----------------------
    $("#searchList").mouseleave(function(){
        $('.MovieList').hide();
    });
//-----------------------------------------  GRID -----------------------------------------

	function getArticleList () {
		getData("discover/movie", 'primary_release_date.gte='+s.gte+'&primary_release_date.lte='+s.lte+'&sort_by=popularity.desc&page=' + s.current_page, toStorage , error); //API request for movie list
		s.curAPI="Grid";
		
	};
	function getGenreList () {
		getData("genre/movie/list", "", genresToStorage , error); //API request for movie list
		
		
		//	https://api.themoviedb.org/3/genre/movie/list?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=en-US
	};

	function toStorage(result, status, xhr) {
		console.log(s.xhrUrl)
		s.articleList = s.articleList.concat( result["results"].slice(s.index)); // add new object to existing array
		s.total_pages =  result["total_pages"];
		s.articleListLength = s.articleList.length;
		ArticalList();
	};

	function genresToStorage(result, status, xhr) {
		console.log(s.xhrUrl)
		s.genresList = result["genres"]; 
		GenresList(7)
	};
	
	function GenresList(number) {
	
	var resultHtml = $("<div class='row   no-gutters'  id='genresList'><span class='text-info my-2 mr-3 '>"+ translation("genres") +"</span>");		
					
        for (var n = 0; n < number; n++) {
			
			var name = s.genresList[n]["name"]
			
            resultHtml.append("<a id='"+ s.genresList[n]["id"] + "' class='label my-1 genre badge badge-info'>"
                + name + "</a>"	);							
				
        }
        resultHtml.append("<a id='allGenres' class='text-info my-2 underlined'>"+ translation("all_genres") +"</a></div>");	
		$("#genresListContainer").html(resultHtml);		
		
		
    }
	
	
	function ArticalList () {


		var resultHtml = $("<div class='row'  id='articleList'>");
				getGenreList()
			resultHtml.append("<div id='genresListContainer' class='container my-3 small'></div>");
			
		for (var i = 0; i < s.articleList.length; i++) {
			var image = s.articleList[i]["poster_path"]
			if (image == null){image = "img/no-image.gif"}   else {image = s.imgUrl + s.articleList[i]["poster_path"]}		
			
			var cutString =  s.articleList[i].overview.slice(0,200);
			s.articleList[i].overview  = cutString.slice(0, cutString.lastIndexOf('.'))+'.';
			resultHtml.append("<div class='result col-12 col-sm-12 col-md-3'>"
				+ "<div class='card movie-card'>"
					+"<div class='rowMovieDiv row no-gutters'>"
						+ "<div class='imgDiv'>"
							+ "<img class='poster img-fluid img-responsive' src='" + image + "' />"
						+ "<div class='overlayPoster '>"
				+ "<div class='card-body '>"			
					+ "<h5 class='card-title'>" + s.articleList[i]["title"] + "</h5>"
					+ "<p class='card-text'>" + translation("release")+ ": " + s.articleList[i].release_date.slice(0,4) + "</p>"
				//+ "<p class='card-text'>" + s.articleList[i]["overview"] + "</p>"
					+ "<p class='card-footer'>"
					+"<button class='moreInfo " + s.mediaTypeClicked + " btn btn-outline-info' id='" + s.articleList[i]["id"] + "'>"+translation("info")+"</button></p>"
						+ "</div>"
					+ "</div>"
				+ "</div>"
				+ "</div>"
				+ "</div>"
			)
			//s.mediaTypeClicked  = this.className;
			resultHtml.append("</div>");
			$("#listM").html(resultHtml);
		}
	}
	$(document).on("click", "#allGenres", (function() {
			GenresList(s.genresList.length)
			$('#allGenres').html(translation("less"));
			$('#allGenres').attr('id', 'collapse');
			
		})
	);
	$(document).on("click", "#collapse", (function() {
		GenresList(7);
		$('#collapse').html(translation("all_genres"));
		$('#collapse').attr('id', 'allGenres');
				
	})
	);	
	
//-----------------------------------------  DISCOVER -----------------------------------------

	function getArticleListByLabel () {
		getData("discover/movie", '&page=' + s.current_page + '&with_genres=' + s.current_genre, genreToStorage , error); 
		s.curAPI="Discover";
	};
	// https://api.themoviedb.org/3/discover/movie?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=en-US&with_genres=18&sort_by=popularity.desc

	function genreToStorage(result, status, xhr) {
		console.log(s.xhrUrl)
		s.articleList = [];
		s.articleList = s.articleList.concat( result["results"].slice(s.index)); // add new object to existing array
		s.total_pages =  result["total_pages"];
		s.articleListLength = s.articleList.length;
		ArticalList();
	};

// ------------------------------------------ SEARCH LIST FUNCTION -----------------------------------------------------------------

	function renderSearchInput(){
		var searchInput = $("<div class='row my-4'>	");
			searchInput.append(  
			"<div class='col-5 headerSearchName'></div>"+
           " <div class='col-10 col-md-5 '><div class='input-group mb-3'><input id='searchMovie' class='form-control' type='text' name = 'keyword-input' value='' placeholder = '" +
			translation("search")+
			"'/>"+ 
             "<div class='col-12 mt-5' id='searchList'></div>"+			
            "</div></div>"+
			"<div class='col-2'>"+
				"<button type='button' class='curLang btn btn-info'>EN</button>"+
				"</div>" 
				)
		searchInput.append( "</div>")
		 $("#searchInput").html(searchInput);
	}
	
	$(document).on('keyup paste', "input", function () {

	var input = document.getElementById('searchMovie');
	clearSearch('searchList');
	if (input.value!="") {
		getData("search/multi", "&page=1&include_adult=false&query=" + input.value, searchToStorage, noInput);                  //  call search render
	    }
    });
//trending/{media_type}/{time_window}
    function noInput () {
        clearSearch('searchList');
    }

    function searchToStorage(result, status, xhr) {
        s.movieList = result["results"];
        renderSearch();
    }
    
	
	function renderSearch() {		
		
        var searchResult = $("<div class='MovieList col col-md-12'>");
		
        for (var n = 0; n < s.movieList.length; n++) {
			if ( s.movieList[n]["media_type"] === "movie"){ s.mediaIcon = "fas fa-film"}
					else if (s.movieList[n]["media_type"] === "tv"){ s.mediaIcon = "fas fa-tv mr-1"  }
					else if (s.movieList[n]["media_type"] === "person"){ s.mediaIcon ="far fa-user" }
					else { s.mediaIcon = "fas fa-search" }
			//if (s.movieList[i]["media_type"]){}
			var name = s.movieList[n]["name"]
			if (name===undefined){name = s.movieList[n]["title"]} 
			
            searchResult.append("<div class='col-12'>"
			+"<i class='mr-3 "+ s.mediaIcon + "'></i><a class='moreInfo "+ s.movieList[n]["media_type"] + "' id='"+ s.movieList[n]["id"] + "'>"
                + name + "</a></div>"	);										
				
        }
        searchResult.append("</div>");
        $("#searchList").html(searchResult);			
    }	

	//--------------------------- More Info (about movie page) on click   -------------------------------------
	$(document).on("click", ".moreInfo", (function() {
		if (event.keyCode === 13) {
    // Trigger the button element with a click
    document.getElementById(this.id).click();
			}
			s.movieIdClicked = this.id;
			s.curAPI="About";
			s.mediaTypeClicked  = this.className;
			console.log(this.className);
			clearSearch("searchList");
			clearSearchValue("searchMovie");
			$('#listM').hide();
			$('#movieBg').show();
		if (s.mediaTypeClicked === "moreInfo tv") {
				tvAboutPage();
					} else if (s.mediaTypeClicked === "moreInfo person") {
						castAboutPage();
					}else { movieAboutPage(); }
			})
	);	

//-----------------------------------------  PAGE -----------------------------------------
	function movieAboutPage() {
		getData("movie/"+ s.movieIdClicked, "", movieToStorage , error);		
		}
		function castAboutPage() {
		getData("person/"+ s.movieIdClicked, "", personToStorage , error);		
		}
		function tvAboutPage() {
		getData("tv/"+ s.movieIdClicked, "", tvToStorage , error);		
		}

	function movieToStorage(result, status, xhr) {
		console.log(s.xhrUrl)
		s.movieItem = result; // add new object to existing array
	//	moviePage();
	aboutPage(s.movieItem["poster_path"],s.movieItem["backdrop_path"],s.movieItem["title"],s.movieItem["overview"],s.movieItem["vote_average"])
		getData("movie/"+ s.movieIdClicked + "/similar", "", similarToStorage , error);
		s.mediaTypeClicked = "movie";
	};
	function personToStorage(result, status, xhr) {
		console.log(s.xhrUrl)
		s.movieItem = result; // add new object to existing array
	//	personPage();
	aboutPage(s.movieItem["profile_path"],"",s.movieItem["name"],s.movieItem["biography"], s.movieItem["popularity"])
		//discover/movie?with_genres=35&with_cast=23659&sort_by=revenue.desc
		getData("discover/movie", "&with_cast=" + s.movieIdClicked, similarToStorage , error);
		s.curAPI = "Person";
	};
	function tvToStorage(result, status, xhr) {
		console.log(s.xhrUrl)
		s.movieItem = result; // add new object to existing array
	//	personPage();
	aboutPage(s.movieItem["poster_path"],s.movieItem["backdrop_path"],s.movieItem["name"],s.movieItem["overview"],'')
		getData("tv/"+ s.movieIdClicked + "/similar", "", similarToStorage , error);
	};


function aboutPage(iPath, bPath, title, info, rate){
	var thumb = iPath;
		if (thumb == null){thumb = "img/no-image.gif"}   else {thumb = s.imgUrl + iPath}//s.movieItem["poster_path"]
	
	var bImage = s.imgUrl + bPath;  //s.movieItem["backdrop_path"]
	//console.log(s.imgUrl)
	console.log(bImage)
	if ( $(window).width() < 600) {      
		  thumb = bImage;
		  bImage = '';
		} 
	
	s.movieBg.style.display = "block";
	s.movieBg.style.background = "url('" +bImage + "') no-repeat"; //`url('https://image.tmdb.org/t/p/w500${bImage}') no-repeat`;
	s.movieBg.style.backgroundSize = "cover";
		var resultHtml = (
			"<div class='container'>"
			+ "<div class='row' id='movie'>"
                    + "<div class='col-12 col-sm-12 col-md-12 col-lg-12 my-3'>"
                    + "<button id='backBtn' class='btn btn-outline-info my-2 my-sm-0'>"+translation("back")+"</button>"
                    + "</div>"
			+ "<div class='col-12 col-sm-4 col-md-4 col-lg-5 col-xl-4'>"
			    +"<img class='imgAboutSrc' src='" + thumb + "'>"
			+ "</div>"
			+ "<div class='col-12 col-sm-8 col-md-8 col-lg-7 col-xl-8 d-flex flex-column '>"
			    + "<h4 class='card-title mt-3 mt-md-1'>" + title + "</h4>"//s.movieItem["title"]
			+ "<div class = 'icon my-2'>"
			+ "</div>"
                
                + "<p class='card-text'>" + info + "</p>"//s.movieItem["overview"]
                + "<div id='genres'></div>"
                + "<div id='release'></div>"
			+ "</div>"
			+ "</div>"
			+ "</div>"
                + "<div id = 'similar'>"
                    +"<div class='carousel shadow'>" +
                    "<div class='carousel-button-left'>" +
                    "<a href='#'></a></div>" +
                    "<div class='carousel-button-right'><a href='#'></a></div>" +
                    "<div class='carousel-wrapper'>"
			+ "</div></div></div>"
		);
	
		if (s.mediaTypeClicked === "moreInfo person" ) {
			$("#aboutMovie").html(resultHtml);
			} else {
			$("#aboutMovie").html(resultHtml);
			rating(s.vote_average);	
			genresHTML();		
			releaseHTML();
			}	
	}	
	   
	function rating(vote) {
	////----------------------------------------- Circle radius, diameter and offset function	
		var resultHtml = ( 
				"<div class = 'rating'> <svg class='score' viewBox='-25 -25 450 400'>"
                + "<circle class='score-empty'  cx='175' cy='175' r='175'> </circle>"
                + "<circle id='js-circle' class='js-circle score-circle' transform='rotate(-90 175 175)' cx='175' cy='175' r='175' style='stroke-dashoffset: 33;'></circle>"
                + "<text id = 'score-rating' class='js-text score-text' x='49%' y='51%' dx='-25' text-anchor='middle'></text></svg>"
				+"</div>"
				+ "<div class='ratingText'>"+translation("rating")+"</div>"
				
		)
		$(".icon").html(resultHtml);
			var val = 0
			var circle = document.getElementById("js-circle");
			var text 	= document.getElementById("score-rating");
			var radius = circle.getAttribute("r");
			var diameter = Math.round(Math.PI * radius * 2);
			var getOffset = function(val) {return Math.round((100 - val) / 100 * diameter)}
			

			var val = s.movieItem.vote_average*10;

			var roundRating = document.getElementById("score-rating");
			roundRating.innerText =  vote*10 + '%';

			var run = function() {
				circle.style.strokeDashoffset = getOffset(val);
				return text.textContent = val + "%"
			};
			run();		
		} 

	// ------------------------- genres -------------------------------------

function genresHTML(){
	var genresHTML = $("<ul>");
		
        for (var i = 0; i < s.movieItem.genres.length; i++) {
			console.log(s.movieItem.genres.length);
            genresHTML.append(
                "<li id='" + s.movieItem.genres[i]["id"] +"' class='label genre badge badge-info my-2'>" + s.movieItem.genres[i]["name"] + "</li>"
            )
        }
        genresHTML.append("</ul>");
		$("#genres").html(genresHTML);
        
}
        // ------------------------- release date -------------------------------------
		function releaseHTML(){
        var releaseHTML = $("<div>");
        releaseHTML.append(
            "<div  class='text-light font-size-1.2em'>"+ translation('release')+ ": <span class='font-weight-bold'>" + s.movieItem.release_date + "</span>" +
            "</div>"
        );
		$("#release").html(releaseHTML);
				
	}


// ------- similar films -----------------------------------------
	function similarToStorage(result, status, xhr) {
		s.movieSimilar = result['results']; // add new object to existing array
		
		if (s.movieSimilar.length == 0){ $("#similar").hide();};
		console.log(s.movieSimilar );
		movieSimilar();
	}

	function movieSimilar() {

		var resultHtml=  $("<div class=\"carousel-items\">");

		for (var i = 0; i < s.movieSimilar.length; i++) {

			var image = s.movieSimilar[i]["poster_path"] == null ? "img/no-image.gif" : "https://image.tmdb.org/t/p/w500/" + s.movieSimilar[i]["poster_path"];
			resultHtml.append(
				"<div class=\"carousel-block\" >"
				+ "<img id='"+ s.movieSimilar[i]["id"] +"' src='" + image + "' class='poster img-fluid moreInfo '/>"
				+   "</div>");
			}

		resultHtml.append("</div>");

		$(".carousel-wrapper").html(resultHtml);
	}
// ------------------------------------- Carousel -----------------------------------
    $(document).on('click', ".carousel-button-right",function(){
        var carusel = $(this).parents('.carousel');
        right_carusel(carusel);
        return false;
    });

    $(document).on('click',".carousel-button-left",function(){
        var carusel = $(this).parents('.carousel');
        left_carusel(carusel);
        return false;
    });
    function left_carusel(carusel){
        var block_width = $(carusel).find('.carousel-block').outerWidth();
        $(carusel).find(".carousel-items .carousel-block").eq(-1).clone().prependTo($(carusel).find(".carousel-items"));
        $(carusel).find(".carousel-items").css({"left":"-"+block_width+"px"});
        $(carusel).find(".carousel-items .carousel-block").eq(-1).remove();
        $(carusel).find(".carousel-items").animate({left: "0px"}, 200);

    }
    function right_carusel(carusel){
        var block_width = $(carusel).find('.carousel-block').outerWidth();
        $(carusel).find(".carousel-items").animate({left: "-"+ block_width +"px"}, 200, function(){
            $(carusel).find(".carousel-items .carousel-block").eq(0).clone().appendTo($(carusel).find(".carousel-items"));
            $(carusel).find(".carousel-items .carousel-block").eq(0).remove();
            $(carusel).find(".carousel-items").css({"left":"0px"});
        });
    }

    $(function() {
    //	auto_right('.carousel:first');
    })
    function auto_right(carusel){
        setInterval(function(){
            if (!$(carusel).is('.hover'))
                right_carusel(carusel);
        }, 1000)
    }

    $(document).on('mouseenter', '.carousel', function(){$(this).addClass('hover')})

    $(document).on('mouseleave', '.carousel', function(){$(this).removeClass('hover')})

////----------------------------------------- Service functions
	function clearSearch(el){
		document.getElementById(el).innerHTML = "";
	};

	function clearSearchValue(el){
		document.getElementById(el).value = "";
	};


// ------------------------------------------ STATUS ERROR FUNCTION -----------------------------------------------------------------
	function error(xhr, status, error) {
		$("#listM").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
	}
	
	$(document).ajaxStart(function () {
        $(".loader img").show();
    });

    $(document).ajaxStop(function () {
        $(".loader  img").hide();
    });

	
	
	
	
 


