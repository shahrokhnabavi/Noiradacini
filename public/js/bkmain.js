$(document).ready( function() {

    $('.cp2').colorpicker();

    $(".input-group-btn .dropdown-menu li a").click(function(){
        var selText = $(this).html();
        $(this).parents('.input-group-btn').find('.btn-search > .label-icon').html(selText);
        $('#searchField').val( $(this).data("field") );
    });

    var loadFilter = function( el ){
        var obj = {},
            form = $('#searchForm');

        form.serializeArray().forEach(val => {
            obj[val.name] = val.value
        });
        setCookie( form.data('type') + 'Filter', JSON.stringify(obj), 1);
        $.ajax({
            type:  "POST",
            url:   '/api/filter' + form.attr('action'),
            data:  form.serialize(),
            cache: false,
            dataType: 'json',
            success: function(json){
                let icon = '" class="options"><i class="glyphicon glyphicon-',
                    row = 1;
                $('#listBody').html('');
                json.forEach( val => {
                    let links = {
                        show: '<a href="/admin/pages/' + val._id + icon + 'new-window text-primary"></i></a>',
                        edit: '<a href="/admin/pages/' + val._id + icon +  'pencil text-warning"></i></a>',
                        delete: '<a href="/admin/pages/delete/' + val._id + icon +  'trash text-danger"></i></a>'
                    };
                    $('<tr>' +
                        '<th scope="row">' + (row++) + '</th>' +
                        '<td>' + val.titleName + '</td>' +
                        '<td>' + val.slugName + '</td>' +
                        '<td>' + val.language + '</td>' +
                        '<td class="text-right">' +
                        links.show + links.edit + links.delete +
                        '</td></tr>').appendTo('#listBody');
                });
            }
        });
    };

    $("#reset-filter").on('click', function(){
        delete_cookie( $(this).data('type') + 'Filter' );
        window.location.href = '/admin/pages';
    });
    $("#search").on('click', function(){ loadFilter($(this)); });
    $("select").on('change', function(){ loadFilter($(this)); });

});

/* swap open/close side menu icons */
$('[data-toggle=collapse]').click(function(){
      	// toggle icon
      	$(this).find("i").toggleClass("glyphicon-chevron-right glyphicon-chevron-down");
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function delete_cookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
};
