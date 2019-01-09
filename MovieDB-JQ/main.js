//--------------------------------------------- Storage Object -----------------------------
var storage = {
    url: "https://api.themoviedb.org/3/",
    imgUrl: "https://image.tmdb.org/t/p/w500/",
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

//-----------------------------------------  Movies List page (GRID)
$(window).on('load', function (e) {
    $('#movieBackground').hide();
    getInfo("movie/top_rated", storage.current_page, renderList, error);     // Mivie List call

});
$(window).scroll(function() {
    var d = document.documentElement;
    var offset = d.scrollTop + window.innerHeight;
    var height = d.offsetHeight;

    //console.log('offset = ' + offset);
    //console.log('height = ' + height);

    if (offset === height) {
        storage.current_page++
        if (storage.current_page < storage.limit) {
            getInfo("movie/top_rated", storage.current_page, renderList, error);
            }
    }
});
// ------------------------------------------ AJAX CALL FUNCTION -----------------------------------------------------------------
function getInfo(apiName, config, render, error) {
    $.ajax({
        url: storage.url + apiName + storage.key  +config,
        dataType: "json",
        success: render,
        error: error
    });
}


// ------------------------------------------ RENDER MOVIE LIST FUNCTION -----------------------------------------------------------------
function renderList (result, status, xhr) {

    console.log(storage.articleList);
    storage.articleList = storage.articleList.concat( result["results"]); // add new object to existing array
    storage.total_pages =  result["total_pages"];
    storage.articleListLength = storage.articleList.length;
    articleList();


    $(document).ajaxStart(function () {
        $(".imageDiv img").show();
    });

    $(document).ajaxStop(function () {
        $(".imageDiv img").hide();
    });

    $("input").on('change keyup paste', function (e) {

        var input = document.getElementById('searchMovie');
        getInfo("search/movie", "&page=1&include_adult=false&query=" + input.value, renderSearch, error);                  //  call search render

    });




    function articleList(){


        var resultHtml = $("<div class=\"row\"  id=\"articleList\">");
       // var i = (storage.current_page-1)*20;

        for (i = 0; i < storage.articleList.length; i++) {

            var image = storage.articleList[i]["poster_path"] == null ? "Image/no-image.png" : storage.imgUrl + storage.articleList[i]["poster_path"];
            var cutString =  storage.articleList[i].overview.slice(0,200);
            storage.articleList[i].overview  = cutString.slice(0, cutString.lastIndexOf('.'))+'.';
            resultHtml.append("<div class=\"result col-12 col-sm-12 col-md-9 col-lg-3\" resourceId=\"" + storage.articleList[i]["id"] + "\">"
                + "<div class=\"card movie-card\">"
                +"<div class=\"rowMovieDiv row no-gutters\">"
                + "<div class=\"imgDiv\">"
                + "<img class=\"poster\" src=\"" + image + "\" />"
                + "<div class=\"overlayPoster\">"
                + "<div class=\"card-body\">"
                + "<h4 class=\"card-title\">" + storage.articleList[i]["title"] + "</h4>"
                + "<p class=\"card-text\">" + storage.articleList[i]["overview"] + "</p>"
                + "<p class=\"card-footer\" resourceId=\"" + storage.articleList[i]["id"] + "\">More info</p>"
                + "</div>"
                + "</div>"
                + "</div>"
                + "</div>"
                + "</div>"
            )
        }

        resultHtml.append("</div>");
        $("#listM").html(resultHtml);}

}
function ArticalItem(){

}

// ------------------------------------------ RENDER SEARCH LIST FUNCTION -----------------------------------------------------------------

function renderSearch(result, status, xhr) {
    storage.movieList = result["results"];
    console.log(storage);
    var searchResult = $("<div class=\"MovieList\">");

    for (var i = 0; i < result["results"].length; i++) {
        searchResult.append("<div class=\"col-12 col-sm-12 col-md-8 input-group \" resourceId=\"" + storage.movieList[i]["id"] + "\">" + "<h4 class=\"card-title\">" + result["results"][i]["title"] + "</h4></div>")
    }
    searchResult.append("</div>");
    $("#searchList").html(searchResult);
}

// ------------------------------------------ STATUS ERROR FUNCTION -----------------------------------------------------------------
function error(xhr, status, error) {
    $("#listM").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
}