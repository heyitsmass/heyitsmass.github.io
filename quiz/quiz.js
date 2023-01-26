var username; 
var myfunc; 
const url = "https://helium.herokuapp.com/api/v1.1"; 
var answers = {}; 
var index = []; 
const QUIZ_LENGTH = 10; 
const MAX_ATTEMPTS = 3; 

let quizComplete = false; 

function overattempts(){ 
  clearInterval(myfunc); 
  $(".q-wrapper").find("#q-number").remove(); 
  $(window).on("unload").remove(); 

  $("body").css({
    "height": "auto",
    "width": "auto", 
    "display": "flex", 
    "align-items" : "center", 
    "justify-content" : "center",
    "font-size": "1.2rem", 
    "padding": "10px 10px 10px 10px" 
  }).empty()
  .text(`${username}, You've exceeded the maximum number of allowed attempts for this quiz.`); 

  $("body")
    .append(
      $("<i></i>")
        .css({
          "padding" : "10px"
        })
        .attr("class", "fa-solid fa-right-long next")
        .click(e => {
          location.reload();
        })
        .hover(function(){ 
          $(this).css("cursor", "pointer")
        })
    )

}

async function overtime(){ 
  clearInterval(myfunc);
  $("body").find(".response").each(function(e){
    this.remove();  
  });
  $("body").find(".timer").remove(); 
  await fetch(url + '/result/partial', { 
    'method': 'POST', 
    'mode': 'cors', 
    'headers': { 
      'Authorization': "Basic " + btoa(`${username}:${''}`),
      'Content-Type': 'application/json', 
      'Accept': 'application/json'
    }, 
    'body': JSON.stringify(answers)
  }).then(response => response.json())
    .then(results => display(results)); 
}

function display(results){ 
  $(".q-wrapper").css("width", "100%")
  $("#q-number").remove(); 
  $("#q-text")
    .css({
      "width": "100%", 
      "text-align": "center" 
    })
    .text(`Results for ${username}`); 

  $("body")
    .css({
      "display": "flex", 
      "flex-direction": "column", 
      "align-items": "center",
      "justify-content": "center", 
      "height": "auto", 
      "width": "400px", 
      "padding": "0"
    })
    .append(
      $("<div></div>")
        .attr("class", "results")
        .append(function(e){
          for(const [key,value] of Object.entries(results)){ 
            if(key == "results") 
              continue; 

            var result = $("<div></div>")
                .attr("class", "result")
                .append(
                  $("<span>")
                    .attr("id", "key")
                    .text(key + ':')
                );

            var val = $("<span></span>")
                        .attr("id", "value"); 

            switch(key){ 
              case "attempts": 
                val.text(`${value}/${MAX_ATTEMPTS}`);
                break; 
              default: 
                val.text(value); 
            }

            result.append(val); 
                        
            $(this).append(result);

          }

          $(this).find(":last-child").css("padding-bottom", "30px");
        }),
      $("<p></p>")
        .attr("class", "clickable view-results")
        .text("View Results")
        .click(function(e){ 

          const res = $("<ul></ul>").attr("class", "_results");
          const _results = results.results;

          var l = index.length;

          for(let i = 0; i < l; ++i){ 
            var curr = _results[index[i]];
            res.append(
              $("<li></li>")
                .css({
                  "padding-bottom": (i == l-1? "20px": "5px"),
                  "color": (curr.correct? "green": "red")
                })
                .text(curr.response)
                .append(
                  $("<div></div>")
                    .attr("class", "tooltip")
                    .append(
                      $("<div></div>")
                        .attr("class", "triangle"),
                      curr.response? curr.text: "None"
                    )
                )
              )
          }

          $("body").find(".results").replaceWith(res);
          $(this)
            .text("Back")
            .click(function(e){ 
              $("body").children().not(":first").remove(); 
              display(results)
            }); 
        }),
      $("<p></p>")
        .attr("class", "clickable exit")
        .text("Exit")
        .click(e => {
          location.reload();
        })
    )

  

}

async function results(){ 
  quizComplete = true; 
  clearInterval(myfunc);
  $("body").find(".timer").remove(); 
  
  await fetch(url + '/result', { 
    'method': 'POST', 
    'mode': 'cors', 
    'headers': { 
      'Authorization': "Basic " + btoa(`${username}:${''}`),
      'Content-Type': 'application/json', 
      'Accept': 'application/json'
    }, 
    'body': JSON.stringify(answers)
  })
  .then(response => response.json())
  .then(results => display(results));
}

async function quiz(count=0){ 
  await fetch(url + '/question',{
    'method': 'POST',
    'mode': 'cors', 
    'headers': { 
      'Authorization': "Basic " + btoa(`${username}:${''}`), 
      'Content-Type': 'application/json', 
      'Accept': 'application/json' 
    }, 
    'body': JSON.stringify(answers)
  })
  .then(response => response.json())
  .then(question => {
    if(question.attempts < MAX_ATTEMPTS){ 

    
      $("#q-text").text(question.question.text); 
      $("#q-number").text(count+1 + '.');
      
      const responses = question.question.responses; 
      var l = responses.length; 

      for(let i = 0; i < l; ++i){ 
        $("body")
          .css("padding", "10px 0 10px 0")
          .append(
            $("<div></div>")
              .attr("class", "response")
              .css({ 
                "height": `calc(${100/l}% - ${70/l}px)`,
                "border-bottom": 
                  (i == l-1? "none" : "solid 1px white") 
              })
              .text(responses[i])
              .click(function(e){ 
                $("body")
                  .find(".response")
                  .each(this.remove); 

                answers[question.question.quid] = this.innerText; 
                index.push(question.question.quid); 

                return (count < QUIZ_LENGTH-1?
                  quiz(count+1): 
                  results()
                )

              })
          )
      }
    } else overattempts();
  }); 
}

async function prepare(event){ 
  $("body")
    .empty()
    .css({
      "height": "500px",
      "width": "700px"
    })
    .append(
      $("<div>:</div>")
        .attr("class", "timer")
        .prepend(
          $("<span></span>")
            .attr("id", "minutes")
        ).append(
          $("<span></span>")
            .attr("id", "seconds")
        ),
      $("<div></div>")
        .attr("class", "q-wrapper")
        .append(
          $("<span></span>")
            .attr("id", "q-number"), 
          $("<span></span>")
            .attr("id", "q-text")
        )
      ); 

  const date = new Date().getTime() + 902000; //+ 15 minutes 

  myfunc = setInterval(function(){
    let now = new Date().getTime(); 

    var rem = date - now; 

    $("#minutes").html(`${Math.floor((rem % (1000 * 60 * 60)) / (1000 * 60))}`); 

    let s = Math.floor((rem % (1000 * 60)) / 1000);
    
    if(s <= 9)
      $("#seconds").html(`0${s}`);
    else  
      $("#seconds").html(`${s}`);

    if(rem < 0)
      overtime("username", username, 30); 
    
  }, 1000); 

  await quiz(); 

}

function getclick(elem){
  if (username = $("#user-input").val()){ 
    $(elem)
      .css("border-color", "green") 
      .addClass("fa-arrow-right")
      .removeClass("fa-magnifying-glass")
      .removeAttr("onclick")
      .click(prepare)
      .prev() 
        .css("pointer-events", "none") 
      .parent()
        .css("border-color", "green")
  } else { 
    $(elem) 
      .css("border-color", "red")
      .parent()
        .css("border-color", "red")
  }
}

function getkey(elem){
  var key = this.event.keyCode; 
  if(key == 13){
    getclick($(elem).next())
    elem.blur();
  }
}