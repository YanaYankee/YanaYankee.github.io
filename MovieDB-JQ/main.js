'use strict';
//--------------------------------------------- Storage Object -----------------------------
var s = {
	url: 'https://api.themoviedb.org/3/',
	imgUrl: 'https://image.tmdb.org/t/p/w500/',
	key: '?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=',
	curLang: 'en-US',
	curAPI: "",
	articleList: [],
	total_pages: '',
	current_page: 1,
	index: (this.current_page-1)*20+1,
	articleListLength: '',
	limit: 10,
	movieList: [],
	movieIdClicked: '',
	movieItem: {},
	movieSimilar: {},
	list : document.getElementById('listM'),
	movieBg: document.getElementById('movieBg'),
};

//--------------------------------- GET DATA FUNCTION -----------------------------------
function getData(apiName, config, render, error) {
	$.ajax({
		url: s.url + apiName + s.key +s.curLang  + config,
		dataType: "json",
		success: render,
		error: error
	});
}

//-----------------------------------------  EVENTS -----------------------------------------
$(window).on('load', function (e) {
	$('#movieBg').hide();
	s.curAPI="Grid";
	getArticleList();
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

		clearSearch("searchList");
		clearSearchValue("searchMovie");
		if(s.curLang === "en-US"){
			s.curLang = "ru-RU" ;
			langText.innerText =  "RU";
		}
		else {
			s.curLang = "en-US";
			langText.innerText =  "EN";
		}
				if(s.curAPI === "Grid"){
					$('#listM').empty();
					s.articleList=[];
					getData("movie/top_rated", '&page=' + s.current_page, toStorage , error);
				}
				else {
					movieAboutPage();
				}

			})
);
		function movieAboutPage() {
		getData("movie/"+ s.movieIdClicked, "", movieToStorage , error);
		getData("movie/"+ s.movieIdClicked + "/similar", "", similarToStorage , error);

		}
//--------------------------- More Info (about movie page) on click   -------------------------------------
$(document).on("click", ".moreInfo", (function() {
		s.movieIdClicked = this.id;
		s.curAPI="About";

		clearSearch("searchList");
		clearSearchValue("searchMovie");
		$('#listM').hide();
		$('#movieBg').show();

		movieAboutPage();
	})
);
//--------------------------- Back to movie list btn   -----------------------
$(document).on("click", "#backBtn", (function() {
		$('#movieBg').hide();
		$('#listM').show();
		getArticleList();
	})
);
//--------------------------- mouseleave   -----------------------

    $("#searchList").mouseleave(function(){
        $('.MovieList').hide();
    });

//-----------------------------------------  GRID -----------------------------------------

function getArticleList () {
	getData("movie/top_rated", '&page=' + s.current_page, toStorage , error); //API request for movie list
	s.curAPI="Grid";
};


function toStorage(result, status, xhr) {
	s.articleList = s.articleList.concat( result["results"].slice(s.index)); // add new object to existing array
	s.total_pages =  result["total_pages"];
	s.articleListLength = s.articleList.length;
	ArticalList();
};

function movieToStorage(result, status, xhr) {
	s.movieItem = result; // add new object to existing array
	moviePage();

};
function ArticalList () {

	var resultHtml = $("<div class='row'  id='articleList'>");

	for (var i = 0; i < s.articleList.length; i++) {
		var image = s.articleList[i]["poster_path"] == null ? "Image/no-image.png" : s.imgUrl + s.articleList[i]["poster_path"];
		var cutString =  s.articleList[i].overview.slice(0,200);
		s.articleList[i].overview  = cutString.slice(0, cutString.lastIndexOf('.'))+'.';
		resultHtml.append("<div class='result col-12 col-sm-12 col-md-9 col-lg-3'>"
			+ "<div class='card movie-card'>"
			+"<div class='rowMovieDiv row no-gutters'>"
			+ "<div class='imgDiv'>"
			+ "<img class='poster' src='" + image + "' />"
			+ "<div class='overlayPoster'>"
			+ "<div class='card-body'>"
			+ "<h4 class='card-title'>" + s.articleList[i]["title"] + "</h4>"
			+ "<p class='card-text'>" + s.articleList[i]["overview"] + "</p>"
			+ "<p class='card-footer'><button  class='moreInfo' id='" + s.articleList[i]["id"] + "'>More info</button></p>"
			+ "</div>"
			+ "</div>"
			+ "</div>"
			+ "</div>"
			+ "</div>"
		)
		resultHtml.append("</div>");
		$("#listM").html(resultHtml);
	}
}



