var cityHistory = $(".city-history");
var cityArr = [];
var cityName = $("#city-name");
var dateToday = $("#date");
var weatherToday = $("#weather-today");
var cityTemp = $("#temp");
var humidity = $("#humidity");
var windSpeed = $("#wind-speed");
var UvIndex = $("#UVIndex");
var futureWeather = $("#future-weather");
var mainCol = $(".main-column");
var cityInput = $("#city-search");

$("#search-button").on("click", function (event) {
  citySearch(event);
});

function search(event) {
  event.preventDefault();

  document.querySelector(".main-results").hidden = false;

  var queryUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    citySearch.val() +
    "&units=imperial&appid=6448d495612ed8aa879917708af54be4";

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    console.log(queryUrl);
    addHistory(cityInput.val());
    showWeatherToday(response);
    weatherWeek(response);
    UVIndex.removeClass("what is a UV ray?");
  });
}

function addHistory(cityToSave) {
  cityArr.push(cityToSave);
  localStorage.setItem("cityHistory", JSON.stringify(cityArr));
  showHistory();
}

function showHistory() {
  var cityList = JSON.parse(localStorage.getItem("cityHistory"));
  var div = $("<div>");
  var button = $("<button>");
  button.addClass("btn history-btn btn-outline-primary");
  button.text(cityList[cityList.length - 1]);
  div.append(button);
  $(".city-storage" / prepend(div));
}

$(".history-btn").on("click", function (event) {
  event.preventDefault();
  search(event);
});

function showWeatherToday(response) {
  cityName.text(response.city.name);
  dateToday.text(response.list[0].dt_txt);
  weatherToday.attr(
    "src",
    "https:openweathermap.org/img/wn/" +
      response.list[0].weather[0].icon +
      "@2x.png"
  );
  cityTemp.text("Temperature: " + response.list[0].main.temp + "° F");
  humidity.text("Humidity: " + response.list[0].main.humidity + "%");
  windSpeed.text("Windspeed: " + response.list[0].wind.speed + "MPH");
  var lat = response.city.coord.lat;
  var lon = response.city.coord.lon;
  console.log(lat);
  console.log(lon);
  var UvQueryUrl =
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=6448d495612ed8aa879917708af54be4";

  $.ajax({
    url: UvQueryUrl,
    method: "GET",
  }).then(function (responseUv) {
    UvIndex.text("UV Index: " + responseUv.value);
    if (responseUv.value < 2) {
      UvIndex.andclass("safe");
    } else if (responseUv.value < 5) {
      UvIndex.addClass("beware");
    } else {
      UvIndex.addClass("danger");
    }

    console.log(responseUv);
  });
}

function weatherWeek(response) {
  var j = 0;
  for (i = 7; i <= 39; i = i + 8) {
    j++;
    $("#forecast-date" + j).text(response.list[i].dt_txt);
    $("#forecast-img" + j).attr(
      "src",
      "https://openweathermap.org/img/wn/" +
        response.list[i].weather[0].icon +
        "2x.png"
    );
    $("#forecast-temp" + j).text("Temp: " + response.list[i].main.temp + "° F");
    $("#forecast-humidity" + j).text(
      "Humidity: " + response.list[i].main.humidity + "%"
    );
  }
}
