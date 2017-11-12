/* swap open/close side menu icons */
$('[data-toggle=collapse]').click(function(){
      	// toggle icon
      	$(this).find("i").toggleClass("glyphicon-chevron-right glyphicon-chevron-down");
});

if( window.color ){
    $('#cp2').colorpicker({color: color});
}
