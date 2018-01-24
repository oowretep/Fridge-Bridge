$(document).ready(initializeApp);
/***************************************************************************************************
 * initializeApp
 * @params {undefined}
 * @returns: {undefined}
 * initializes the application and loads click handlers
 */
function initializeApp() {
    addClickHandlers();
}
/***************************************************************************************************
 * addClickHandlers
 * @params {undefined}
 * @returns  {undefined}
 * adds click handler + keypress
 */
function addClickHandlers() {
    $('.submit-drink').click(searchDB);
    $('.input-drink').keydown(function(event){
        if (event.keyCode === 13){
            event.preventDefault();
            $('.submit-drink').click();
        }
    });
    $('.back-drink').click(backToListDrink);
}
/***************************************************************************************************
 * backToListDrink
 * @params {undefined}
 * @returns  {undefined}
 * after user clicks on drink name and data comes up, clicking back to list will move the page back to drink list
 */
function backToListDrink() {
    $('.back-drink').addClass('disabled');
    var drinkIng = $('.drink-ing');
    var drinkList = $('.drink-list');
    if (drinkIng.css('display') !== 'none' && drinkList.css('display') === 'none') {
        $('.drink-ing').css('display', 'none');
        $('.drink-list').show();
    }
}
/***************************************************************************************************
 * searchDB
 * @params {undefined}
 * @returns  {undefined}
 * Function to start searching cocktail database
 */
function searchDB() {
    $('.back-drink').addClass('disabled');
    $('.drink-list > div').empty();
    $('.drink-list').css('display', 'none');
    $('.drink-ing div p').text('');
    $('.drink-ing').css('display', 'none');
    searchCocktail();
    add_vids_to_carousel();
}
/***************************************************************************************************
 * displayErrorMessage
 * @params {string}
 * @returns  {undefined}
 * shows modal and text for error
 */
function displayErrorMessage(string1, string2, string3){
    $('#error-modal').modal('show');
    $('#error-modal .modal-body > p:nth-child(2)').text(string1);
    $('#error-modal .modal-body > p:nth-child(3)').text(string2);
    $('#error-modal .modal-body > p:last-child').text(string3);
}

//-----ajax call error-----//
/***************************************************************************************************
 * errorMessage
 * @params {data object}
 * @returns  {undefined}
 * searches cocktail data base and receives list of drinks containing ingredient user searched for
 */
function errorMessage(data) {
    if (data.status === 200) {
        displayErrorMessage('Invalid data type or URL');
    } else if (data.status === 0) {
        displayErrorMessage('Invalid CocktailDB Ajax method');
    }
}

//------------------------------ cocktailDB ------------------------------//
//-----getting drinks-----//
/***************************************************************************************************
 * searchCocktail
 * @params {undefined}
 * @returns  {undefined}
 * searches cocktail data base and receives list of drinks containing ingredient user searched for
 */
function searchCocktail() {
    var inputText = $('.input-drink').val();
    if (inputText !== '') {
        $.ajax({
            dataType: 'text',
            url: 'http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + inputText,
            method: 'get',
            success: function(data) {
                if (data !== '') {
                    var allDrinks = JSON.parse(data);
                    if (allDrinks.drinks !== undefined || allDrinks.drinks.length !== 0) {
                        $('.drink-list > ul').empty();
                        for (var i = 0; i < allDrinks.drinks.length; i++) {
                            var drinkName = allDrinks.drinks[i].strDrink;
                            var drinkPhoto = allDrinks.drinks[i].strDrinkThumb
                            renderDrinkList(drinkName, drinkPhoto);
                        }
                    } else if (allDrinks.drinks.length === 0) {
                        displayErrorMessage('Searching "CocktailDB"...', 'No drinks are found with searched ingredient: ' + inputText + '.', 'Try "Vodka", "Rum", "Mango"');
                    }
                } else {
                    displayErrorMessage('Searching "CocktailDB"...', 'No drinks are found with searched ingredient: ' + inputText + '.', 'Try "Vodka", "Rum", "Mango"');
                }
            },
            error: errorMessage
        })
    } else {
        displayErrorMessage('Please enter a drink ingredient before searching');
    }
}
/***************************************************************************************************
 * renderDrinkList
 * @params {drink data array}
 * @returns  {undefined}
 * loops through drink list and appends to page for cocktailDB
 */
function renderDrinkList(name, photo) {
    $('.drink-list').show();
    var drinkPhoto = $('<img>', {
        src: photo,
        css: {
            width: '50%'
        }
    })
    var drinkName = $('<h5>', {
        text: name,
        css: {
            'text-decoration': 'underline',
            margin: '2px 0 15px 0'
        }
    })
    var drinkDiv = $('<div>', {
        css: {
            margin: 'auto',
            display: 'inline-block',
            width: '20vmin',
            'text-align': 'center',
            cursor: 'pointer',
        }
    }).click(getDataCocktail);
    $(drinkDiv).append(drinkPhoto, drinkName);
    $('.drink-list > div').append(drinkDiv);
}
/***************************************************************************************************
 * getDataCocktail
 * @params {undefined}
 * @returns  {undefined}
 * after user picks drink from list, gets data from cocktailDB server about selected drink and prepares for render
 */
function getDataCocktail() {
    var validInput = $(this).text();
    $.ajax({
        dataType: 'JSON',
        url: 'http://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + validInput,
        method: 'get',
        success: function(data) {
            var passData = [];
            var drink = data.drinks[0];
            var ingred = [];
            var measurement = [];
            for (var item in drink) {
                if (drink[item] !== null) {
                    if (item.indexOf("Ingredient") !== -1) {
                        if (drink[item].length > 2) {
                            ingred.push(drink[item]);
                        }
                    }
                    if (item.indexOf("Measure") !== -1) {
                        if (drink[item].length > 2) {
                            measurement.push(drink[item]);
                        }
                    }
                }
            }
            for (var i = 0; i < measurement.length; i++) {
                if (measurement[i] === undefined) {
                    var amount = '';
                    ingred[i] += amount;
                } else {
                    amount = '' + ingred[i];
                    measurement[i] += amount;
                }
            }
            if (measurement.length < ingred.length) {
                var lastItem = ingred.length - 1;
                var temp = ingred[lastItem];
                measurement.push(temp);
            }
            var desc = drink.strInstructions;
            var name = drink.strDrink;
            var imgUrl = drink.strDrinkThumb;
            passData.push(measurement, desc, name, imgUrl);
            renderCocktailInfo(passData);
        },
        error: function(data) {
            errorMessage(data);
        }
    })
}
/***************************************************************************************************
 * renderCocktailInfo
 * @params {drink data array}
 * @returns  {undefined}
 * after drink is selected and info is passed along, renders drink info in appropriate divs
 */
function renderCocktailInfo(array) {
    $('.back-drink').removeClass('disabled');
    $('.drink-list').css('display', 'none');
    $('.drink-ing').show();
    $('.photo-img > img').css('background-image', 'url(' + array[3] + ')');
    if (typeof(array[0]) === 'object') {
        $('.ingred-sec > ul').empty();
        var ingredients = array[0];
        for (var j = 0; j < ingredients.length; j++) {
            var ingredientList = $('<li>', {
                text: ingredients[j]
            });
            $('.ingred-sec > ul').append(ingredientList);
        }
    }
    $('.desc-sec p').text(array[1]);
    $('.drink-ing > h2').text(array[2]);
}