// ------------------------------------------ RENDER SEARCH LIST FUNCTION -----------------------------------------------------------------

$(document).on('keyup paste', "input", function () {

	var input = document.getElementById('searchMovie');
	clearSearch('searchList');
	if (input.value!="") {
		getData("search/movie", "&page=1&include_adult=false&query=" + input.value, searchToStorage, noInput);                  //  call search render
	    }
    });

    function noInput () {
        clearSearch('searchList');
    }

    function searchToStorage(result, status, xhr) {
        s.movieList = result["results"];
        renderSearch();
    }

    function renderSearch() {

        var searchResult = $("<div class='MovieList col col-md-12'>");

        for (var i = 0; i < s.movieList.length; i++) {
            searchResult.append("<div class='col-12 col-sm-12 col-md-12 input-group ' >"
                + "<a class='moreInfo' id='"+ s.movieList[i]["id"] + "'>"
                + s.movieList[i]["title"] + "</a></div>")
        }
        searchResult.append("</div>");
        $("#searchList").html(searchResult);

    }

//-----------------------------------------  PAGE -----------------------------------------

function moviePage(){

	var imageMovie = s.imgUrl + s.movieItem["poster_path"];
	var backgroundImage = s.movieItem["backdrop_path"];
	s.movieBg.style.display = 'block';
	s.movieBg.style.background = `url('https://image.tmdb.org/t/p/w500${backgroundImage}') no-repeat`;
	s.movieBg.style.backgroundSize = "cover";
		var resultHtml = (
			"<div class='container'>"
			+ "<div class='row' id='movie'>"
                    + "<div class='col-12 col-sm-12 col-md-12 col-lg-12 my-3'>"
                    + "<button id='backBtn' class='btn btn-outline-info my-2 my-sm-0'>Back to Movie List</button>"
                    + "</div>"
			+ "<div class='col-12 col-sm-4 col-md-4 col-lg-5 col-xl-4'>"
			    +"<img class='imgAboutSrc' src='" + imageMovie + "'>"
			+ "</div>"
			+ "<div class='col-12 col-sm-8 col-md-8 col-lg-7 col-xl-8 d-flex flex-column '>"
			    + "<h4 class='card-title'>" + s.movieItem["title"] + "</h4>"
			+ "<div>"
			+ "<div class = 'rating'><svg class='score' viewBox='-25 -25 450 400'>"
                + "<circle class='score-empty'  cx='175' cy='175' r='175'> </circle>"
                + "<circle id='js-circle' class='js-circle score-circle' transform='rotate(-90 175 175)' cx='175' cy='175' r='175' style='stroke-dashoffset: 33;'></circle>"
                + "<text id = 'score-rating' class='js-text score-text' x='49%' y='51%' dx='-25' text-anchor='middle'></text></svg></div>"
                + "<div class='ratingText'>Рейтинг пользователя</div>"
			+"</div>"
                + "<p class='card-text'>" + s.movieItem["overview"] + "</p>"
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
			$("#aboutMovie").html(resultHtml);


	////----------------------------------------- Circle radius, diameter and offset function	

		var circle = document.getElementById("js-circle");
		var text 	= document.getElementById("score-rating");
		var radius = circle.getAttribute("r");
		var diameter = Math.round(Math.PI * radius * 2);
		var getOffset = (val = 0) => Math.round((100 - val) / 100 * diameter);

		var val = s.movieItem.vote_average*10;

		var roundRating = document.getElementById("score-rating");
		roundRating.innerText =  s.movieItem["vote_average"]*10 + '%';

		var run = () => {
			circle.style.strokeDashoffset = getOffset(val);
			text.textContent = `${val}%`
		};
		run();
	}


// ------- similar films -----------------------------------------
	function similarToStorage(result, status, xhr) {
		s.movieSimilar = result['results']; // add new object to existing array
		movieSimilar();
	}

	function movieSimilar() {

		var resultHtml=  $("<div class=\"carousel-items\">");

		for (var i = 0; i < s.movieSimilar.length; i++) {

			var image = s.movieSimilar[i]["poster_path"] == null ? "Image/no-image.png" : "https://image.tmdb.org/t/p/w500/" + s.movieSimilar[i]["poster_path"];
			resultHtml.append(
				"<div class=\"carousel-block\" >"
				+ "<img id='"+ s.movieSimilar[i]["id"] +"' src='" + image + "' class='poster img-fluid moreInfo'/>"
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



