$(document).ready( function() {

    $('.cp2').colorpicker();

    $(".input-group-btn .dropdown-menu li a").click(function(){
        var selText = $(this).html();
        $(this).parents('.input-group-btn').find('.btn-search > .label-icon').html(selText);
        $('#searchField').val( $(this).data("field") );
    });

    var loadFilter = function(){
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
                let row = 1;
                $('#listBody').html('');
                json.forEach( val => {
                    $('<tr>' + listGenaration[form.data('type')](val, row++) + '</tr>').appendTo('#listBody');
                });
            }
        });
    };

    $("#reset-filter").on('click', function(){
        var form = $('#searchForm');
        delete_cookie( form.data('type') + 'Filter' );
        window.location.href = form.attr('action');
    });
    $("#search").on('click', loadFilter);
    $("select").on('change', loadFilter);

    if( typeof checkFilter !== 'undefined' && getCookie( checkFilter + 'Filter' ) )
        $('#filter-panel').collapse('show');

});

/* swap open/close side menu icons */
$('[data-toggle=collapse]').click(function(){
      	$(this).find("i").toggleClass("glyphicon-chevron-right glyphicon-chevron-down");
});


const listGenaration = {
    page: (val, index) => {
        let elem = $('#template').html();
        elem = elem.replace(/NAME/g, val.titleName );
        elem = elem.replace(/SLUG/g, val.slugName );
        elem = elem.replace(/LANG/g, val.language );
        elem = elem.replace(/ROW/g, index );
        elem = elem.replace(/_ID/g, val._id );
        return elem;
    },
    interview: () => {}
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function delete_cookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
};
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
