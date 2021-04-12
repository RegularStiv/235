    // 1
  	window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
	// 2
	let displayTerm = "";
	
	// 3
	function searchButtonClicked(){
		console.log("searchButtonClicked() called");

        //1
        const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

        //2
        let GIPHY_KEY = "dc6zaTOxFJmzC";

        //3 build url string
        let url = GIPHY_URL;
        url += "api_key=" + GIPHY_KEY;

        //4 parse the user entered term we wish to search
        let term = document.querySelector("#searchterm").value;
        displayTerm = term;

        //5 get rid of trailing spaces
        term = term.trim();

        //6 encode spaces and special characetrs
        term = encodeURIComponent(term);

        //7 if there is no term to search bail out the function
        if(term.length < 1)return;

        //8 append the search to the url
        url += "&q=" + term;

        //9 grab the user chosen search term to the url
        let limit = document.querySelector("#limit").value;
        url += "&limit=" + limit;

        //10 update the UI
        document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

        //11 check url
        console.log(url);

        // 12 Request data!
        getData(url);   
	}
	function getData(url){
        //1 create new xhr object
        let xhr = new XMLHttpRequest();

        //2 set onload handler
        xhr.onload = dataLoaded;

        //3 set onerror handler
        xhr.onerror = dataError;

        //4 open connection and send request
        xhr.open("GET", url);
        xhr.send();
    }
    function dataLoaded(e){
        //5 event.target is xhr object
        let xhr = e.target;

        //6 xhr.responseText is the json file we downloaded
        console.log(xhr.responseText);

        //7 turn the text into parsable JS obj
        let obj = JSON.parse(xhr.responseText);

        //8 if there are no results print a message and return
        if(!obj.data || obj.data.length == 0){
            document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'<b>";
                return;
        }

        //9 start building an HTML string we will display 
        let results = obj.data;
        console.log("results.length = " + results.length);
        let bigString = "<p><i>here are " + results.length + " results for '" + displayTerm + "'</i></p>";

        //10 loop through array of results
        for(let i = 0; i < results.length; i++){
            let result = results[i];

            //11 gte url to gif
            let smallURL = result.images.fixed_width_small.url;
            if (!smallURL) smallURL = "../images/no-image-found.png";

            //12 get the url to the giphy page
            let url = result.url;

            //13 build a div to hold each result 
            //es6 string templating
            let line = `<div class = 'result'><img src='${smallURL}' title= '${result.id}'/>`;
            line += `<span><a target = '_blank' href='${url}'>View on Giphy</a></span>`;
            line += "<br><p> Rating: " + result.rating.toUpperCase() + "</p></div>";
            //14 add the div to bigstring and loop
            bigString += line;


        }
        //15 done building the html
        document.querySelector("#content").innerHTML = bigString;

        //16 update status
        document.querySelector("#status").innerHTML = "<b>Success!</b>"
    }
    function dataError(e){
        console.log("An Error Occurred");
    }