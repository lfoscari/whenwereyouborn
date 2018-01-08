window.scrollTo(0, 0);

function whoDied() {
  var day = document.getElementsByName("day")[0];
  var month = document.getElementsByName("month")[0];
  var year = document.getElementsByName("year")[0];
  var output = document.querySelector(".output");

  var dayValue = +day.value;
  var monthValue = +month.value;
  var yearValue = +year.value;

  var year = yearValue <= (new Date()).getFullYear() ? yearValue : -1;
  var month = monthValue <= 12 && monthValue > 0 ? monthValue : -1;
  var day;
  switch (monthValue) {
    case 11:
    case 04:
    case 06:
    case 09:
      day = dayValue <= 30 && dayValue > 0 ? dayValue : -1;
      break;
    case 2:
      day = dayValue <= 28 && dayValue > 0 ? dayValue : -1;
      break;
    default:
      day = dayValue <= 31 && dayValue > 0 ? dayValue : -1;
      break;
  }

  console.log(day, month, year);

  if (day == -1 || month == -1 || year == -1) {
    error();
  } else {
    document.querySelector("body").classList.add("black");
    output.innerHTML = "";
    var url = "https://en.wikipedia.org/api/rest_v1/feed/onthisday/deaths/" + month + "/" + day;
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {

      if (xhr.readyState === 4) {
        var deathsObj = JSON.parse(xhr.response);

        var listOfPeople = [];
        var yearOfDeath = [];
        for (i = 0; i < deathsObj.deaths.length; i++) {
          if (+deathsObj.deaths[i]["year"] >= year) {
            listOfPeople.push(deathsObj.deaths[i]["text"]);
            yearOfDeath.push(deathsObj.deaths[i]["year"]);
          } else
            break;
        }

        var printName = "";
        var printDescription = "";
        var printYear = "";

        for (i = 0; i < listOfPeople.length; i++) {
          var p = listOfPeople[i].indexOf('(');
          if (p != -1)
            listOfPeople[i] = listOfPeople[i].slice(0, p - 1);

          var v = listOfPeople[i].indexOf(',');
          if (v != -1) {
            printName = listOfPeople[i].slice(0, v);
            printDescription = listOfPeople[i].slice(v + 2, listOfPeople[i].length);
          } else {
            printName = listOfPeople[i]
            printDescription = "";
          }
          printYear = yearOfDeath[i];

          console.log(printName, printDescription, printYear);

          document.querySelector("main").classList.add("hide");
          document.querySelector("body").classList.add("scroll");
          output.classList.add("show");
          if (printDescription.length < 1)
            output.innerHTML +=
            "<div>" +
            "<h2>" + printName + "</h2>" +
            "<h4>" + printYear + "</h4>" +
            "</div>";
          else
            output.innerHTML +=
            "<div>" +
            "<h2>" + printName + "</h2>" +
            "<h3>" + printDescription + "</h3>" +
            "<h4>" + printYear + "</h4>"
          "</div>";

          document.querySelector(".why").classList.add("show");
          output.classList.add("up");

        }
      }
    }

    xhr.open("GET", url);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send();
  }


};

document.getElementById('again').addEventListener('click', function() {
  document.querySelector(".output").classList.remove("up");
  document.querySelector(".output").classList.remove("show");
  document.querySelector(".why").classList.remove("show");
  document.querySelector("body").classList.remove("black");
  document.querySelector("main").classList.remove("hide");
  setTimeout(function() {
    document.querySelector("body").classList.remove("scroll");
  }, 1000);
});

var timeOut;

function scrollToTop() {
  if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0) {
    window.scrollBy(0, -50);
    timeOut = setTimeout('scrollToTop()', 0);
  } else clearTimeout(timeOut);
}

function error() {
  var error = document.querySelector(".error");
  error.classList.add("show");
  setTimeout(function() {
    error.classList.remove("show");
  }, 3000);
}

function reqListener() {
  console.log(this.responseText);
}

window.onkeyup = function(e) {
  var key = e.keyCode ? e.keyCode : e.which;
  if (key == 13) {
    document.activeElement.blur();
    whoDied();
  }
}

function checkThenMove(name) {
  var input = document.getElementsByName(name)[0];
  var max = input.getAttribute("maxlength");
  if ((input.value.length + 1) > max && max != 4)
    input.nextElementSibling.nextElementSibling.focus();
  if ((input.value.length) == 4) {
    document.activeElement.blur();
    whoDied();
  }
}
