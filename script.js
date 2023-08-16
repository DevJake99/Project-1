var submitButton = $("#submitButton");
var hotList = $(".hotList");
var myList = $(".myList");
var watchList = $(".watchList");
var watchListButton = $("#watchListButton");
var cryptoFeaturedImage = $(".featuredCryptoItemImage");
var cryptoFeaturedName = $(".featuredCryptoItemHeader");
var cryptoFeaturedPercentChange = $(".featuredCryptoItemPercentChange");
var cryptoFeaturedPrice = $(".featuredCryptoItemPrice");
var featuredCryptoImageLinks = [];
var featuredCryptoNames = [];
var featuredCryptoImageChangePercents = [];
var featuredCryptoImagePrice = [];
var searchValue;
var coinID;
var coinNews;

function switchToHotList() {
    myList.removeClass("visible");
    myList.addClass("hidden");
    hotList.removeClass("hidden");
    hotList.addClass("visible");
    //make the hotList button a darker shade to indicate it's selected
}

function switchToMyList() {
    hotList.removeClass("visible");
    hotList.addClass("hidden");
    myList.removeClass("hidden");
    myList.addClass("visible");
    //make the myList button a darker shade to indicate it's selected
}


function getCoinInfoWithID (response) {
    var requestURL = "https://api.coingecko.com/api/v3/coins/markets?ids=" + coinID + "&vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
    fetch (requestURL)
      .then (function (response) {
        return response.json();
      })
      .then (function (data) {
        for (var i = 0; i < data.length; i++) {
          console.log(data[i]);
          //currently loggiin the ID info
          //here I get to decide what I want to do with the coin's info...
        }
      })
  }


function getCoinID (response) {
  var requestURL = "https://api.coingecko.com/api/v3/coins/list";
  fetch (requestURL) 
      .then (function (response) {
          return response.json();
      })
      .then (function (data) {
          for (var i = 0; i < data.length; i ++) {
                if (searchValue == (data[i].id).toLowerCase()) {
                    coinID = data[i].id;
                    console.log(coinID);
                }
          }
      })
}


function finnHub (response) {
    var requestURL = "https://finnhub.io/api/v1/news?category=crypto&token=cjapurpr01qji1gtr6mgcjapurpr01qji1gtr6n0";
    fetch (requestURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            for (var i = 0; i < data.length; i++)  {
                var theSummary = (data[i].summary).toLowerCase();
                var theHeadline = (data[i].headline).toLowerCase();
                if ((theSummary).includes(coinID) || (theHeadline).includes(coinID)) {
                    //save data[i] to the array
                    //next I need to create a function that displays the array to the news Section
                    //I can do this within FinnHub... probably wise to do this within FinnHub too...
                }
            }
            }
        )
};




function retrieveTrendingCryptoData (response) {
    var requestURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
    fetch (requestURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            for (var i = 0; i < 4; i++)  {
                console.log(data[i].image);
                featuredCryptoImageLinks.push(data[i].image);
                featuredCryptoNames.push(data[i].name);
                featuredCryptoImageChangePercents.push(data[i].price_change_percentage_24h);
                var currentPrice = (data[i].current_price).toLocaleString(undefined, {minimumFractionDigits: 2});
                featuredCryptoImagePrice.push(currentPrice);
            }
            }
        )
};

function populateTrendingCrypto () {
    for (var i = 0; i < 4; i++) {
        var imageLink = featuredCryptoImageLinks[i];
        console.log(imageLink);
        $(cryptoFeaturedImage[i]).attr("src", imageLink);
        $(cryptoFeaturedName[i]).text(featuredCryptoNames[i]);
        $(cryptoFeaturedPercentChange[i]).text(featuredCryptoImageChangePercents[i]);
        $(cryptoFeaturedPrice[i]).text("$" + featuredCryptoImagePrice[i]);
    }
} 

$(window).on("load", function() {
  retrieveTrendingCryptoData();
  setTimeout(populateTrendingCrypto, 2000);
});
//when the window loads, this function is ran once...


submitButton.on("click", function (event) {
    event.preventDefault();
    searchValue = $("#searchValue").val();
    getCoinID();

    var srd = $("#searchResultsDiv");
    var coinImg = document.createElement("img");
    var coinSym = document.createElement("a");
    var coinName = document.createElement("h2");
    var coinPrice = document.createElement("a");

    var requestURL = "https://api.coingecko.com/api/v3/coins/list";
    fetch (requestURL) 
    .then (function (response) {
        return response.json();
    })
    .then (function (data) {
        for (var i = 0; i < data.length; i ++) {
            if (searchValue == (data[i].id).toLowerCase()) {
                var coinID = data[i].id;
                //$(coinName).innerHTML(coinID.val);
                srd.appendChild(coinName);
                console.log(coinName);
            }
        }
    })

    //$(coinImg).attr("src","event.")

    //getCoinID is taking too long to retrieve the ID, need to set a timeout on getCoinInfoWithID() to make sure
    //getCoinID gets the ID before calling it
    setTimeout(getCoinInfoWithID, 1000);
    setTimeout(finnHub, 3000);
    retrieveTrendingCryptoData();
})




watchListButton.on("click", function () {
    watchList.removeClass("disappear");
    watchList.addClass("appear");
})

document.addEventListener("click", function (event) {
    clicked = event.target;
    if (clicked.matches("#watchListButtonText") == false && clicked.matches(".watchList") == false && clicked.matches(".child") == false && clicked.matches(".grandChild") == false && clicked.matches(".greatGrandChild") == false || clicked.matches("#exitButton") == true ) {
        watchList.removeClass("appear");
        watchList.addClass("disappear");
    }
    watchListButton.addClass("visible");
});