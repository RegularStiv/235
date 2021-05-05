    //starts at no offset
    let offset = 0;
    //initiates result array
    let results = [1];

    // 2
	let displayTerm = "Trending";

    // 1
    //sets the onload to the loading function
  	window.onload = loading;

    //loading function
    function loading(){
        //sets onclicks when the window loads in 
        document.querySelector("#search").onclick = searchButtonClicked;
        document.querySelector("#next").onclick = loadNext;
        document.querySelector("#prev").onclick = loadPrev;
        //gets the values from the localstorage 
        document.querySelector("#searchterm").value = localStorage.getItem("input");
        document.querySelector("#limit").value = localStorage.getItem("limit");
        //calls the trending load 
        trendingLoad();
    }
    //on load the trending gifs are loaded in
    function trendingLoad(value = 0){
        
        //gets the base of the url set up using the trending and the api key
        const trendingURL = "https://api.giphy.com/v1/gifs/trending?";
        let GIPHY_KEY = "erug7Gvxs1ltmEe7bBJXM9pWz2LJ2Gwd";
        let url = trendingURL;
        url += "api_key=" + GIPHY_KEY;

        // limit equals the value of the limit area and is added to the url
        let limit = document.querySelector("#limit").value;
        url += "&limit=" + limit;

        //offset is added to the url 
        value += offset;
        url += "&offset=" + value;

        //calls getdata to set up the gifs
        getData(url);
        
    }
	
	// 3
	function searchButtonClicked(value = 0){
        
        //resets the offset if the search term is different 
        if(document.querySelector("#searchterm").value != localStorage.getItem("input"))
        {
            offset = 0;
        }

        //1
        const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

        //2
        let GIPHY_KEY = "erug7Gvxs1ltmEe7bBJXM9pWz2LJ2Gwd";

        //3 build url string
        let url = GIPHY_URL;
        url += "api_key=" + GIPHY_KEY;

        //4 parse the user entered term we wish to search
        let term = document.querySelector("#searchterm").value;
        displayTerm = term;

        //sets values of search term and limit value
        const inputValue =  document.querySelector("#searchterm").value;
        const limitVlaue = document.querySelector("#limit").value;

        //ends function if input is null
        if(!inputValue) return;


        //sets value of localstorage
        localStorage.setItem("input", inputValue);
        localStorage.setItem("limit", limitVlaue);

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

        url += "&offset=" + value;
        //10 update the UI
        document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

        //11 check url
        document.querySelector("#next").onclick = nextClick;
        document.querySelector("#prev").onclick = prevClick;

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
        //console.log(xhr.responseText);

        //7 turn the text into parsable JS obj
        let obj = JSON.parse(xhr.responseText);

        //8 if there are no results print a message and return
        if(!obj.data || obj.data.length == 0){
            document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'<b>";
                return;
        }

        //9 start building an HTML string we will display 
        results = obj.data;
        //console.log("results.length = " + results.length);
        //let bigString = "<p><i>here are " + results.length + " results for '" + displayTerm + "'</i></p>";
        //let pageNumber = 1 + (offset/ parseInt(document.querySelector("#limit").value));
        //bigString += "<p><i>Showing page "+ pageNumber+"</i></p>";
        //10 loop through array of results
        let bigString = ""; 
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
            line += `<br><span><a target = '_blank' class = "copy-text" href='${url}'>copy</a></span>`;
            
            line += "<p> Rating: " + result.rating.toUpperCase() + "</p></div>";
            //14 add the div to bigstring and loop
            bigString += line;
            
        }
        

            
        //15 done building the html
        document.querySelector("#content").innerHTML = bigString;
        
        // makes array of all divs that have the class copytext
        let allCopies  = document.querySelectorAll('.copy-text');
        //goes through the array
        for(let i = 0; i < allCopies.length ; i++)
        {
            //makes a variable to store the current copy
            let currentCopy = allCopies[i];

            //sets the onclick to this function
            currentCopy.onclick = function(e){
                //stops opening the link
                e.preventDefault();

                // the text to copy is this object's href
                let copyText = this.href;

                //sets up the clipboard copy
            document.addEventListener('copy', function(e){
                //sets the clipboard data
                e.clipboardData.setData('text/plain',copyText);
                //stops the default so the copy to clipboard takes place
                e.preventDefault();
            },true);
            // makes the copy to clipboard happen
            document.execCommand('copy');
            //pop up saying that the link has been copied
            alert('copied to clipboard');
        };
    }
        //16 update status
        document.querySelector("#status").innerHTML = "<b>Success!</b>";

        
    }
    function dataError(e){
        console.log("An Error Occurred");
    }


    // functions to make the next and previous buttons work
    function nextClick(){
        //if there aren't the max amount of results dont add to offset
        
        if(parseInt(document.querySelector("#limit").value) == results.length && parseInt(document.querySelector("#searchterm").value) != "" )
        {
            //add offset to make a different page
            offset += parseInt(document.querySelector("#limit").value);
            searchButtonClicked(offset);
        }
    }
    //next buttons for the trending gifs onload
    function loadNext(){
        // adds the offset and recalls the loading trend
        offset += parseInt(document.querySelector("#limit").value);
        trendingLoad();
    }

    function loadPrev(){
        if(offset > 0){
            //subtract offset to get a previous page 
            offset -= parseInt(document.querySelector("#limit").value);
            trendingLoad();
        }
    }

    function prevClick(){
        //if not first page do this
        if(offset > 0){
        //subtract offset to get a previous page 
        offset -= parseInt(document.querySelector("#limit").value);
        searchButtonClicked(offset);
        }
    }
    