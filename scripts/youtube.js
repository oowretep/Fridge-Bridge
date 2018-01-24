$(document).ready(initializeApp);
/***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, adds click handlers to submit buttons
 */
function initializeApp() {
    $('.submit-drink, .submit-food').click(add_vids_to_carousel);
}
/***************************************************************************************************
 * add_vids_to_carousel
 * @params {undefined} none
 * @returns  {undefined} none
 * when search is utilized, takes user's terms and uses youtube api to pull up related tutorials/recipes
 */
function add_vids_to_carousel() {
    if ($(this).attr('id') === 'submit-drink') {
        $(".drinks-item").empty();
        var drinkSearchTerm = $('.input-drink').val() + '';
        $('.drinks-search-term').text('"' + drinkSearchTerm + '"');
        var drinkDataObject = {
            q: drinkSearchTerm + ' alcohol drink recipe tutorial',
            maxResults: 5
        };
        $.ajax({
            dataType: 'json',
            method: 'post',
            url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
            data: drinkDataObject,
            success: function (result) {
                for (var i = 0; i < result.video.length; i++) {
                    $("#drinks-carousel").removeClass('hidden');
                    var videosList = $("<iframe>", {
                        width: '90%',
                        height: 315,
                        src: 'https://www.youtube.com/embed/' + result.video[i].id
                    });
                    $('#drinks-video' + i).append(videosList);
                }
            }
        });
    } else if ($(this).attr('id') === 'submit-food') {
        $(".food-item").empty();
        var foodSearchTerm = $('#food-input').val() + '';
        $('.food-search-term').text('"' + foodSearchTerm + '"');
        var foodDataObject = {
            q: foodSearchTerm + ' meals recipe tutorial',
            maxResults: 5
        };
        $.ajax({
            dataType: 'json',
            method: 'post',
            url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
            data: foodDataObject,
            success: function (result) {
                for (var i = 0; i < result.video.length; i++) {
                    $("#food-carousel").removeClass('hidden');
                    var videosList = $("<iframe>", {
                        width: '90%',
                        height: 315,
                        src: 'https://www.youtube.com/embed/' + result.video[i].id
                    });
                    $('#food-video' + i).append(videosList);
                }
            }
        });
    }
}