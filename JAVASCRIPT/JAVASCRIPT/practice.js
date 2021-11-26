

// addEventListener('load', function() {
//     var button = document.getElementById('add');
//     button.addEventListener('click', function() {
//         document.getElementById('counter').innerHTML = parseInt(document.getElementById('counter').innerHTML) + 1;


       
//     });
// });
    
$(document).ready(function() {
    $('#add').click(function() {
        $('#counter').html(parseInt($('#counter').html()) + 1);
    });

});