(function () {
    var nextUrl;

    

    $("#go").on("click", function () {
        $.ajax({
            url: "https://spicedify.herokuapp.com/spotify",
            method: "GET",
            data: {
                query: $("input").val(),
                type: $("select").val()
            },
            success: function (data) {
                data = data.albums || data.artists;

                // option #1 - you can store what the fn returns in a variable and pass that variable to the html method
                var generatedHtml = generateResultsHtml(data.items);
                $("#results-container").html(generatedHtml);

                setNextUrl(data.next);

                if(location.search === "?scroll=infinte") {
                    // hide the more button
                    $("#more").css({"visibility" : "hidden"});
                    // check if the user scrolls near the page bottom
                    checkScrollPos();
            
                }  
            }
        });
    });

    function checkScrollPos() {
        var x = $(document).scrollTop() ; // the displacement from  document top due to scrolling
        var wH = $(window).height(); // the screen height constant value 
        var dH = $(document).height(); // the whole page height including the hidden bottom constant value
        // the bottom is reached once : x + wH = dH

        setTimeout(function() {
            if(dH - wH - x <= 500) {
                //trigger 2nd ajax request
                secondAjax();
            } else {
                // call this function again to re-check if bottom reached 
                checkScrollPos();
            }
        }, 500);
    }

    $("#more").on("click", function () {
        secondAjax();
    });

    function secondAjax() {
        $.ajax({
            url: nextUrl,
            method: "GET",
            success: function (data) {
                data = data.albums || data.artists;

                // option #2 - you can call the generateResultsHtml function directly inside append
                $("#results-container").append(generateResultsHtml(data.items));

                setNextUrl(data.next);

                if(location.search === "?scroll=infinte") {
                    // hide the more button
                    $("#more").css({"visibility" : "hidden"});
                    // check if the user scrolls near the page bottom
                    checkScrollPos();
            
                } 
            }
        });
    }

    function setNextUrl(next) {
        nextUrl =
            next &&
            next.replace(
                "https://api.spotify.com/v1/search",
                "https://spicedify.herokuapp.com/spotify"
            );
    }

    function generateResultsHtml(items) {
        
        var html = "";
        for (var i = 0; i < items.length; i++) {
            var img = "default.jpg";
            if (items[i].images[0]) {
                img = items[i].images[0].url;
            }

            var extUrl = items[i].external_urls.spotify;
            // html += "<div>" + items[i].name + "</div>";
            html += "<a href="+ extUrl +"><div class='imageSearch'><img src=" + img + "></div><div class='nameSearch'>" + items[i].name + "</div></a>"

        }

        return html;
    }
})();