var submitButton = $("#submitButton");
var hotList = $(".hotList");
var myList = $(".myList");
var watchList = $(".watchList");
var watchListButton = $("#watchListButton");
var cryptoFeaturedImage = $(".featuredCryptoItemImage");
var cryptoFeaturedName = $(".featuredCryptoItemHeader");
var cryptoFeaturedPercentChange = $(".featuredCryptoItemPercentChange");
var cryptoFeaturedPrice = $(".featuredCryptoItemPrice");
var exitButton = $("#exitButton");
var featuredCryptoImageLinks = [];
var featuredCryptoNames = [];
var featuredCryptoImageChangePercents = [];
var featuredCryptoImagePrice = [];
var topHundredSortedByPercentChange = [];
var negativePercentChanges = [];
var searchValue;
var coinID;

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


function populateSearchedCryptoPage (response) {
    var requestURL = "https://api.coingecko.com/api/v3/coins/markets?ids=" + coinID + "&vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
    fetch (requestURL)
      .then (function (response) {
        return response.json();
      })
      .then (function (data) {
        for (var i = 0; i < data.length; i++) {
            var searchedCryptoImage = $("#searchedCryptoImage");
            console.log(data.image);
            searchedCryptoImage.attr("src", data.image)
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
    var coinPrice = document.createElement("p");
    
    var requestURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";
    fetch (requestURL) 
    .then (function (response) {
        return response.json();
    })
    .then (function (data) {
        for (var i = 0; i < data.length; i ++) {
            if (searchValue == (data[i].id).toLowerCase()) {
                var coinID = data[i].id;
                //$(coinName).innerHTML(coinID.val);
                var coinImg = $('<img />', { 
                    id: 'searchImg',
                    src: data[i].image,
                    alt: data[i].id,
                    class: "featuredCryptoItemImage"
                  });
                srd.append(coinImg);
                coinImg.addClass("searchedImg")
                srd.append(coinName);
                coinName.innerHTML = data[i].id;
                $(coinName).addClass("searchResult");
                console.log(coinName);
                srd.append(coinPrice);
                coinPrice.innerHTML = "current Price: " + "$" + data[i].current_price;
                //coinPrice.innerHTML = data[i].current_price;
                

                
            }
        }
        })



    //getCoinID is taking too long to retrieve the ID, need to set a timeout on getCoinInfoWithID() to make sure
    //getCoinID gets the ID before calling it
    setTimeout(populateSearchedCryptoPage, 1000);
    setTimeout(finnHub, 3000);
    //retrieveTrendingCryptoData();
})


watchListButton.on("click", function () { 
    var watchListClasses = watchList.attr("class").split(" ");
    console.log(watchListClasses);
    if (watchListClasses.includes("appear") == false) {
        watchList.addClass("appear");
    }
});

document.addEventListener("click", function (event) {
    clicked = event.target;
    if (clicked.matches("#exitButton") == true ) {
        console.log("hello");
        //if the watchListButton has the appear class, then you can run this
        var watchListClass = (watchList.attr("class")).split(" ");
        if (watchListClass.includes("appear") == true) {
            console.log("hello")
            watchList.removeClass("appear");
        }
    }
    //watchListButton.addClass("visible");
});


// pv code to display Market Update Info
const marketUpdateContainer = document.getElementById("market-update");

// API URL
const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';


// Function to fetch market update data from the API
async function fetchMarketUpdate() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// Renames column headers
const columnMapping = {
    id: 'Name',
    current_price: 'Price',
    market_cap: 'Market Cap',
    total_volume: 'Total Volume',

};

// Function to display market update data in columns
function displayMarketUpdate(data) {
    if (!data) return;

    const columns = ['id', 'current_price', 'market_cap', 'total_volume'];
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    columns.forEach(column => {
        const headerCell = document.createElement('th');
        headerCell.textContent = columnMapping[column]; // Use the display name from the mapping
        headerRow.appendChild(headerCell);
    });

    table.appendChild(headerRow);

    data.forEach(crypto => {
        const row = document.createElement('tr');
        columns.forEach(column => {
            const cell = document.createElement('td');
            if (column === 'current_price') {
                cell.textContent = '$' + crypto[column].toLocaleString(); // Format with "$"
            } else {
                cell.textContent = crypto[column].toLocaleString(); // Format with thousands separators
            }
            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    marketUpdateContainer.appendChild(table);
}


// Fetch data and display market update
fetchMarketUpdate().then(data => {
    displayMarketUpdate(data);
});


// Tabs
const tabs = document.querySelectorAll('.tabs li');
const tabContentBoxes = document.querySelectorAll('#tab-content > div');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        tabs.forEach((item) => item.classList.remove('is-active'))
        tab.classList.add('is-active');

const target = tab.dataset.target;
tabContentBoxes.forEach(box => {
    if (box.getAttribute('id') === target) {
        box.classList.remove('is-hidden');
    } else {
        box.classList.add('is-hidden');
    }
})
    })
})


/*my added code*/

function retrieveHotListData() {
    var requestURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
    fetch(requestURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data) {
            for (var i = 0; i < data.length; i++) {
                topHundredSortedByPercentChange.push(data[i]);
            }
            //pushes all the APIs data objects into the array
            for (var i = 0; i < data.length; i++) {
                if (topHundredSortedByPercentChange[i].price_change_percentage_24h < 0) {
                    negativePercentChanges.push(data[i].name);
                }
            }
            

            

            for (var i = 0; i < data.length; i++) {
                topHundredSortedByPercentChange[i].price_change_percentage_24h = Math.abs(topHundredSortedByPercentChange[i].price_change_percentage_24h);
            }

            topHundredSortedByPercentChange.sort(function (a,b) {
                return b.price_change_percentage_24h - a.price_change_percentage_24h;
            });

            console.log(topHundredSortedByPercentChange);
            console.log(negativePercentChanges);
        })
};


function populateHotList() {
    var topTenImages = $(".topTenImage");
    var topTenNames = $(".topTenNameUnderEightCharacters")
    var topTenPercentChanges = $(".topTenPercentage");
    var topTenArrows = $(".arrow");
    var index = 0;
    for (var i = 0; i < 10; i ++) {
        $(topTenImages[i]).attr("src", topHundredSortedByPercentChange[i].image);
        $(topTenNames[i]).text(topHundredSortedByPercentChange[i].name);
        if ((topHundredSortedByPercentChange[i].name).length > 8) {
            $(topTenNames[i]).attr("class", "topTenNameBetweenEightAndTwelveCharacters");
        }
        if ((topHundredSortedByPercentChange[i].name).length > 11) {
            $(topTenNames[i]).attr("class", "topTenNameOverTwelveCharacters");
        }
        if ((topHundredSortedByPercentChange[i].name).length > 11) {
            $(topTenNames[i]).attr("class", "topTenNameOverTwelveCharacters");
        }
        $(topTenPercentChanges[i]).text((topHundredSortedByPercentChange[i].price_change_percentage_24h).toFixed(1) + "%");
    }//displaying the top ten percent changes regardless of whether its negative or positive

    for (var i = 0; i < topTenNames.length; i++) {
        for (var j = 0; j < negativePercentChanges.length; j++) {
            if ((negativePercentChanges[j]) == ($(topTenNames[i]).text())) {
                $(topTenPercentChanges[index]).css("color", "red");
                $(topTenArrows[i]).attr("src", "assets/downwardsArrow.png");
                //adjusts the arrow symbol and color of percentChange according to whether the coin is under or over for the day
                index++;
                //this if loop is ran 10 out of the 910 times, which means it does change the color for the percent change
            }
            else {
                console.log("hello");
            }
            
    }}
};



watchListButton.on("click", function () {
    retrieveHotListData();
    setTimeout(populateHotList, 200);
})

exitButton.on("click", function () {
    setTimeout(switchToHotList, 2000);
})
/* up to here*/
