var map = null;
$(document).ready(function() {
    var apiDomain = "http://localhost:3501/api/",
        selectedLang = 'en';

    //get all settings
    var request = $.ajax({
            url: apiDomain + "settings/",
            method: "GET",
            dataType: "json",
        }).done(function( settings ) {
            $.getScript( 'https://www.amcharts.com/lib/3/maps/js/' + settings.site_def_map + '.js', function() {

                map = AmCharts.makeChart( "chartdiv", {
                    type: "map",
                    theme: 'light',
                    colorSteps: 10,

                    dataProvider: {
                        map: settings.site_def_map,
                        getAreasFromMap: true,
                        zoomLevel: 1,
                        images: circuleCalculate()
                    },

                    imagesSettings: {
                        selectable: true,
                        labelPosition: 'middle',
                        rollOverScale: 1.5,
                        selectedScale: 1.5,
                        labelColor: settings.site_circle_label,
                        labelRollOverColor: settings.site_circle_label,
                        color: settings.site_circle_color,
                    },

                    zoomControl: {
                        zoomControlEnabled: false,
                        homeButtonEnabled: false
                    },

                    areasSettings: {
                        autoZoom: true
                    },

                    listeners: [{
                            event: "rendered",
                            method: function(e) {
                                var map = e.chart;
                                map.initialZoomLevel = map.zoomLevel();
                                map.initialZoomLatitude = map.zoomLatitude();
                                map.initialZoomLongitude = map.zoomLongitude();
                            }
                        },
                        {
                            event: "clickMapObject",
                            method: function( event ) {
                                provence_id = event.mapObject.type === 'circle' ? event.mapObject.provence_id : event.mapObject.id;
                                if( map.selectedArea === provence_id ){

                                    if ( event.mapObject.type === 'circle' ){
                                    } else {
                                        map.selectedArea = null;
                                        map.selectObject();
                                        map.zoomToLongLat(map.initialZoomLevel, map.initialZoomLongitude, map.initialZoomLatitude);
                                        $('#provence').selectpicker( 'val', '');
                                    }
                                } else {
                                    getPersonInProvencies(provence_id);

                                    map.selectedArea = provence_id;
                                    $('#provence').selectpicker( 'val', provence_id);
                                    map.selectObject(map.getObjectById(provence_id));
                                }
                            }
                        },
                        {
                            event: "selectedObjectChanged",
                            method: function( event ) {
                                $('#briefUserList').removeClass('active');
                                $('#briefUserInfo').removeClass('active');
                            }
                        },
                        {
                            event: "zoomCompleted",
                            method: function( event ) {
                                if( map.selectedArea !== null ){
                                    $('#briefUserInfo').addClass('active');
                                    $('#briefUserList').addClass('active');
                                }
                            }
                        }
                    ],
                    selectedArea: null
                });


                $('#logo').attr('src', settings.site_logo);
                $('title').text(settings.site_name);
                $('body').css({backgroundColor:settings.site_color});
                if( settings.site_use_theme !== 'on'){
                    map.areasSettings.color = settings.site_area_color;

                    map.areasSettings.outlineColor = settings.site_outlineColor;
                    map.areasSettings.rollOverColor = settings.site_rollOverColor;
                    map.areasSettings.selectedColor = settings.site_selectedColor;
                    map.areasSettings.selectedOutlineColor = settings.site_selectedOutlineColor;
                }
                selectedLang = settings.site_def_language;
                map.validateData();
                socialMedia(settings);
                getProvenciesInfo();
                getPages();
            });
        }).fail(function( jqXHR, textStatus ) {
            console.log("Request failed: " + textStatus);
        });

    //Get State informations
    var getProvenciesInfo = () => {
        var request = $.ajax({
            url: apiDomain + "bundels/" + selectedLang + "/",
            method: "GET",
            dataType: "json",
        }).done(function( settings ) {
            settings.forEach( (val, index) => {
                mapData[index].label = val.count;
                mapData[index].value = val.count;
                mapData[index].title = val.count ? val.count + " Persons in Friesland" : "";
            });
            map.dataProvider.images = circuleCalculate();
            map.validateData();
        }).fail(function( jqXHR, textStatus ) {
            console.log("Request failed: " + textStatus);
        });
    }

    //Get State informations
    var getPersonInProvencies = (provence_id) => {
        var request = $.ajax({
            url: apiDomain + "bundel/" + provence_id + "/" + selectedLang + "/",
            method: "GET",
            dataType: "json",
        }).done(function( persons ) {
            glo_per = persons;

            $('#briefUserList').html('');
            $('#singlePerson').html('');

            persons.forEach( (val, index) => {
                $('<div class="person">' +
                    '<img class="pull-left" width="50px" height="50px" src="' + val.mainImage + '" alt="name" class="img-thumbnail">' +
                    '<div class="pull-left name">' + val.name + '<br/>Published: ' + val.publishDate + '</div>' +
                    '<a href="#" ref="' + index + '" class="btn btn-info btn-xs pull-right showMiniInFo">See More</a></div><div class="clearfix"></div>')
                .appendTo('#briefUserList');
            });

            if( persons.length !== 0 ){
                var item = Math.floor(Math.random()*persons.length);
                randomPerson( persons,item );
                $('.showMiniInFo').on('click', function(){randomPerson( persons,$(this).attr('ref') );});
            } else {
                $('<p class="text-center">List is empty!</p>').appendTo('#briefUserList');
                $('<div class="row"><div class="col-sm-12"><p class="text-center">If you are a romanian and you live in this area please contact us and share your story with world!</p><a href="#" class="close">X</a></div></div>').appendTo('#singlePerson');
            }
        }).fail(function( jqXHR, textStatus ) {
            console.log("Request failed: " + textStatus);
        });
    }

    //Get Pages List
    var getPages = () => {
        var request = $.ajax({
            url: apiDomain + "pages/" + selectedLang + "/",
            method: "GET",
            dataType: "json",
        }).done(function( pages ) {
            $('#menuPages').html('');
            pages.forEach( val => {
                $('<li><a href="/' + selectedLang + '/' + val.slugName + '">' + val.titleName + '</a></li>').appendTo('#menuPages');
            });
        }).fail(function( jqXHR, textStatus ) {
            console.log("Request failed: " + textStatus);
        });
    }

    //List of social media
    var socialMedia = (settings) => {
        if( settings.site_twitter )
            $('#twitter_link').removeClass('hidden').attr('href', settings.site_twitter);
        if( settings.site_google )
            $('#google_link').removeClass('hidden').attr('href', settings.site_google);
        if( settings.site_facebook )
            $('#facebook_link').removeClass('hidden').attr('href', settings.site_facebook);
    }


    //Load random number
    var randomPerson = function( persons,index ){
        $('#singlePerson').html('');
        $('<div class="row"><div class="col-sm-3 text-center">' +
                '<img class="img-circle" src="' + persons[index].mainImage + '" style="width: 100px;height:100px;">' +
                '<a href="/' + selectedLang + '/interview/' + persons[index]._id + '" class="btn btn-primary">Interview</a>' +
            '</div><div class="col-sm-9"><span class="name">' + persons[index].name + '</span>' +
            '<div class="desc">' + persons[index].frontEndDesc + '</div><a href="#" class="close">X</a></div></div>')
        .appendTo('#singlePerson');
    }


    $('.flag a').on('click', function(){
        $('#briefUserList').removeClass('active');
        $('#briefUserInfo').removeClass('active');
        selectedLang = $(this).attr('href');
        getProvenciesInfo();
        getPages();
        return false;
    });

    $('#provence').on('change', function(){
        var id = $(this).val();
        if ( '' == id ) {
            map.clickMapObject(map.getObjectById(map.selectedArea));
        } else {
            map.clickMapObject(map.getObjectById(id));
        }
    });


    $('body').on('click', 'a.close', function(){
        map.clickMapObject(map.getObjectById(map.selectedArea));
        return false;
    });



    function alertSize() {
      var myWidth = 0, myHeight = 0;
      if( typeof( window.innerWidth ) == 'number' ) {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
      } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
      } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
      }
      document.getElementById('chartwrapper').style.height = myHeight + 'px';
    }
    alertSize();







    // http://www.distancelatlong.com/country/netherlands
    var mapData = [
        {
            type: "circle",
            provence_id: "NL-DR",
            longitude: 6.55,
            latitude: 53,
            title: "22 Persons in Drenthe",
            scale: 3.0,
            label: "5",
            labelShiftY: -2
        },
        {
            type: "circle",
            provence_id: "NL-FR",
            longitude: 5.783,
            latitude: 53.25,
            title: "22 Persons in Friesland",
            scale: 3.0,
            label: "16",
            labelShiftY: -2
        },
        {
            type: "circle",
            provence_id: "NL-GE",
            longitude: 5.922,
            latitude: 51.987,
            title: "22 Persons in Gelderland",
            scale: 3.0,
            label: "22",
            labelShiftY: -2
        },
        {
            type: "circle",
            provence_id: "NL-GR",
            longitude: 6.58,
            latitude: 53.22,
            title: "22 Persons in Groningen",
            scale: 3.0,
            label: "19",
            labelShiftY: -2
        },
        {
            type: "circle",
            provence_id: "NL-OV",
            longitude: 6.0969,
            latitude: 52.524,
            title: "22 Persons in Overijssel",
            scale: 3.0,
            label: "12",
            labelShiftY: -2
        },
        {
            type: "circle",
            provence_id: "NL-NH",
            longitude: 4.6299,
            latitude: 52.38,
            scale: 3.0,
            title: "22 Persons in Noord-Holland",
            label: "1",
            labelShiftY: -2
        },
        {
            type: "circle",
            provence_id: "NL-UT",
            longitude: 5.12003,
            latitude: 52.1003,
            scale: 3.0,
            title: "22 Persons in Utrecht",
            label: "10",
            labelShiftY: -2
        },
        {
            type: "circle",
            provence_id: "NL-LI",
            longitude: 5.677,
            latitude: 50.8529,
            scale: 3.0,
            title: "22 Persons in Limburg",
            label: "28",
            labelShiftY: -2
        },
        {
            type: "circle",
            provence_id: "NL-NB",
            longitude: 5.3166,
            latitude: 51.6833,
            scale: 3.0,
            title: "22 Persons in Noord-Brabant",
            label: "42",
            labelShiftY: -2
        },
        {
            type: "circle",
            provence_id: "NL-ZE",
            longitude: 3.6099,
            latitude: 51.5019,
            scale: 3.0,
            title: "22 Persons in Zeeland",
            label: "32",
            labelShiftY: -2
        },
        {
            type: "circle",
            provence_id: "NL-FL",
            longitude: 5.505,
            latitude: 52.424,
            scale: 3.0,
            title: "22 Persons in Flevoland",
            label: "25",
            labelShiftY: -2
        },
        {
            type: "circle",
            provence_id: "NL-ZH",
            longitude: 4.4799,
            latitude:  51.9199,
            scale: 3.0,
            title: "22 Persons in Zuid-Holland",
            label: "50",
            labelShiftY: -2
        }
    ];

    // get min and max values
    var circuleCalculate = () => {
        var minBulletSize = 13;
        var maxBulletSize = 60;
        var min = Infinity;
        var max = -Infinity;
        for ( var i = 0; i < mapData.length; i++ ) {
          var value = parseInt(mapData[ i ].label);
          if ( value < min ) {
            min = value;
          }
          if ( value > max ) {
            max = value;
          }
        }

        // it's better to use circle square to show difference between values, not a radius
        var maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
        var minSquare = minBulletSize * minBulletSize * 2 * Math.PI;

        // create circle for each country
        var images = [];
        for ( var i = 0; i < mapData.length; i++ ) {
            var dataItem = mapData[ i ];
            var value = parseInt(dataItem.label);
            // calculate size of a bubble
            var square = ( value - min ) / ( max - min ) * ( maxSquare - minSquare ) + minSquare;
            if ( square < minSquare ) {
                square = minSquare;
            }
            var size = Math.sqrt( square / ( Math.PI * 2 ) );
            dataItem.width = dataItem.height = size;
            dataItem.scale = 1;
            images.push(dataItem);
        }
        return images;
    }

    var map = AmCharts.makeChart( "chartdiv", {
        type: "map",
        theme: 'light',
        colorSteps: 10,

        dataProvider: {
            map: "syriaLow",
            // map: "iranLow",
            // map: "netherlandsLow",
            getAreasFromMap: true,
            zoomLevel: 1,
            images: circuleCalculate()
        },

        imagesSettings: {
            selectable: true,
            labelPosition: 'middle',
            rollOverScale: 1.5,
            selectedScale: 1.5
        },

        zoomControl: {
            zoomControlEnabled: false,
            homeButtonEnabled: false
        },

        areasSettings: {
            autoZoom: true
        },

        listeners: [{
                event: "rendered",
                method: function(e) {
                    var map = e.chart;
                    map.initialZoomLevel = map.zoomLevel();
                    map.initialZoomLatitude = map.zoomLatitude();
                    map.initialZoomLongitude = map.zoomLongitude();
                }
            },
            {
                event: "clickMapObject",
                method: function( event ) {
                    provence_id = event.mapObject.type === 'circle' ? event.mapObject.provence_id : event.mapObject.id;
                    if( map.selectedArea === provence_id ){

                        if ( event.mapObject.type === 'circle' ){
                        } else {
                            map.selectedArea = null;
                            map.selectObject();
                            map.zoomToLongLat(map.initialZoomLevel, map.initialZoomLongitude, map.initialZoomLatitude);
                            $('#provence').selectpicker( 'val', '');
                        }
                    } else {
                        getPersonInProvencies(provence_id);

                        map.selectedArea = provence_id;
                        $('#provence').selectpicker( 'val', provence_id);
                        map.selectObject(map.getObjectById(provence_id));
                    }
                }
            },
            {
                event: "selectedObjectChanged",
                method: function( event ) {
                    $('#briefUserList').removeClass('active');
                    $('#briefUserInfo').removeClass('active');
                }
            },
            {
                event: "zoomCompleted",
                method: function( event ) {
                    if( map.selectedArea !== null ){
                        $('#briefUserInfo').addClass('active');
                        $('#briefUserList').addClass('active');
                    }
                }
            }
        ],
        selectedArea: null
    });
});
