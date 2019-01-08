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
$(window).on('load', function (e) {  
		$('#movieBackground').hide(); 
        var validate = Validate();
        $("#listM").html(validate);
        if (validate.length == 0) {
            CallAPI(1);
        }
});
    function CallAPI(page) {
        $.ajax({
            url: "https://api.themoviedb.org/3/movie/top_rated?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=en-US&page=" + storage.page,
            data: { "api_key": "3356865d41894a2fa9bfa84b2b5f59bb" },
            dataType: "json",
            success: function (result, status, xhr) {
				storage.articleList = result["results"];
				
				console.log(storage.articleList);
                var resultHtml = $("<div class=\"row\"  id=\"articleList\">");
                for (i = 0; i < result["results"].length; i++) {
				
                    var image = storage.articleList[i]["poster_path"] == null ? "Image/no-image.png" : "https://image.tmdb.org/t/p/w500/" + storage.articleList[i]["poster_path"];
					var cutString =  storage.articleList[i].overview.slice(0,200);
					storage.articleList[i].overview  = cutString.slice(0, cutString.lastIndexOf('.'))+'.';
                    resultHtml.append("<div class=\"result col-12 col-sm-12 col-md-9 col-lg-3\" resourceId=\"" + storage.articleList[i]["id"] + "\">" 
						+ "<div class=\"card movie-card\">" 
							+"<div class=\"rowMovieDiv row no-gutters\">" 	
								+ "<div class=\"imgDiv\">" 
									+  "<img class=\"poster\" src=\"" + image + "\" />" 
									+ "</div><div class=\"overlayPoster\"><div class=\"card-body\"><h4 class=\"card-title\">" + storage.articleList[i]["title"] + "</h4><p class=\"card-text\">" + storage.articleList[i]["overview"] + "</p><p class=\"card-footer\" resourceId=\"" + storage.articleList[i]["id"] + "\">More info</p></div></div></div></div>")
                }
 
                resultHtml.append("</div>");
                $("#listM").html(resultHtml);
 
                // Paging(result["total_pages"]);
            },
            error: function (xhr, status, error) {
                $("#listM").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
        });
    }
 
    function Validate() {
        var errorMessage = "";
        if ($("#searchInput").val() == "") {
            errorMessage += "► Enter Search Text";
        }
        return errorMessage;
    }
 
    // function Paging(totalPage) {
        // var obj = $("#pagination").twbsPagination({
            // totalPages: totalPage,
            // visiblePages: 5,
            // onPageClick: function (event, page) {
                // CallAPI(page);
            // }
        // });
    // }
    $(document).ajaxStart(function () {
        $(".imageDiv img").show();
    });
 
    $(document).ajaxStop(function () {
        $(".imageDiv img").hide();
    });
	
	$("input").on('change keyup paste', function (e) {  
			
        var validate = Validate();
        $("#listM").html(validate);
        if (validate.length == 0) {
            CallAPIsearch(1);
        }
});


 function CallAPIsearch(page) {
	 var input = document.getElementById('searchMovie')
        $.ajax({
            url: "https://api.themoviedb.org/3/search/movie?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=en-US&page=1&include_adult=false&query=" + input.value,
            data: { "api_key": "1078453dc71a614c3a03d74c27fbdcb1" },
            dataType: "json",
            success: function (result, status, xhr) {
                var resultHtml = $("<div class=\"MovieList\">");
                for (i = 0; i < result["results"].length; i++) {   
                    resultHtml.append("<div class=\"col-12 col-sm-12 col-md-8 input-group \" resourceId=\"" + result["results"][i]["id"] + "\">" + "<h4 class=\"card-title\">" + result["results"][i]["title"] + "</h4></div>")
                } 
                resultHtml.append("</div>");
                $("#searchList").html(resultHtml);
 
                // Paging(result["total_pages"]);
            },
            error: function (xhr, status, error) {
                $("#searchList").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
        });
    }
