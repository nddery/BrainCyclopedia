/**
 * New York Times article game
 *
 * @author     Nicolas Duvieusart Dery
 * @license    WTFPL
 */
$(document).ready(function(){
   // instantiate the NYTArticles class
   var answers = new NYTArticles();
   // and get the first set of articles
   answers.getArticles(4);

   // we are currently seeing the splash "page"
   // when we click on start game, hide splash and show game
   $('#startgame').click(function(){
      // hide the splash page
      $('#splash').fadeOut('slow').delay(500);
      $('#game').fadeIn('slow');
   });

   // global variable for lives (we start with 3)
   // we start by taking one life away, that's why the 4
   var lives = 4;

   // an answer was submitted
   $('#submit').click(function(){
      // retrieve the value of the answer (good or bad)
      var result = $('input[name=answer]:checked', '#answers').val();

      // no matter what happens, fade it all out and display a message
      $('#game').fadeOut('slow', toggleButton('#submit')).delay(1500);

      // if it was good, add a point and go to next question
      if(result === 'good'){
         // show the good answer message
         $('#goodanswer').fadeIn('slow').delay(1500);
         plusOne();
         answers.getArticles(4);
         clearRadioButtons();
         enableRadioButtons();
      // else it was a bad answer, take one life away, check if it is empty or not
      }else{
         $('#badanswer').fadeIn('slow').delay(1500);
         // make the given answer disabled
         $('input[name=answer]:checked', '#answers').prop('disabled', true);
         looseALife();
         clearRadioButtons();
      }

      // we did whatever we had to do, hide everything we might have turned on
      $('#goodanswer').fadeOut('slow');
      $('#badanswer').fadeOut('slow');
      // and fade the game back in.
      $('#game').fadeIn('slow', toggleButton('#submit'));

      // toggle the button back on
      // toggleButton('#submit');

      return false;
   });


   /**
    * Toggle the 'clickability' of a form submit button
    *
    * @param   String   button   Identification for the button to target
    */
   function toggleButton(button){
      // see what the button class is (enabled/disabled)
      var curClass = $(button).attr('class');
      // button is currently enabled
      if(curClass === 'enabled'){
         // disable it
         $(button).attr('disabled', 'disabled');
         // and switch the class
         $(button).toggleClass('enabled disabled');
      }

      // button is currently disabled
      if(curClass === 'disabled'){
         // enable it
         $(button).removeAttr('disabled');
         // and switch the class
         $(button).toggleClass('enabled disabled');
      }
      console.log('toggleButtonCalled');
   } // end toggleButton()


   /**
    * Add 1 to the global points
    *
    * @param   none
    * @return  void
    */
   function plusOne(){
      // set the html of #level to be one more than it currently is.
      // need to parseInt it so we can perform math operation on it.
      var currentLevel = parseInt($('#level').html());
      // need to make that calculation before setting the html else it does not work...
      currentLevel++;
      $('#level').html(currentLevel);
   } // end plusOne()


   /**
    * Loose A Life
    *
    * Also check to see if it has become 0 (# of life)
    * and if yes, show Game Over thing
    *
    * @param   none
    * @return  void
    */
   function looseALife(){
      // first thing is to take one life away
      lives--;
      // target the current life and make it dead
      $('#life'+ lives).toggleClass('alive dead');
      // should we still be alive ?
      if(lives === 0){
         gameOver();
      }

   } // end looseALife()


   /**
    * Game Over
    *
    * Show the game over notice and more
    *
    * @param   none
    * @return  void
    */
   function gameOver(){
      // hide everything but #gameover
      $('#game').fadeOut('slow');
      // show the game over panel
      $('#gameover').fadeIn('slow');
   } // end gameOver


   $('#restart').click(function(){
      window.location.reload(true);
   });


   /**
    * Clear the checked radio buttons
    *
    * @param   none
    * @return  void
    */
   function clearRadioButtons(){
      $('input[name=answer]:checked', '#answers').each(function(){
         $(this).prop('checked', false);
      });
   } // end clearRadioButtons()


   /**
    * Enable all radio buttons
    *
    * @param   none
    * @return  void
    */
   function enableRadioButtons(){
      $('input[name=answer]:disabled', '#answers').each(function(){
         $(this).prop('disabled', false);
      });
   } // end clearRadioButtons()


   /**
    * NYT articles class
    *
    * Perform certain action on the NYT API
    *
    * @param   none
    */
   function NYTArticles()
   {

      // get the current year
      var currentYear = new Date();
      currentYear = currentYear.getFullYear();
      // create an array of all possible years (cannot go before 1981)
      this.years = new Array();
      var index = 0;
      for(var i = 1981; i <= currentYear; i++){
         this.years[index] = i;
         index++;
      } // endfor

      // encapsulate the following method
      this.getArticles = getArticles;

      /**
       * Get Articles
       *
       * Retrieve X number of articles from the NYT
       *
       * Optionally, you can pass an array of years to pin-point article
       *
       * @param   int      num      Number of articles to retrieve
       * @return  array    results  The results, contains the title and date of each article
       */
      function getArticles(num){
         // counter used in the success function (can't be using i there...)
         var x = 1;
         // which article will be the good one ? (generate random number between 1 & 4)
         var good = Math.floor(Math.random()*4) + 1;
         // start index at 1 so it match the form IDs
         for(var i = 1; i <= num; i++){
            // generate a random number that is no bigger than the length of the years array
            var rand = Math.floor(Math.random()*this.years.length)
            var url  = window.location + 'library/php/nytarticles.php?year='+ this.years[rand];
            // send the query
            $.ajax({
               url: url,
               context: document.body,
               success: function(data, status, xhr){
                  // first parse the response to JSON
                  var json    = $.parseJSON(data);
                  // there is always only 10 results on the response (and why the hardcoded *10)
                  var article = json.response.docs[Math.floor(Math.random()*10)];
                  console.log(article);
                  // write it down in the html
                  // input value
                  if(x === good){
                     $('#answers #answer'+ x).prop('value', 'good');
                     // also add the title (the question)
                     // var date = article.date;
                     // $('#date').html(date);
                     $('#date').html(article.pub_date.slice(0,4));
                  }else{
                     $('#answers #answer'+ x).prop('value', 'bad');
                  }
                  // label
                  $('#answer'+ x +'text').html(article.headline.main);
                  // the tooltip (body)
                  $('#answer'+ x +'text').attr('title', article.lead_paragraph);
                  x++;
               } // end success
            }); // end $.ajax({})
         }
      } // end getArticles()

   } // end NYTArticles()

}); // end $(document).ready(function(){});
