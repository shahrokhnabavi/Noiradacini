jQuery(document).ready(function(e) {
    var t = navigator.userAgent.match(/Android|iPhone/i) && !navigator.userAgent.match(/iPod/i) ? true : false;
    var i = "ontouchstart" in window || "onmsgesturechange" in window;
    var a = false;
    var r = e(window).width();
    var s = e(window).height();
    var n = window.localStorage ? true : false;
    var o = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var l = e("body");
    if (i) {
        l.removeClass("body--has-hover").addClass("body--has-touch")
    }
    if (l.hasClass("body--admin-bar")) {
        a = true
    }
    if (i) {
        FastClick.attach(document.body)
    }

    function u(e, t, i, a) {
        if (typeof dataLayer !== "undefined") {
            dataLayer.push({
                event: "gaTriggerEvent",
                gaEventCategory: e,
                gaEventAction: t,
                gaEventLabel: i
            })
        }
    }
    var d = e("#form");
    if (d.length) {
        $success = e("#success");
        d.on("submit", function(t) {
            t.preventDefault();
            $success.show();
            e.post(d.attr("action"), d.serialize()).done(function(e) {
                if (e === "done") {
                    $success.addClass("success--active")
                } else {
                    $success.hide()
                }
            })
        })
    }
    if (e(".flexslider").length) {
        function c() {
            if (e("#tab-quotes").length) {
                e("#tab-quotes").find(".inner").height(e("#tab-photos").height())
            }
            if (e("#tab-quotes-footer").length) {
                e("#tab-quotes-footer").find(".inner").height(e("#tab-photos-footer").height())
            }
        }
        var h = 5e3,
            p = true;
        if (r < 768) {
            h = 2e3;
            p = false
        }
        e(".flexslider").flexslider({
            animation: "slide",
            slideshow: p,
            smoothHeight: false,
            controlNav: false,
            prevText: '<i class="icon-arrow-left"></i>',
            nextText: '<i class="icon-arrow-right"></i>',
            directionNav: true,
            controlNav: false,
            slideshowSpeed: h,
            animationSpeed: 1e3,
            touch: true,
            start: function(e) {
                c()
            }
        });
        e(window).on("debouncedresize", function() {
            c()
        })
    }
    var f = e("#poi-nav");
    if (f.length) {
        var v = document.referrer;
        if (v.indexOf("world-guide") !== -1) {
            f.removeClass("back--to-interview")
        }
    }
    var m = e(".btn-dropdown");
    if (m.length) {
        e("html").on("click", function() {
            e(".dropdown--active").removeClass("dropdown--active")
        });
        m.on("click", function(t) {
            t.stopPropagation();
            e(this).parent().toggleClass("dropdown--active")
        })
    }
    var g = e(".btn-share");
    if (g.length) {
        g.on("click", function(t) {
            t.preventDefault();
            openNewWindow({
                title: e(this).data("title"),
                width: e(this).data("width"),
                height: e(this).data("height"),
                href: e(this).attr("href")
            })
        })
    }
    e("#btn-top").on("click", function() {
        e("html, body").animate({
            scrollTop: 0
        }, 500)
    });
    e(".btn-sidemenu, .capture-overlay").on("click", function() {
        l.toggleClass("body--show-menu")
    });
    var y = e(".btn-track-click");
    if (y.length) {
        var C = function(e) {
            var t = e.data("track");
            if (t) {
                e.append('<img hidden src="' + t + '" alt="">')
            }
        };
        y.on("click", function() {
            C(e(this))
        })
    }
    var _ = e(".btn-read-later");
    if (_.length) {
        var k = e("#timekeeper-big").length;

        function w() {
            if (n) {
                var t = localStorage.getItem("stored-interviews"),
                    i = JSON.parse(t),
                    a, r, s;
                if (i !== null && i.length) {
                    _.each(function(t, n) {
                        r = false;
                        s = e(n).parent().parent().parent();
                        for (var t = i.length - 1; t >= 0; t--) {
                            a = parseInt(e(n).data("interview"));
                            if (a === i[t]) {
                                s.addClass("timekeeper--saved");
                                r = true;
                                break
                            }
                        }
                        if (!r && s.hasClass("timekeeper--saved")) {
                            s.removeClass("timekeeper--saved")
                        }
                    })
                }
            }
        }
        w();

        function b(t, i, a) {
            e.post(ajax.timekeeper, {
                action: "timekeeper_submit_action",
                interview_id: t,
                read_later: i
            }, function(s) {
                if (s.success && s.success === true) {
                    a.toggleClass("timekeeper--saved");
                    if (n) {
                        var o = localStorage.getItem("stored-interviews");
                        var l = JSON.parse(o);
                        if (l === null) {
                            l = new Array
                        }
                        if (i) {
                            l.push(t)
                        } else {
                            l.splice(l.indexOf(t), 1)
                        }
                        o = JSON.stringify(l);
                        localStorage.setItem("stored-interviews", o)
                    }
                    if (i) {
                        if (r >= 768) {
                            $nav_tk = e("#nav-timekeeper");
                            $nav_tk.show();
                            setTimeout(function() {
                                $nav_tk.addClass("nav__timekeeper--active")
                            }, 5);
                            setTimeout(function() {
                                $nav_tk.removeClass("nav__timekeeper--active");
                                setTimeout(function() {
                                    $nav_tk.hide()
                                }, 300)
                            }, 5e3)
                        }
                    } else {
                        if (k) {
                            a.parent().remove()
                        }
                    }
                }
            }, "json")
        }
        _.on("click", function(t) {
            t.preventDefault();
            b(e(this).data("interview"), true, e(this).parent().parent().parent());
            u("Timekeeper", "Click", "Save", e(this).data("interview"))
        });
        e(".btn-remove-read-later").on("click", function(t) {
            t.preventDefault();
            b(e(this).data("interview"), false, e(this).parent().parent().parent());
            u("Timekeeper", "Click", "Remove", e(this).data("interview"))
        });
        if (i) {
            e(".btn-remove-read-later-mobile").on("click", function(t) {
                t.stopPropagation();
                t.preventDefault();
                b(e(this).data("interview"), false, e(this).parent().parent())
            })
        }
    }
    var M = e("#header");
    if (e("#header-interview").length && r < 768) {
        var S = 180,
            T, x = false;
        e(window).on("scroll", function() {
            T = e("html").scrollTop() || l.scrollTop();
            if (T >= S && !x) {
                M.addClass("header--minimize");
                x = true
            } else if (T < S && x) {
                M.removeClass("header--minimize");
                x = false
            }
        })
    }
    var E = e(".share__count");
    if (0 && E.length) {
        var I = E.data("url");
        counts = [], count = 0, amount_calls = 0;
        if (I.substr(I.length - 1) != "/") {
            I += "/"
        }

        function L() {
            if (amount_calls === 3) {
                e(".share__amount").html(count);
                E.each(function(t, i) {
                    if (e(i).parent().hasClass("share--bottom") && r < 768) {} else {
                        e(i).show()
                    }
                })
            }
        }

        function P(e) {
            var t = true;
            e = parseInt(e);
            if (counts.length) {
                for (var i = counts.length - 1; i >= 0; i--) {
                    if (counts[i] === e) {
                        t = false
                    }
                }
            }
            counts.push(e);
            return t
        }
        e.getJSON("https://graph.facebook.com/?id=" + I).done(function(e) {
            if (e.share && e.share.share_count && P(e.share.share_count)) {
                count += e.share.share_count
            }
            amount_calls++;
            L()
        });
        e.getJSON("https://widgets.pinterest.com/v1/urls/count.json?callback=?&url=" + I).done(function(e) {
            if (e.count && P(e.count)) {
                count += e.count
            }
            amount_calls++;
            L()
        });
        e.getJSON("https://widgets.pinterest.com/v1/urls/count.json?callback=?&url=" + I).done(function(e) {
            if (e.count && P(e.count)) {
                count += e.count
            }
            amount_calls++;
            L()
        })
    }
    var N = e(".audio");
    if (N.length) {
        var A = [];
        N.each(function(t, i) {
            var a = false,
                r = false,
                s, n, o = e(i).find(".audio__progress");
            if (o.length) {
                a = true
            }

            function l() {
                s = e(i).find("source").attr("src");
                n = new Audio5js({
                    ready: function() {
                        this.load(s);
                        this.play();
                        this.on("ended", function() {
                            e(i).removeClass("audio--playing");
                            this.seek(0)
                        }, this);
                        this.on("play", function() {
                            e(i).addClass("audio--playing");
                            $slider = e(i).parents(".audio-slider");
                            if ($slider.length) {
                                $slider.flexslider("pause")
                            }
                        }, this);
                        if (a) {
                            var t = 0,
                                r, n;
                            this.on("timeupdate", function(e, i) {
                                r = parseInt(e.substr(0, e.indexOf(":")));
                                n = parseInt(e.substr(e.indexOf(":") + 1)) + 1;
                                e = r * 60 + n;
                                t = parseInt(e / i * 100) || 0;
                                o.css({
                                    width: t + "%"
                                })
                            }, this)
                        }
                    }
                });
                A.push(n);
                r = true
            }

            function u() {
                var t = A.length - 1;
                for (t; t >= 0; t--) {
                    A[t].pause()
                }
                e(".audio--playing").removeClass("audio--playing");
                if (r) {
                    n.playPause()
                } else {
                    l()
                }
            }
            e(i).find(".btn-play, .btn-pause").on("click", function() {
                u()
            });
            var d = e(i).next();
            if (d.hasClass("highlight")) {
                d.on("click", function() {
                    u()
                })
            }
        })
    }
    var z = e("#overlay-mobile");
    if (i && z.length && r < 1030) {
        var O = "body--overflow-hidden";
        var $ = function(e) {
            e.preventDefault()
        };
        var F = function(e) {
            e.setHours(0);
            e.setMinutes(0);
            e.setSeconds(0);
            e.setMilliseconds(0);
            return e
        };
        if (n) {
            var D = 24 * 60 * 60 * 1e3;
            var W = F(new Date);
            var H = false;
            var B = localStorage.getItem("remember-decision");
            var j = localStorage.getItem("last-visit");
            var q = localStorage.getItem("pages-visited") || 0;
            q++;
            if (B) {
                return
            }
            if (!j) {} else {
                j = new Date(parseInt(j));
                if (W.getTime() > j.getTime() + D) {
                    q = 1
                } else if (q % 2 === 1) {
                    H = true
                }
            }
            localStorage.setItem("last-visit", W.getTime());
            localStorage.setItem("pages-visited", q);
            if (H) {
                $bg = e("#bg-phone");
                var R = "";
                if (r >= 768) {
                    R = $bg.data("src-ipad")
                } else {
                    if (o) {
                        R = $bg.data("src-iphone")
                    } else {
                        $bg.addClass("overlay__phone--android");
                        R = $bg.data("src-android")
                    }
                }
                if (o) {
                    z.addClass("overlay--ios")
                } else {
                    z.addClass("overlay--android")
                }
                $bg.css("background-image", "url(" + R + ")");
                l.addClass(O);
                document.addEventListener("touchmove", $);
                z.show()
            }
        }
        e(".btn-close-overlay").on("click", function() {
            if (n && e("#overlay-check").prop("checked")) {
                localStorage.setItem("remember-decision", "true")
            }
            z.hide();
            l.removeClass(O);
            document.removeEventListener("touchmove", $)
        })
    }
    $btn_gallery = e(".btn-open-gallery");
    if ($btn_gallery.length) {
        var Z = "";
        $overlay = e("#overlay");
        $modal = e("#modal");
        $modal_content = e("#modal-content");
        e(".gallery").each(function(t, i) {
            e(i).attr("id", "gallery-" + t)
        });

        function $(e) {
            e.preventDefault()
        }

        function G() {
            l.addClass("body--overflow-hidden");
            $overlay.show();
            setTimeout(function() {
                $overlay.addClass("overlay--active");
                $modal.addClass("modal--active")
            });
            if (i) {
                document.addEventListener("touchmove", $)
            }
        }

        function V() {
            l.removeClass("body--overflow-hidden");
            $modal.removeClass("modal--active");
            $overlay.removeClass("overlay--active");
            setTimeout(function() {
                $overlay.hide()
            }, 300);
            if (i) {
                document.removeEventListener("touchmove", $)
            }
        }

        function X(t, i) {
            var a = "",
                r = [],
                n = true,
                o = 600,
                l, u, d, c;
            if (!i) {
                i = 0
            }
            t.find(".gallery__item").each(function(t, i) {
                r.push({
                    img: e(i).attr("href"),
                    caption: e(i).data("caption"),
                    credits: e(i).data("credits"),
                    height: e(i).data("height"),
                    width: e(i).data("width")
                })
            });
            if (r.length) {
                if (Z === t.attr("id")) {
                    var a = e("#modal-slider").data("flexslider");
                    a.vars.animationSpeed = 0;
                    a.flexAnimate(i);
                    a.vars.animationSpeed = o;
                    G();
                    return
                }
                if (r.length === 1) {
                    n = false
                }
                u = e("#modal-content").width();
                l = s * .8;
                d = u / l;
                a += '<div class="slider">';
                a += '<div id="modal-slider" class="flexslider flexslider--modal">';
                a += '<ul class="slides">';
                for (var h = 0; h < r.length; h++) {
                    a += "<li>";
                    a += '<div class="inner">';
                    c = r[h].width / r[h].height;
                    if (c < d) {
                        a += '<div class="figure portrait">'
                    } else {
                        a += '<div class="figure">'
                    }
                    a += '<img src="' + r[h].img + '" alt="' + r[h].caption + '">';
                    figcaptionClass = "";
                    if (r[h].caption == "" && r[h].credits != "") {
                        figcaptionClass = " credits-only"
                    }
                    if (r[h].credits) {
                        r[h].caption += ' <span class="credits">' + r[h].credits + "</span>"
                    }
                    if (r[h].caption) {
                        a += '<div class="figcaption' + figcaptionClass + '">';
                        a += r[h].caption;
                        a += "</div>"
                    }
                    a += '<span class="aligner"></span>';
                    a += "</div>";
                    a += "</div>";
                    a += "</li>"
                }
                a += "</ul>";
                a += "</div>";
                a += "</div>";
                $slider = e(a);
                $modal_content.html($slider);
                e("#modal-slider").flexslider({
                    animation: "slide",
                    slideshow: false,
                    smoothHeight: false,
                    prevText: '<i class="icon-arrow-left"></i>',
                    nextText: '<i class="icon-arrow-right"></i>',
                    directionNav: n,
                    controlNav: true,
                    animationSpeed: o,
                    touch: true,
                    keyboard: true,
                    multipleKeyboard: true,
                    startAt: i,
                    start: function(e) {
                        if (i == 0) {
                            e.vars.animationSpeed = 0;
                            e.flexAnimate(1);
                            e.flexAnimate(0);
                            e.vars.animationSpeed = o
                        }
                    }
                });
                Z = t.attr("id");
                setTimeout(function() {
                    G()
                }, 10)
            }
        }
        $btn_gallery.on("click", function(t) {
            t.preventDefault();
            if (e(this).parent().hasClass("layout__item")) {
                $gallery = e(this).parent().parent().parent()
            } else {
                $gallery = e(this).parent().parent()
            }
            X($gallery, parseInt(e(this).data("start")))
        });
        e("#btn-close-modal").on("click", function() {
            V()
        });
        e(document).on("keydown", function(e) {
            if (e.keyCode == 27) {
                V()
            }
        })
    }
    $tab_btn = e(".btn-tab");
    if ($tab_btn.length) {
        $tab_btn.on("click", function() {
            if (!e(this).hasClass("tabs__btn--active")) {
                $tabs_nav = e(this).parent().parent();
                $tabs_nav.find(".tabs__btn--active").removeClass("tabs__btn--active");
                e(this).addClass("tabs__btn--active");
                $tabs = $tabs_nav.parent();
                $tabs.find(".tabs__tab--active").removeClass("tabs__tab--active");
                $tabs.find('.tabs__tab[data-tab="' + e(this).data("target") + '"]').addClass("tabs__tab--active")
            }
        })
    }
    $watch = e("#watch");
    if ($watch.length) {
        $watch_days = e("#watch-days");
        $input_day = e("#input-day");
        var U = new Date,
            Y = 0,
            K = 0,
            J = 0,
            Q = [],
            ee = [],
            te = false;
        Q[0] = 0;
        Q[1] = 309;
        Q[2] = 257;
        Q[3] = 206;
        Q[4] = 154;
        Q[5] = 103;
        Q[6] = 52;
        ee = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        function ie() {
            Y = U.getDay();
            if (Y > 3) {
                K = Q[Y]
            } else if (Y != 0) {
                K = Q[Y] - 360
            }
            $watch_days.css({
                transform: "rotateZ(" + K + "deg)"
            });
            $input_day.val(ee[Y])
        }
        ie();

        function ae(e) {
            if (te) {
                return
            }
            te = true;
            if (e < 0) {
                if (Y == 0) {
                    Y = 6;
                    J = Q[Y]
                } else {
                    Y--;
                    J = Q[Y] - Q[Y + 1];
                    if (Y == 0) {
                        J += 360
                    }
                }
                J = K + J
            } else {
                if (Y == 6) {
                    Y = 0;
                    J = Q[6]
                } else {
                    Y++;
                    J = Q[Y - 1] - Q[Y];
                    if (Y == 1) {
                        J += 360
                    }
                }
                J = K - J
            }
            $watch_days.css({
                transform: "rotateZ(" + J + "deg)"
            });
            $input_day.val(ee[Y]);
            K = J;
            setTimeout(function() {
                te = false
            }, 800)
        }
        $watch.find(".btn-prev-day").on("click", function() {
            ae(-1)
        });
        $watch.find(".btn-next-day").on("click", function() {
            ae(1)
        });
        $newsletter = e("#newsletter-form");
        $newsletter_success = e("#newsletter-success");
        $newsletter.on("submit", function(t) {
            t.preventDefault();
            if (e("#input-email").val() !== "") {
                $newsletter_success.show();
                e.post($newsletter.attr("action"), $newsletter.serialize()).done(function(t) {
                    if (t.success === true) {
                        e("#subscribe-intro").hide();
                        e("#subscribe-done").show()
                    } else {
                        $newsletter_success.hide()
                    }
                })
            }
        })
    }
    var re = 3,
        se = {
            "Black / White": [{
                featureType: "water",
                elementType: "geometry",
                stylers: [{
                    color: "#e9e9e9"
                }, {
                    lightness: 17
                }]
            }, {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [{
                    color: "#f5f5f5"
                }, {
                    lightness: 20
                }]
            }, {
                featureType: "road.highway",
                elementType: "geometry.fill",
                stylers: [{
                    color: "#ffffff"
                }, {
                    lightness: 17
                }]
            }, {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{
                    color: "#ffffff"
                }, {
                    lightness: 29
                }, {
                    weight: .2
                }]
            }, {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [{
                    color: "#ffffff"
                }, {
                    lightness: 18
                }]
            }, {
                featureType: "road.local",
                elementType: "geometry",
                stylers: [{
                    color: "#ffffff"
                }, {
                    lightness: 16
                }]
            }, {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{
                    color: "#f5f5f5"
                }, {
                    lightness: 21
                }]
            }, {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{
                    color: "#dedede"
                }, {
                    lightness: 21
                }]
            }, {
                elementType: "labels.text.stroke",
                stylers: [{
                    visibility: "on"
                }, {
                    color: "#ffffff"
                }, {
                    lightness: 16
                }]
            }, {
                elementType: "labels.text.fill",
                stylers: [{
                    saturation: 36
                }, {
                    color: "#333333"
                }, {
                    lightness: 40
                }]
            }, {
                elementType: "labels.icon",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{
                    color: "#f2f2f2"
                }, {
                    lightness: 19
                }]
            }, {
                featureType: "administrative",
                elementType: "geometry.fill",
                stylers: [{
                    color: "#fefefe"
                }, {
                    lightness: 20
                }]
            }, {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{
                    color: "#fefefe"
                }, {
                    lightness: 17
                }, {
                    weight: 1.2
                }]
            }]
        },
        ne = {
            zoom: re,
            panControl: false,
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false
        };
    $map = e("#map");
    if ($map.length) {
        var oe = [],
            le = [],
            ue, de, ce, he, pe, fe, ve, me, R, ge, ye, Ce = {},
            _e = new google.maps.MarkerImage($map.data("marker"), null, null, new google.maps.Point(10, 10), new google.maps.Size(20, 20)),
            ke = new google.maps.MarkerImage($map.data("marker-active"), null, null, new google.maps.Point(14, 14), new google.maps.Size(28, 28));
        e("#pois .poi").each(function(t, i) {
            de = e(i).data("lat");
            ce = e(i).data("lon");
            he = e(i).data("id");
            pe = e(i).data("href");
            fe = e(i).data("title");
            ve = e(i).data("owner");
            me = e(i).data("cat");
            R = e(i).data("img");
            if (de !== "" && ce !== "") {
                ue = {
                    id: he,
                    href: pe,
                    title: fe,
                    owner: ve,
                    cat: me,
                    img: R,
                    lat: parseFloat(de),
                    lon: parseFloat(ce)
                };
                le.push(ue)
            }
        });
        $world_mobile = e("#world-mobile");

        function we() {
            if (typeof Ce.id !== "undefined") {
                if (r >= 768) {
                    Ce.box.setMap(null)
                } else {
                    $world_mobile.removeClass("world__mobile--active")
                }
                for (var e = oe.length - 1; e >= 0; e--) {
                    if (oe[e].id === Ce.id) {
                        oe[e].setIcon(_e);
                        break
                    }
                }
                Ce = {}
            }
        }

        function be() {
            for (var t = 0; t < le.length; t++) {
                var i = new google.maps.LatLng(le[t].lat, le[t].lon),
                    a = "";
                a += '<a class="box" href="' + le[t].href + '">';
                a += '<div class="box__img"><img src="' + le[t].img + '" alt="' + le[t].title + '"></div>';
                a += '<div class="box__content">';
                a += '<div class="box__title caps truncate">' + le[t].title + "</div>";
                a += '<div class="box__owner truncate">by ' + le[t].owner + "</div>";
                a += '<div class="box__cat truncate">' + le[t].cat + "</div>";
                a += "</div>";
                a += '<span class="box__btn icon-arrow-right"></span>';
                a += "</a>";
                var s = new google.maps.Marker({
                    position: i,
                    map: ge,
                    id: le[t].id,
                    content: a
                });
                s.setIcon(_e);
                oe.push(s);
                google.maps.event.addListener(oe[t], "click", function(t) {
                    he = this.id;
                    we();
                    this.setIcon(ke);
                    if (r >= 768) {
                        var i = new Te({
                            latlng: this.getPosition(),
                            map: ge,
                            content: this.content
                        })
                    } else {
                        $world_mobile.html(e(this.content));
                        $world_mobile.addClass("world__mobile--active")
                    }
                    Ce.id = he;
                    Ce.box = i
                })
            }
            ye = new MarkerClusterer(ge, oe, {
                maxZoom: 15,
                gridSize: 20,
                cssClass: "marker-cluster-icon"
            })
        }

        function Me() {
            if (r < 1024) {
                ne.zoom = 2
            }
            for (var e in se) {
                ne.center = new google.maps.LatLng(38.4032156, -44.1303261);
                ne.mapTypeControlOptions = {
                    mapTypeIds: [google.maps.MapTypeId.SATELLITE, e]
                };
                ne.mapTypeId = e;
                ge = new google.maps.Map(document.getElementById("map"), ne);
                ge.mapTypes.set(e, new google.maps.StyledMapType(se[e], {
                    name: e
                }));
                google.maps.event.addListener(ge, "click", function() {
                    we()
                })
            }
            be()
        }
        Me();
        $intro = e("#world-intro");
        var Se = false;
        if (n) {
            Se = localStorage.getItem("intro-done");
            var W = (new Date).getTime();
            if (Se === null || (W - Se) / 1e3 / 60 / 24 > 24) {
                $intro.show().addClass("world__intro--active")
            }
        }
        e(".btn-world-info").on("click", function() {
            $intro.show();
            setTimeout(function() {
                $intro.addClass("world__intro--active")
            }, 5)
        });
        e(".btn-world-explore").on("click", function() {
            if (n) {
                localStorage.setItem("intro-done", (new Date).getTime())
            }
            $intro.removeClass("world__intro--active");
            setTimeout(function() {
                $intro.hide()
            }, 300)
        });
        e(".btn-world-zoom-in").on("click", function() {
            re = ge.getZoom();
            re++;
            ge.setZoom(re)
        });
        e(".btn-world-zoom-out").on("click", function() {
            re = ge.getZoom();
            re--;
            ge.setZoom(re)
        });

        function Te(e) {
            google.maps.OverlayView.call(this);
            this.latlng_ = e.latlng;
            this.map_ = e.map;
            this.content = e.content;
            this.offsetVertical_ = -84;
            this.offsetHorizontal_ = -84;
            this.height_ = 70;
            this.width_ = 320;
            var t = this;
            this.boundsChangedListener_ = google.maps.event.addListener(this.map_, "bounds_changed", function() {
                return t.panMap.apply(t)
            });
            this.setMap(this.map_)
        }
        Te.prototype = new google.maps.OverlayView;
        Te.prototype.remove = function() {
            if (this.div_) {
                this.div_.parentNode.removeChild(this.div_);
                this.div_ = null
            }
        };
        Te.prototype.draw = function() {
            this.createElement();
            if (!this.div_) return;
            var e = this.getProjection().fromLatLngToDivPixel(this.latlng_);
            if (!e) return;
            this.div_.style.width = this.width_ + "px";
            this.div_.style.left = e.x + this.offsetHorizontal_ + "px";
            this.div_.style.height = this.height_ + "px";
            this.div_.style.top = e.y + this.offsetVertical_ + "px";
            this.div_.style.display = "block"
        };
        Te.prototype.createElement = function() {
            var e = this.getPanes();
            var t = this.div_;
            if (!t) {
                t = this.div_ = document.createElement("div");
                t.className = "infobox";
                var i = document.createElement("div");
                i.className = "content";
                i.innerHTML = this.content;
                var a = document.createElement("div");
                a.className = "close";
                t.appendChild(a);

                function r(e) {
                    return function() {
                        e.setMap(null)
                    }
                }
                google.maps.event.addDomListener(a, "click", r(this));
                t.appendChild(i);
                t.style.display = "none";
                e.floatPane.appendChild(t);
                this.panMap()
            } else if (t.parentNode != e.floatPane) {
                t.parentNode.removeChild(t);
                e.floatPane.appendChild(t)
            } else {}
        };
        Te.prototype.panMap = function() {
            var e = this.map_;
            var t = e.getBounds();
            if (!t) return;
            var i = this.latlng_;
            var a = this.width_;
            var r = this.height_;
            var s = this.offsetHorizontal_;
            var n = this.offsetVertical_;
            var o = 40;
            var l = 40;
            var u = e.getDiv();
            var d = u.offsetWidth;
            var c = u.offsetHeight;
            var h = t.toSpan();
            var p = h.lng();
            var f = h.lat();
            var v = p / d;
            var m = f / c;
            var g = t.getSouthWest().lng();
            var y = t.getNorthEast().lng();
            var C = t.getNorthEast().lat();
            var _ = t.getSouthWest().lat();
            var k = i.lng() + (s - o) * v;
            var w = i.lng() + (s + a + o) * v;
            var b = i.lat() - (n - l) * m;
            var M = i.lat() - (n + r + l) * m;
            var S = (k < g ? g - k : 0) + (w > y ? y - w : 0);
            var T = (b > C ? C - b : 0) + (M < _ ? _ - M : 0);
            var x = e.getCenter();
            var E = x.lng() - S;
            var I = x.lat() - T;
            e.setCenter(new google.maps.LatLng(I, E));
            google.maps.event.removeListener(this.boundsChangedListener_);
            this.boundsChangedListener_ = null
        }
    }
    $poi_map = e("#poi-map");
    if ($poi_map.length) {
        var de = parseFloat($poi_map.data("lat")),
            ce = parseFloat($poi_map.data("lon")),
            ge;

        function xe() {
            for (var e in se) {
                ne.zoom = 14;
                ne.center = new google.maps.LatLng(de, ce);
                ne.mapTypeControlOptions = {
                    mapTypeIds: [google.maps.MapTypeId.SATELLITE, e]
                };
                ne.mapTypeId = e;
                ge = new google.maps.Map(document.getElementById("poi-map"), ne);
                ge.mapTypes.set(e, new google.maps.StyledMapType(se[e], {
                    name: e
                }))
            }
            var t = new google.maps.Marker({
                position: new google.maps.LatLng(de, ce),
                map: ge
            });
            var i = new google.maps.MarkerImage($poi_map.data("marker"), null, null, new google.maps.Point(14, 14), new google.maps.Size(28, 28));
            t.setIcon(i)
        }
        xe()
    }
    var Ee = e("#a-z-directory");
    if (Ee.length) {
        var Ie = Ee.find(".layout");
        var Le, Pe = Ie.height(),
            Ne = 10,
            Ae = 53,
            ze, Oe;
        Ie.on("scroll", function(t) {
            t.stopPropagation();
            Le = Ie.scrollTop();
            if (Ne * Ae < Pe + Le) {
                Ne += 10;
                Ie.find(".card--template:lt(10)").each(function(t, i) {
                    ze = e(i).find(".img-template");
                    Oe = '<img src="' + ze.data("src") + '" alt="' + ze.data("alt") + '">';
                    e(i).find(".card__img").prepend(Oe);
                    e(i).removeClass("card--template")
                })
            }
        })
    }
    var $e = e("#a-z-directory-2");
    if ($e.length) {
        var Fe = $e.find(".layout");
        var De, We = Fe.height(),
            He = 10,
            Be = 53,
            je, qe;
        Fe.on("scroll", function(t) {
            t.stopPropagation();
            De = Fe.scrollTop();
            if (He * Be < We + De) {
                He += 10;
                Fe.find(".card--template:lt(10)").each(function(t, i) {
                    je = e(i).find(".img-template");
                    qe = '<img src="' + je.data("src") + '" alt="' + je.data("alt") + '">';
                    e(i).find(".card__img").prepend(qe);
                    e(i).removeClass("card--template")
                })
            }
        })
    }
    var Re = e("#scroll-directory");
    if (Re.length) {
        var Ze = Re.find(".layout");
        var Ge, Ve = Ze.height(),
            Xe = 5,
            Ue = Ze.find(".layout__item").height(),
            Ye, Ke;
        Ze.on("scroll", function(t) {
            t.stopPropagation();
            Ve = Ze.height();
            Ge = Ze.scrollTop();
            if (Xe * Ue < Ve + Ge) {
                Xe += 5;
                Ze.find(".card--template:lt(5)").each(function(t, i) {
                    Ye = e(i).find(".img-template");
                    Ke = '<img src="' + Ye.data("src") + '" alt="' + Ye.data("alt") + '">';
                    e(i).find(".card__img__inner").prepend(Ke);
                    e(i).removeClass("card--template")
                })
            }
        })
    }
    var Je = e("#adjust-height");
    if (Je.length && Ee.length) {
        var Qe = Je.find(".card--extended .card__img");
        var et = function() {
            Ee.find(".layout").outerHeight(Qe.outerHeight())
        };
        et();
        e(window).on("debouncedresize", function() {
            et()
        })
    }
    var tt = e("#adjust-height-2");
    if (tt.length && r >= 768) {
        var it = tt.find(".card--extended");
        var at = tt.find(".group--scrollable .layout");
        var rt = function() {
            at.outerHeight(it.height())
        };
        rt();
        setTimeout(rt, 100);
        setTimeout(rt, 200);
        setTimeout(rt, 500);
        setTimeout(rt, 1e3);
        setTimeout(rt, 2e3);
        e(window).on("debouncedresize", function() {
            rt()
        })
    }
});

function openNewWindow(e) {
    var t = screen.width / 2 - e.width / 2,
        i = screen.height / 2 - e.height / 2,
        a = window.open(e.href, e.title, "width=" + e.width + ",height=" + e.height + ",top=" + i + ",left=" + t);
    if (window.focus) {
        a.focus()
    }
}

function FastClick(e) {
    "use strict";
    var t, i = this;
    this.trackingClick = false;
    this.trackingClickStart = 0;
    this.targetElement = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.lastTouchIdentifier = 0;
    this.touchBoundary = 10;
    this.layer = e;
    if (!e || !e.nodeType) {
        throw new TypeError("Layer must be a document node")
    }
    this.onClick = function() {
        return FastClick.prototype.onClick.apply(i, arguments)
    };
    this.onMouse = function() {
        return FastClick.prototype.onMouse.apply(i, arguments)
    };
    this.onTouchStart = function() {
        return FastClick.prototype.onTouchStart.apply(i, arguments)
    };
    this.onTouchMove = function() {
        return FastClick.prototype.onTouchMove.apply(i, arguments)
    };
    this.onTouchEnd = function() {
        return FastClick.prototype.onTouchEnd.apply(i, arguments)
    };
    this.onTouchCancel = function() {
        return FastClick.prototype.onTouchCancel.apply(i, arguments)
    };
    if (FastClick.notNeeded(e)) {
        return
    }
    if (this.deviceIsAndroid) {
        e.addEventListener("mouseover", this.onMouse, true);
        e.addEventListener("mousedown", this.onMouse, true);
        e.addEventListener("mouseup", this.onMouse, true)
    }
    e.addEventListener("click", this.onClick, true);
    e.addEventListener("touchstart", this.onTouchStart, false);
    e.addEventListener("touchmove", this.onTouchMove, false);
    e.addEventListener("touchend", this.onTouchEnd, false);
    e.addEventListener("touchcancel", this.onTouchCancel, false);
    if (!Event.prototype.stopImmediatePropagation) {
        e.removeEventListener = function(t, i, a) {
            var r = Node.prototype.removeEventListener;
            if (t === "click") {
                r.call(e, t, i.hijacked || i, a)
            } else {
                r.call(e, t, i, a)
            }
        };
        e.addEventListener = function(t, i, a) {
            var r = Node.prototype.addEventListener;
            if (t === "click") {
                r.call(e, t, i.hijacked || (i.hijacked = function(e) {
                    if (!e.propagationStopped) {
                        i(e)
                    }
                }), a)
            } else {
                r.call(e, t, i, a)
            }
        }
    }
    if (typeof e.onclick === "function") {
        t = e.onclick;
        e.addEventListener("click", function(e) {
            t(e)
        }, false);
        e.onclick = null
    }
}
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf("Android") > 0;
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && /OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);
FastClick.prototype.needsClick = function(e) {
    "use strict";
    switch (e.nodeName.toLowerCase()) {
        case "button":
        case "select":
        case "textarea":
            if (e.disabled) {
                return true
            }
            break;
        case "input":
            if (this.deviceIsIOS && e.type === "file" || e.disabled) {
                return true
            }
            break;
        case "label":
        case "video":
            return true
    }
    return /\bneedsclick\b/.test(e.className)
};
FastClick.prototype.needsFocus = function(e) {
    "use strict";
    switch (e.nodeName.toLowerCase()) {
        case "textarea":
            return true;
        case "select":
            return !this.deviceIsAndroid;
        case "input":
            switch (e.type) {
                case "button":
                case "checkbox":
                case "file":
                case "image":
                case "radio":
                case "submit":
                    return false
            }
            return !e.disabled && !e.readOnly;
        default:
            return /\bneedsfocus\b/.test(e.className)
    }
};
FastClick.prototype.sendClick = function(e, t) {
    "use strict";
    var i, a;
    if (document.activeElement && document.activeElement !== e) {
        document.activeElement.blur()
    }
    a = t.changedTouches[0];
    i = document.createEvent("MouseEvents");
    i.initMouseEvent(this.determineEventType(e), true, true, window, 1, a.screenX, a.screenY, a.clientX, a.clientY, false, false, false, false, 0, null);
    i.forwardedTouchEvent = true;
    e.dispatchEvent(i)
};
FastClick.prototype.determineEventType = function(e) {
    "use strict";
    if (this.deviceIsAndroid && e.tagName.toLowerCase() === "select") {
        return "mousedown"
    }
    return "click"
};
FastClick.prototype.focus = function(e) {
    "use strict";
    var t;
    if (this.deviceIsIOS && e.setSelectionRange && e.type.indexOf("date") !== 0 && e.type !== "time") {
        t = e.value.length;
        e.setSelectionRange(t, t)
    } else {
        e.focus()
    }
};
FastClick.prototype.updateScrollParent = function(e) {
    "use strict";
    var t, i;
    t = e.fastClickScrollParent;
    if (!t || !t.contains(e)) {
        i = e;
        do {
            if (i.scrollHeight > i.offsetHeight) {
                t = i;
                e.fastClickScrollParent = i;
                break
            }
            i = i.parentElement
        } while (i)
    }
    if (t) {
        t.fastClickLastScrollTop = t.scrollTop
    }
};
FastClick.prototype.getTargetElementFromEventTarget = function(e) {
    "use strict";
    if (e.nodeType === Node.TEXT_NODE) {
        return e.parentNode
    }
    return e
};
FastClick.prototype.onTouchStart = function(e) {
    "use strict";
    var t, i, a;
    if (e.targetTouches.length > 1) {
        return true
    }
    t = this.getTargetElementFromEventTarget(e.target);
    i = e.targetTouches[0];
    if (this.deviceIsIOS) {
        a = window.getSelection();
        if (a.rangeCount && !a.isCollapsed) {
            return true
        }
        if (!this.deviceIsIOS4) {
            if (i.identifier === this.lastTouchIdentifier) {
                e.preventDefault();
                return false
            }
            this.lastTouchIdentifier = i.identifier;
            this.updateScrollParent(t)
        }
    }
    this.trackingClick = true;
    this.trackingClickStart = e.timeStamp;
    this.targetElement = t;
    this.touchStartX = i.pageX;
    this.touchStartY = i.pageY;
    if (e.timeStamp - this.lastClickTime < 200) {
        e.preventDefault()
    }
    return true
};
FastClick.prototype.touchHasMoved = function(e) {
    "use strict";
    var t = e.changedTouches[0],
        i = this.touchBoundary;
    if (Math.abs(t.pageX - this.touchStartX) > i || Math.abs(t.pageY - this.touchStartY) > i) {
        return true
    }
    return false
};
FastClick.prototype.onTouchMove = function(e) {
    "use strict";
    if (!this.trackingClick) {
        return true
    }
    if (this.targetElement !== this.getTargetElementFromEventTarget(e.target) || this.touchHasMoved(e)) {
        this.trackingClick = false;
        this.targetElement = null
    }
    return true
};
FastClick.prototype.findControl = function(e) {
    "use strict";
    if (e.control !== undefined) {
        return e.control
    }
    if (e.htmlFor) {
        return document.getElementById(e.htmlFor)
    }
    return e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
};
FastClick.prototype.onTouchEnd = function(e) {
    "use strict";
    var t, i, a, r, s, n = this.targetElement;
    if (!this.trackingClick) {
        return true
    }
    if (e.timeStamp - this.lastClickTime < 200) {
        this.cancelNextClick = true;
        return true
    }
    this.cancelNextClick = false;
    this.lastClickTime = e.timeStamp;
    i = this.trackingClickStart;
    this.trackingClick = false;
    this.trackingClickStart = 0;
    if (this.deviceIsIOSWithBadTarget) {
        s = e.changedTouches[0];
        n = document.elementFromPoint(s.pageX - window.pageXOffset, s.pageY - window.pageYOffset) || n;
        n.fastClickScrollParent = this.targetElement.fastClickScrollParent
    }
    a = n.tagName.toLowerCase();
    if (a === "label") {
        t = this.findControl(n);
        if (t) {
            this.focus(n);
            if (this.deviceIsAndroid) {
                return false
            }
            n = t
        }
    } else if (this.needsFocus(n)) {
        if (e.timeStamp - i > 100 || this.deviceIsIOS && window.top !== window && a === "input") {
            this.targetElement = null;
            return false
        }
        this.focus(n);
        if (!this.deviceIsIOS4 || a !== "select") {
            this.targetElement = null;
            e.preventDefault()
        }
        return false
    }
    if (this.deviceIsIOS && !this.deviceIsIOS4) {
        r = n.fastClickScrollParent;
        if (r && r.fastClickLastScrollTop !== r.scrollTop) {
            return true
        }
    }
    if (!this.needsClick(n)) {
        e.preventDefault();
        this.sendClick(n, e)
    }
    return false
};
FastClick.prototype.onTouchCancel = function() {
    "use strict";
    this.trackingClick = false;
    this.targetElement = null
};
FastClick.prototype.onMouse = function(e) {
    "use strict";
    if (!this.targetElement) {
        return true
    }
    if (e.forwardedTouchEvent) {
        return true
    }
    if (!e.cancelable) {
        return true
    }
    if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation()
        } else {
            e.propagationStopped = true
        }
        e.stopPropagation();
        e.preventDefault();
        return false
    }
    return true
};
FastClick.prototype.onClick = function(e) {
    "use strict";
    var t;
    if (this.trackingClick) {
        this.targetElement = null;
        this.trackingClick = false;
        return true
    }
    if (e.target.type === "submit" && e.detail === 0) {
        return true
    }
    t = this.onMouse(e);
    if (!t) {
        this.targetElement = null
    }
    return t
};
FastClick.prototype.destroy = function() {
    "use strict";
    var e = this.layer;
    if (this.deviceIsAndroid) {
        e.removeEventListener("mouseover", this.onMouse, true);
        e.removeEventListener("mousedown", this.onMouse, true);
        e.removeEventListener("mouseup", this.onMouse, true)
    }
    e.removeEventListener("click", this.onClick, true);
    e.removeEventListener("touchstart", this.onTouchStart, false);
    e.removeEventListener("touchmove", this.onTouchMove, false);
    e.removeEventListener("touchend", this.onTouchEnd, false);
    e.removeEventListener("touchcancel", this.onTouchCancel, false)
};
FastClick.notNeeded = function(e) {
    "use strict";
    var t;
    var i;
    if (typeof window.ontouchstart === "undefined") {
        return true
    }
    i = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
    if (i) {
        if (FastClick.prototype.deviceIsAndroid) {
            t = document.querySelector("meta[name=viewport]");
            if (t) {
                if (t.content.indexOf("user-scalable=no") !== -1) {
                    return true
                }
                if (i > 31 && window.innerWidth <= window.screen.width) {
                    return true
                }
            }
        } else {
            return true
        }
    }
    if (e.style.msTouchAction === "none") {
        return true
    }
    return false
};
FastClick.attach = function(e) {
    "use strict";
    return new FastClick(e)
};
if (typeof define !== "undefined" && define.amd) {
    define(function() {
        "use strict";
        return FastClick
    })
} else if (typeof module !== "undefined" && module.exports) {
    module.exports = FastClick.attach;
    module.exports.FastClick = FastClick
} else {
    window.FastClick = FastClick
}(function(e) {
    var t = true;
    e.flexslider = function(i, a) {
        var r = e(i);
        r.vars = e.extend({}, e.flexslider.defaults, a);
        var s = r.vars.namespace,
            n = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
            o = ("ontouchstart" in window || n || window.DocumentTouch && document instanceof DocumentTouch) && r.vars.touch,
            l = "click touchend MSPointerUp keyup",
            u = "",
            d, c = r.vars.direction === "vertical",
            h = r.vars.reverse,
            p = r.vars.itemWidth > 0,
            f = r.vars.animation === "fade",
            v = r.vars.asNavFor !== "",
            m = {};
        e.data(i, "flexslider", r);
        m = {
            init: function() {
                r.animating = false;
                r.currentSlide = parseInt(r.vars.startAt ? r.vars.startAt : 0, 10);
                if (isNaN(r.currentSlide)) {
                    r.currentSlide = 0
                }
                r.animatingTo = r.currentSlide;
                r.atEnd = r.currentSlide === 0 || r.currentSlide === r.last;
                r.containerSelector = r.vars.selector.substr(0, r.vars.selector.search(" "));
                r.slides = e(r.vars.selector, r);
                r.container = e(r.containerSelector, r);
                r.count = r.slides.length;
                r.syncExists = e(r.vars.sync).length > 0;
                if (r.vars.animation === "slide") {
                    r.vars.animation = "swing"
                }
                r.prop = c ? "top" : "marginLeft";
                r.args = {};
                r.manualPause = false;
                r.stopped = false;
                r.started = false;
                r.startTimeout = null;
                r.transitions = !r.vars.video && !f && r.vars.useCSS && function() {
                    var e = document.createElement("div"),
                        t = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                    for (var i in t) {
                        if (e.style[t[i]] !== undefined) {
                            r.pfx = t[i].replace("Perspective", "").toLowerCase();
                            r.prop = "-" + r.pfx + "-transform";
                            return true
                        }
                    }
                    return false
                }();
                r.ensureAnimationEnd = "";
                if (r.vars.controlsContainer !== "") r.controlsContainer = e(r.vars.controlsContainer).length > 0 && e(r.vars.controlsContainer);
                if (r.vars.manualControls !== "") r.manualControls = e(r.vars.manualControls).length > 0 && e(r.vars.manualControls);
                if (r.vars.customDirectionNav !== "") r.customDirectionNav = e(r.vars.customDirectionNav).length === 2 && e(r.vars.customDirectionNav);
                if (r.vars.randomize) {
                    r.slides.sort(function() {
                        return Math.round(Math.random()) - .5
                    });
                    r.container.empty().append(r.slides)
                }
                r.doMath();
                r.setup("init");
                if (r.vars.controlNav) {
                    m.controlNav.setup()
                }
                if (r.vars.directionNav) {
                    m.directionNav.setup()
                }
                if (r.vars.keyboard && (e(r.containerSelector).length === 1 || r.vars.multipleKeyboard)) {
                    e(document).bind("keyup", function(e) {
                        var t = e.keyCode;
                        if (!r.animating && (t === 39 || t === 37)) {
                            var i = t === 39 ? r.getTarget("next") : t === 37 ? r.getTarget("prev") : false;
                            r.flexAnimate(i, r.vars.pauseOnAction)
                        }
                    })
                }
                if (r.vars.mousewheel) {
                    r.bind("mousewheel", function(e, t, i, a) {
                        e.preventDefault();
                        var s = t < 0 ? r.getTarget("next") : r.getTarget("prev");
                        r.flexAnimate(s, r.vars.pauseOnAction)
                    })
                }
                if (r.vars.pausePlay) {
                    m.pausePlay.setup()
                }
                if (r.vars.slideshow && r.vars.pauseInvisible) {
                    m.pauseInvisible.init()
                }
                if (r.vars.slideshow) {
                    if (r.vars.pauseOnHover) {
                        r.hover(function() {
                            if (!r.manualPlay && !r.manualPause) {
                                r.pause()
                            }
                        }, function() {
                            if (!r.manualPause && !r.manualPlay && !r.stopped) {
                                r.play()
                            }
                        })
                    }
                    if (!r.vars.pauseInvisible || !m.pauseInvisible.isHidden()) {
                        r.vars.initDelay > 0 ? r.startTimeout = setTimeout(r.play, r.vars.initDelay) : r.play()
                    }
                }
                if (v) {
                    m.asNav.setup()
                }
                if (o && r.vars.touch) {
                    m.touch()
                }
                if (!f || f && r.vars.smoothHeight) {
                    e(window).bind("resize orientationchange focus", m.resize)
                }
                r.find("img").attr("draggable", "false");
                setTimeout(function() {
                    r.vars.start(r)
                }, 200)
            },
            asNav: {
                setup: function() {
                    r.asNav = true;
                    r.animatingTo = Math.floor(r.currentSlide / r.move);
                    r.currentItem = r.currentSlide;
                    r.slides.removeClass(s + "active-slide").eq(r.currentItem).addClass(s + "active-slide");
                    if (!n) {
                        r.slides.on(l, function(t) {
                            t.preventDefault();
                            var i = e(this),
                                a = i.index();
                            var n = i.offset().left - e(r).scrollLeft();
                            if (n <= 0 && i.hasClass(s + "active-slide")) {
                                r.flexAnimate(r.getTarget("prev"), true)
                            } else if (!e(r.vars.asNavFor).data("flexslider").animating && !i.hasClass(s + "active-slide")) {
                                r.direction = r.currentItem < a ? "next" : "prev";
                                r.flexAnimate(a, r.vars.pauseOnAction, false, true, true)
                            }
                        })
                    } else {
                        i._slider = r;
                        r.slides.each(function() {
                            var t = this;
                            t._gesture = new MSGesture;
                            t._gesture.target = t;
                            t.addEventListener("MSPointerDown", function(e) {
                                e.preventDefault();
                                if (e.currentTarget._gesture) {
                                    e.currentTarget._gesture.addPointer(e.pointerId)
                                }
                            }, false);
                            t.addEventListener("MSGestureTap", function(t) {
                                t.preventDefault();
                                var i = e(this),
                                    a = i.index();
                                if (!e(r.vars.asNavFor).data("flexslider").animating && !i.hasClass("active")) {
                                    r.direction = r.currentItem < a ? "next" : "prev";
                                    r.flexAnimate(a, r.vars.pauseOnAction, false, true, true)
                                }
                            })
                        })
                    }
                }
            },
            controlNav: {
                setup: function() {
                    if (!r.manualControls) {
                        m.controlNav.setupPaging()
                    } else {
                        m.controlNav.setupManual()
                    }
                },
                setupPaging: function() {
                    var t = r.vars.controlNav === "thumbnails" ? "control-thumbs" : "control-paging",
                        i = 1,
                        a, n;
                    r.controlNavScaffold = e('<ol class="' + s + "control-nav " + s + t + '"></ol>');
                    if (r.pagingCount > 1) {
                        for (var o = 0; o < r.pagingCount; o++) {
                            n = r.slides.eq(o);
                            if (undefined === n.attr("data-thumb-alt")) {
                                n.attr("data-thumb-alt", "")
                            }
                            altText = "" !== n.attr("data-thumb-alt") ? altText = ' alt="' + n.attr("data-thumb-alt") + '"' : "";
                            a = r.vars.controlNav === "thumbnails" ? '<img src="' + n.attr("data-thumb") + '"' + altText + "/>" : '<a href="#">' + i + "</a>";
                            if ("thumbnails" === r.vars.controlNav && true === r.vars.thumbCaptions) {
                                var d = n.attr("data-thumbcaption");
                                if ("" !== d && undefined !== d) {
                                    a += '<span class="' + s + 'caption">' + d + "</span>"
                                }
                            }
                            r.controlNavScaffold.append("<li>" + a + "</li>");
                            i++
                        }
                    }
                    r.controlsContainer ? e(r.controlsContainer).append(r.controlNavScaffold) : r.append(r.controlNavScaffold);
                    m.controlNav.set();
                    m.controlNav.active();
                    r.controlNavScaffold.delegate("a, img", l, function(t) {
                        t.preventDefault();
                        if (u === "" || u === t.type) {
                            var i = e(this),
                                a = r.controlNav.index(i);
                            if (!i.hasClass(s + "active")) {
                                r.direction = a > r.currentSlide ? "next" : "prev";
                                r.flexAnimate(a, r.vars.pauseOnAction)
                            }
                        }
                        if (u === "") {
                            u = t.type
                        }
                        m.setToClearWatchedEvent()
                    })
                },
                setupManual: function() {
                    r.controlNav = r.manualControls;
                    m.controlNav.active();
                    r.controlNav.bind(l, function(t) {
                        t.preventDefault();
                        if (u === "" || u === t.type) {
                            var i = e(this),
                                a = r.controlNav.index(i);
                            if (!i.hasClass(s + "active")) {
                                a > r.currentSlide ? r.direction = "next" : r.direction = "prev";
                                r.flexAnimate(a, r.vars.pauseOnAction)
                            }
                        }
                        if (u === "") {
                            u = t.type
                        }
                        m.setToClearWatchedEvent()
                    })
                },
                set: function() {
                    var t = r.vars.controlNav === "thumbnails" ? "img" : "a";
                    r.controlNav = e("." + s + "control-nav li " + t, r.controlsContainer ? r.controlsContainer : r)
                },
                active: function() {
                    r.controlNav.removeClass(s + "active").eq(r.animatingTo).addClass(s + "active")
                },
                update: function(t, i) {
                    if (r.pagingCount > 1 && t === "add") {
                        r.controlNavScaffold.append(e('<li><a href="#">' + r.count + "</a></li>"))
                    } else if (r.pagingCount === 1) {
                        r.controlNavScaffold.find("li").remove()
                    } else {
                        r.controlNav.eq(i).closest("li").remove()
                    }
                    m.controlNav.set();
                    r.pagingCount > 1 && r.pagingCount !== r.controlNav.length ? r.update(i, t) : m.controlNav.active()
                }
            },
            directionNav: {
                setup: function() {
                    var t = e('<ul class="' + s + 'direction-nav"><li class="' + s + 'nav-prev"><a class="' + s + 'prev" href="#">' + r.vars.prevText + '</a></li><li class="' + s + 'nav-next"><a class="' + s + 'next" href="#">' + r.vars.nextText + "</a></li></ul>");
                    if (r.customDirectionNav) {
                        r.directionNav = r.customDirectionNav
                    } else if (r.controlsContainer) {
                        e(r.controlsContainer).append(t);
                        r.directionNav = e("." + s + "direction-nav li a", r.controlsContainer)
                    } else {
                        r.append(t);
                        r.directionNav = e("." + s + "direction-nav li a", r)
                    }
                    m.directionNav.update();
                    r.directionNav.bind(l, function(t) {
                        t.preventDefault();
                        var i;
                        if (u === "" || u === t.type) {
                            i = e(this).hasClass(s + "next") ? r.getTarget("next") : r.getTarget("prev");
                            r.flexAnimate(i, r.vars.pauseOnAction)
                        }
                        if (u === "") {
                            u = t.type
                        }
                        m.setToClearWatchedEvent()
                    })
                },
                update: function() {
                    var e = s + "disabled";
                    if (r.pagingCount === 1) {
                        r.directionNav.addClass(e).attr("tabindex", "-1")
                    } else if (!r.vars.animationLoop) {
                        if (r.animatingTo === 0) {
                            r.directionNav.removeClass(e).filter("." + s + "prev").addClass(e).attr("tabindex", "-1")
                        } else if (r.animatingTo === r.last) {
                            r.directionNav.removeClass(e).filter("." + s + "next").addClass(e).attr("tabindex", "-1")
                        } else {
                            r.directionNav.removeClass(e).removeAttr("tabindex")
                        }
                    } else {
                        r.directionNav.removeClass(e).removeAttr("tabindex")
                    }
                }
            },
            pausePlay: {
                setup: function() {
                    var t = e('<div class="' + s + 'pauseplay"><a href="#"></a></div>');
                    if (r.controlsContainer) {
                        r.controlsContainer.append(t);
                        r.pausePlay = e("." + s + "pauseplay a", r.controlsContainer)
                    } else {
                        r.append(t);
                        r.pausePlay = e("." + s + "pauseplay a", r)
                    }
                    m.pausePlay.update(r.vars.slideshow ? s + "pause" : s + "play");
                    r.pausePlay.bind(l, function(t) {
                        t.preventDefault();
                        if (u === "" || u === t.type) {
                            if (e(this).hasClass(s + "pause")) {
                                r.manualPause = true;
                                r.manualPlay = false;
                                r.pause()
                            } else {
                                r.manualPause = false;
                                r.manualPlay = true;
                                r.play()
                            }
                        }
                        if (u === "") {
                            u = t.type
                        }
                        m.setToClearWatchedEvent()
                    })
                },
                update: function(e) {
                    e === "play" ? r.pausePlay.removeClass(s + "pause").addClass(s + "play").html(r.vars.playText) : r.pausePlay.removeClass(s + "play").addClass(s + "pause").html(r.vars.pauseText)
                }
            },
            touch: function() {
                var e, t, a, s, o, l, u, d, v, m = false,
                    g = 0,
                    y = 0,
                    C = 0;
                if (!n) {
                    u = function(n) {
                        if (r.animating) {
                            n.preventDefault()
                        } else if (window.navigator.msPointerEnabled || n.touches.length === 1) {
                            r.pause();
                            s = c ? r.h : r.w;
                            l = Number(new Date);
                            g = n.touches[0].pageX;
                            y = n.touches[0].pageY;
                            a = p && h && r.animatingTo === r.last ? 0 : p && h ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : p && r.currentSlide === r.last ? r.limit : p ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide : h ? (r.last - r.currentSlide + r.cloneOffset) * s : (r.currentSlide + r.cloneOffset) * s;
                            e = c ? y : g;
                            t = c ? g : y;
                            i.addEventListener("touchmove", d, false);
                            i.addEventListener("touchend", v, false)
                        }
                    };
                    d = function(n) {
                        g = n.touches[0].pageX;
                        y = n.touches[0].pageY;
                        o = c ? e - y : e - g;
                        m = c ? Math.abs(o) < Math.abs(g - t) : Math.abs(o) < Math.abs(y - t);
                        var u = 500;
                        if (!m || Number(new Date) - l > u) {
                            n.preventDefault();
                            if (!f && r.transitions) {
                                if (!r.vars.animationLoop) {
                                    o = o / (r.currentSlide === 0 && o < 0 || r.currentSlide === r.last && o > 0 ? Math.abs(o) / s + 2 : 1)
                                }
                                r.setProps(a + o, "setTouch")
                            }
                        } else {
                            i.removeEventListener("touchmove", d, false)
                        }
                    };
                    v = function(n) {
                        i.removeEventListener("touchmove", d, false);
                        if (r.animatingTo === r.currentSlide && !m && !(o === null)) {
                            var u = h ? -o : o,
                                c = u > 0 ? r.getTarget("next") : r.getTarget("prev");
                            if (r.canAdvance(c) && (Number(new Date) - l < 550 && Math.abs(u) > 50 || Math.abs(u) > s / 2)) {
                                r.flexAnimate(c, r.vars.pauseOnAction)
                            } else {
                                if (!f) {
                                    r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, true)
                                }
                            }
                        }
                        i.removeEventListener("touchend", v, false);
                        e = null;
                        t = null;
                        o = null;
                        a = null
                    };
                    i.addEventListener("touchstart", u, false)
                } else {
                    i.style.msTouchAction = "none";
                    i._gesture = new MSGesture;
                    i._gesture.target = i;
                    i.addEventListener("MSPointerDown", _, false);
                    i._slider = r;
                    i.addEventListener("MSGestureChange", k, false);
                    i.addEventListener("MSGestureEnd", w, false);

                    function _(e) {
                        e.stopPropagation();
                        if (r.animating) {
                            e.preventDefault()
                        } else {
                            r.pause();
                            i._gesture.addPointer(e.pointerId);
                            C = 0;
                            s = c ? r.h : r.w;
                            l = Number(new Date);
                            a = p && h && r.animatingTo === r.last ? 0 : p && h ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : p && r.currentSlide === r.last ? r.limit : p ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide : h ? (r.last - r.currentSlide + r.cloneOffset) * s : (r.currentSlide + r.cloneOffset) * s
                        }
                    }

                    function k(e) {
                        e.stopPropagation();
                        var t = e.target._slider;
                        if (!t) {
                            return
                        }
                        var r = -e.translationX,
                            n = -e.translationY;
                        C = C + (c ? n : r);
                        o = C;
                        m = c ? Math.abs(C) < Math.abs(-r) : Math.abs(C) < Math.abs(-n);
                        if (e.detail === e.MSGESTURE_FLAG_INERTIA) {
                            setImmediate(function() {
                                i._gesture.stop()
                            });
                            return
                        }
                        if (!m || Number(new Date) - l > 500) {
                            e.preventDefault();
                            if (!f && t.transitions) {
                                if (!t.vars.animationLoop) {
                                    o = C / (t.currentSlide === 0 && C < 0 || t.currentSlide === t.last && C > 0 ? Math.abs(C) / s + 2 : 1)
                                }
                                t.setProps(a + o, "setTouch")
                            }
                        }
                    }

                    function w(i) {
                        i.stopPropagation();
                        var r = i.target._slider;
                        if (!r) {
                            return
                        }
                        if (r.animatingTo === r.currentSlide && !m && !(o === null)) {
                            var n = h ? -o : o,
                                u = n > 0 ? r.getTarget("next") : r.getTarget("prev");
                            if (r.canAdvance(u) && (Number(new Date) - l < 550 && Math.abs(n) > 50 || Math.abs(n) > s / 2)) {
                                r.flexAnimate(u, r.vars.pauseOnAction)
                            } else {
                                if (!f) {
                                    r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, true)
                                }
                            }
                        }
                        e = null;
                        t = null;
                        o = null;
                        a = null;
                        C = 0
                    }
                }
            },
            resize: function() {
                if (!r.animating && r.is(":visible")) {
                    if (!p) {
                        r.doMath()
                    }
                    if (f) {
                        m.smoothHeight()
                    } else if (p) {
                        r.slides.width(r.computedW);
                        r.update(r.pagingCount);
                        r.setProps()
                    } else if (c) {
                        r.viewport.height(r.h);
                        r.setProps(r.h, "setTotal")
                    } else {
                        if (r.vars.smoothHeight) {
                            m.smoothHeight()
                        }
                        r.newSlides.width(r.computedW);
                        r.setProps(r.computedW, "setTotal")
                    }
                }
            },
            smoothHeight: function(e) {
                if (!c || f) {
                    var t = f ? r : r.viewport;
                    e ? t.animate({
                        height: r.slides.eq(r.animatingTo).height()
                    }, e) : t.height(r.slides.eq(r.animatingTo).height())
                }
            },
            sync: function(t) {
                var i = e(r.vars.sync).data("flexslider"),
                    a = r.animatingTo;
                switch (t) {
                    case "animate":
                        i.flexAnimate(a, r.vars.pauseOnAction, false, true);
                        break;
                    case "play":
                        if (!i.playing && !i.asNav) {
                            i.play()
                        }
                        break;
                    case "pause":
                        i.pause();
                        break
                }
            },
            uniqueID: function(t) {
                t.filter("[id]").add(t.find("[id]")).each(function() {
                    var t = e(this);
                    t.attr("id", t.attr("id") + "_clone")
                });
                return t
            },
            pauseInvisible: {
                visProp: null,
                init: function() {
                    var e = m.pauseInvisible.getHiddenProp();
                    if (e) {
                        var t = e.replace(/[H|h]idden/, "") + "visibilitychange";
                        document.addEventListener(t, function() {
                            if (m.pauseInvisible.isHidden()) {
                                if (r.startTimeout) {
                                    clearTimeout(r.startTimeout)
                                } else {
                                    r.pause()
                                }
                            } else {
                                if (r.started) {
                                    r.play()
                                } else {
                                    if (r.vars.initDelay > 0) {
                                        setTimeout(r.play, r.vars.initDelay)
                                    } else {
                                        r.play()
                                    }
                                }
                            }
                        })
                    }
                },
                isHidden: function() {
                    var e = m.pauseInvisible.getHiddenProp();
                    if (!e) {
                        return false
                    }
                    return document[e]
                },
                getHiddenProp: function() {
                    var e = ["webkit", "moz", "ms", "o"];
                    if ("hidden" in document) {
                        return "hidden"
                    }
                    for (var t = 0; t < e.length; t++) {
                        if (e[t] + "Hidden" in document) {
                            return e[t] + "Hidden"
                        }
                    }
                    return null
                }
            },
            setToClearWatchedEvent: function() {
                clearTimeout(d);
                d = setTimeout(function() {
                    u = ""
                }, 3e3)
            }
        };
        r.flexAnimate = function(t, i, a, n, l) {
            if (!r.vars.animationLoop && t !== r.currentSlide) {
                r.direction = t > r.currentSlide ? "next" : "prev"
            }
            if (v && r.pagingCount === 1) r.direction = r.currentItem < t ? "next" : "prev";
            if (!r.animating && (r.canAdvance(t, l) || a) && r.is(":visible")) {
                if (v && n) {
                    var u = e(r.vars.asNavFor).data("flexslider");
                    r.atEnd = t === 0 || t === r.count - 1;
                    u.flexAnimate(t, true, false, true, l);
                    r.direction = r.currentItem < t ? "next" : "prev";
                    u.direction = r.direction;
                    if (Math.ceil((t + 1) / r.visible) - 1 !== r.currentSlide && t !== 0) {
                        r.currentItem = t;
                        r.slides.removeClass(s + "active-slide").eq(t).addClass(s + "active-slide");
                        t = Math.floor(t / r.visible)
                    } else {
                        r.currentItem = t;
                        r.slides.removeClass(s + "active-slide").eq(t).addClass(s + "active-slide");
                        return false
                    }
                }
                r.animating = true;
                r.animatingTo = t;
                if (i) {
                    r.pause()
                }
                r.vars.before(r);
                if (r.syncExists && !l) {
                    m.sync("animate")
                }
                if (r.vars.controlNav) {
                    m.controlNav.active()
                }
                if (!p) {
                    r.slides.removeClass(s + "active-slide").eq(t).addClass(s + "active-slide")
                }
                r.atEnd = t === 0 || t === r.last;
                if (r.vars.directionNav) {
                    m.directionNav.update()
                }
                if (t === r.last) {
                    r.vars.end(r);
                    if (!r.vars.animationLoop) {
                        r.pause()
                    }
                }
                if (!f) {
                    var d = c ? r.slides.filter(":first").height() : r.computedW,
                        g, y, C;
                    if (p) {
                        g = r.vars.itemMargin;
                        C = (r.itemW + g) * r.move * r.animatingTo;
                        y = C > r.limit && r.visible !== 1 ? r.limit : C
                    } else if (r.currentSlide === 0 && t === r.count - 1 && r.vars.animationLoop && r.direction !== "next") {
                        y = h ? (r.count + r.cloneOffset) * d : 0
                    } else if (r.currentSlide === r.last && t === 0 && r.vars.animationLoop && r.direction !== "prev") {
                        y = h ? 0 : (r.count + 1) * d
                    } else {
                        y = h ? (r.count - 1 - t + r.cloneOffset) * d : (t + r.cloneOffset) * d
                    }
                    r.setProps(y, "", r.vars.animationSpeed);
                    if (r.transitions) {
                        if (!r.vars.animationLoop || !r.atEnd) {
                            r.animating = false;
                            r.currentSlide = r.animatingTo
                        }
                        r.container.unbind("webkitTransitionEnd transitionend");
                        r.container.bind("webkitTransitionEnd transitionend", function() {
                            clearTimeout(r.ensureAnimationEnd);
                            r.wrapup(d)
                        });
                        clearTimeout(r.ensureAnimationEnd);
                        r.ensureAnimationEnd = setTimeout(function() {
                            r.wrapup(d)
                        }, r.vars.animationSpeed + 100)
                    } else {
                        r.container.animate(r.args, r.vars.animationSpeed, r.vars.easing, function() {
                            r.wrapup(d)
                        })
                    }
                } else {
                    if (!o) {
                        r.slides.eq(r.currentSlide).css({
                            zIndex: 1
                        }).animate({
                            opacity: 0
                        }, r.vars.animationSpeed, r.vars.easing);
                        r.slides.eq(t).css({
                            zIndex: 2
                        }).animate({
                            opacity: 1
                        }, r.vars.animationSpeed, r.vars.easing, r.wrapup)
                    } else {
                        r.slides.eq(r.currentSlide).css({
                            opacity: 0,
                            zIndex: 1
                        });
                        r.slides.eq(t).css({
                            opacity: 1,
                            zIndex: 2
                        });
                        r.wrapup(d)
                    }
                }
                if (r.vars.smoothHeight) {
                    m.smoothHeight(r.vars.animationSpeed)
                }
            }
        };
        r.wrapup = function(e) {
            if (!f && !p) {
                if (r.currentSlide === 0 && r.animatingTo === r.last && r.vars.animationLoop) {
                    r.setProps(e, "jumpEnd")
                } else if (r.currentSlide === r.last && r.animatingTo === 0 && r.vars.animationLoop) {
                    r.setProps(e, "jumpStart")
                }
            }
            r.animating = false;
            r.currentSlide = r.animatingTo;
            r.vars.after(r)
        };
        r.animateSlides = function() {
            if (!r.animating && t) {
                r.flexAnimate(r.getTarget("next"))
            }
        };
        r.pause = function() {
            clearInterval(r.animatedSlides);
            r.animatedSlides = null;
            r.playing = false;
            if (r.vars.pausePlay) {
                m.pausePlay.update("play")
            }
            if (r.syncExists) {
                m.sync("pause")
            }
        };
        r.play = function() {
            if (r.playing) {
                clearInterval(r.animatedSlides)
            }
            r.animatedSlides = r.animatedSlides || setInterval(r.animateSlides, r.vars.slideshowSpeed);
            r.started = r.playing = true;
            if (r.vars.pausePlay) {
                m.pausePlay.update("pause")
            }
            if (r.syncExists) {
                m.sync("play")
            }
        };
        r.stop = function() {
            r.pause();
            r.stopped = true
        };
        r.canAdvance = function(e, t) {
            var i = v ? r.pagingCount - 1 : r.last;
            return t ? true : v && r.currentItem === r.count - 1 && e === 0 && r.direction === "prev" ? true : v && r.currentItem === 0 && e === r.pagingCount - 1 && r.direction !== "next" ? false : e === r.currentSlide && !v ? false : r.vars.animationLoop ? true : r.atEnd && r.currentSlide === 0 && e === i && r.direction !== "next" ? false : r.atEnd && r.currentSlide === i && e === 0 && r.direction === "next" ? false : true
        };
        r.getTarget = function(e) {
            r.direction = e;
            if (e === "next") {
                return r.currentSlide === r.last ? 0 : r.currentSlide + 1
            } else {
                return r.currentSlide === 0 ? r.last : r.currentSlide - 1
            }
        };
        r.setProps = function(e, t, i) {
            var a = function() {
                var i = e ? e : (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo,
                    a = function() {
                        if (p) {
                            return t === "setTouch" ? e : h && r.animatingTo === r.last ? 0 : h ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : r.animatingTo === r.last ? r.limit : i
                        } else {
                            switch (t) {
                                case "setTotal":
                                    return h ? (r.count - 1 - r.currentSlide + r.cloneOffset) * e : (r.currentSlide + r.cloneOffset) * e;
                                case "setTouch":
                                    return h ? e : e;
                                case "jumpEnd":
                                    return h ? e : r.count * e;
                                case "jumpStart":
                                    return h ? r.count * e : e;
                                default:
                                    return e
                            }
                        }
                    }();
                return a * -1 + "px"
            }();
            if (r.transitions) {
                a = c ? "translate3d(0," + a + ",0)" : "translate3d(" + a + ",0,0)";
                i = i !== undefined ? i / 1e3 + "s" : "0s";
                r.container.css("-" + r.pfx + "-transition-duration", i);
                r.container.css("transition-duration", i)
            }
            r.args[r.prop] = a;
            if (r.transitions || i === undefined) {
                r.container.css(r.args)
            }
            r.container.css("transform", a)
        };
        r.setup = function(t) {
            if (!f) {
                var i, a;
                if (t === "init") {
                    r.viewport = e('<div class="' + s + 'viewport"></div>').css({
                        overflow: "hidden",
                        position: "relative"
                    }).appendTo(r).append(r.container);
                    r.cloneCount = 0;
                    r.cloneOffset = 0;
                    if (h) {
                        a = e.makeArray(r.slides).reverse();
                        r.slides = e(a);
                        r.container.empty().append(r.slides)
                    }
                }
                if (r.vars.animationLoop && !p) {
                    r.cloneCount = 2;
                    r.cloneOffset = 1;
                    if (t !== "init") {
                        r.container.find(".clone").remove()
                    }
                    r.container.append(m.uniqueID(r.slides.first().clone().addClass("clone")).attr("aria-hidden", "true")).prepend(m.uniqueID(r.slides.last().clone().addClass("clone")).attr("aria-hidden", "true"))
                }
                r.newSlides = e(r.vars.selector, r);
                i = h ? r.count - 1 - r.currentSlide + r.cloneOffset : r.currentSlide + r.cloneOffset;
                if (c && !p) {
                    r.container.height((r.count + r.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
                    setTimeout(function() {
                        r.newSlides.css({
                            display: "block"
                        });
                        r.doMath();
                        r.viewport.height(r.h);
                        r.setProps(i * r.h, "init")
                    }, t === "init" ? 100 : 0)
                } else {
                    r.container.width((r.count + r.cloneCount) * 200 + "%");
                    r.setProps(i * r.computedW, "init");
                    setTimeout(function() {
                        r.doMath();
                        r.newSlides.css({
                            width: r.computedW,
                            marginRight: r.computedM,
                            float: "left",
                            display: "block"
                        });
                        if (r.vars.smoothHeight) {
                            m.smoothHeight()
                        }
                    }, t === "init" ? 100 : 0)
                }
            } else {
                r.slides.css({
                    width: "100%",
                    float: "left",
                    marginRight: "-100%",
                    position: "relative"
                });
                if (t === "init") {
                    if (!o) {
                        if (r.vars.fadeFirstSlide == false) {
                            r.slides.css({
                                opacity: 0,
                                display: "block",
                                zIndex: 1
                            }).eq(r.currentSlide).css({
                                zIndex: 2
                            }).css({
                                opacity: 1
                            })
                        } else {
                            r.slides.css({
                                opacity: 0,
                                display: "block",
                                zIndex: 1
                            }).eq(r.currentSlide).css({
                                zIndex: 2
                            }).animate({
                                opacity: 1
                            }, r.vars.animationSpeed, r.vars.easing)
                        }
                    } else {
                        r.slides.css({
                            opacity: 0,
                            display: "block",
                            webkitTransition: "opacity " + r.vars.animationSpeed / 1e3 + "s ease",
                            zIndex: 1
                        }).eq(r.currentSlide).css({
                            opacity: 1,
                            zIndex: 2
                        })
                    }
                }
                if (r.vars.smoothHeight) {
                    m.smoothHeight()
                }
            }
            if (!p) {
                r.slides.removeClass(s + "active-slide").eq(r.currentSlide).addClass(s + "active-slide")
            }
            r.vars.init(r)
        };
        r.doMath = function() {
            var e = r.slides.first(),
                t = r.vars.itemMargin,
                i = r.vars.minItems,
                a = r.vars.maxItems;
            r.w = r.viewport === undefined ? r.width() : r.viewport.width();
            r.h = e.height();
            r.boxPadding = e.outerWidth() - e.width();
            if (p) {
                r.itemT = r.vars.itemWidth + t;
                r.itemM = t;
                r.minW = i ? i * r.itemT : r.w;
                r.maxW = a ? a * r.itemT - t : r.w;
                r.itemW = r.minW > r.w ? (r.w - t * (i - 1)) / i : r.maxW < r.w ? (r.w - t * (a - 1)) / a : r.vars.itemWidth > r.w ? r.w : r.vars.itemWidth;
                r.visible = Math.floor(r.w / r.itemW);
                r.move = r.vars.move > 0 && r.vars.move < r.visible ? r.vars.move : r.visible;
                r.pagingCount = Math.ceil((r.count - r.visible) / r.move + 1);
                r.last = r.pagingCount - 1;
                r.limit = r.pagingCount === 1 ? 0 : r.vars.itemWidth > r.w ? r.itemW * (r.count - 1) + t * (r.count - 1) : (r.itemW + t) * r.count - r.w - t
            } else {
                r.itemW = r.w;
                r.itemM = t;
                r.pagingCount = r.count;
                r.last = r.count - 1
            }
            r.computedW = r.itemW - r.boxPadding;
            r.computedM = r.itemM
        };
        r.update = function(e, t) {
            r.doMath();
            if (!p) {
                if (e < r.currentSlide) {
                    r.currentSlide += 1
                } else if (e <= r.currentSlide && e !== 0) {
                    r.currentSlide -= 1
                }
                r.animatingTo = r.currentSlide
            }
            if (r.vars.controlNav && !r.manualControls) {
                if (t === "add" && !p || r.pagingCount > r.controlNav.length) {
                    m.controlNav.update("add")
                } else if (t === "remove" && !p || r.pagingCount < r.controlNav.length) {
                    if (p && r.currentSlide > r.last) {
                        r.currentSlide -= 1;
                        r.animatingTo -= 1
                    }
                    m.controlNav.update("remove", r.last)
                }
            }
            if (r.vars.directionNav) {
                m.directionNav.update()
            }
        };
        r.addSlide = function(t, i) {
            var a = e(t);
            r.count += 1;
            r.last = r.count - 1;
            if (c && h) {
                i !== undefined ? r.slides.eq(r.count - i).after(a) : r.container.prepend(a)
            } else {
                i !== undefined ? r.slides.eq(i).before(a) : r.container.append(a)
            }
            r.update(i, "add");
            r.slides = e(r.vars.selector + ":not(.clone)", r);
            r.setup();
            r.vars.added(r)
        };
        r.removeSlide = function(t) {
            var i = isNaN(t) ? r.slides.index(e(t)) : t;
            r.count -= 1;
            r.last = r.count - 1;
            if (isNaN(t)) {
                e(t, r.slides).remove()
            } else {
                c && h ? r.slides.eq(r.last).remove() : r.slides.eq(t).remove()
            }
            r.doMath();
            r.update(i, "remove");
            r.slides = e(r.vars.selector + ":not(.clone)", r);
            r.setup();
            r.vars.removed(r)
        };
        m.init()
    };
    e(window).blur(function(e) {
        t = false
    }).focus(function(e) {
        t = true
    });
    e.flexslider.defaults = {
        namespace: "flex-",
        selector: ".slides > li",
        animation: "fade",
        easing: "swing",
        direction: "horizontal",
        reverse: false,
        animationLoop: true,
        smoothHeight: false,
        startAt: 0,
        slideshow: true,
        slideshowSpeed: 7e3,
        animationSpeed: 600,
        initDelay: 0,
        randomize: false,
        fadeFirstSlide: true,
        thumbCaptions: false,
        pauseOnAction: true,
        pauseOnHover: false,
        pauseInvisible: true,
        useCSS: true,
        touch: true,
        video: false,
        controlNav: true,
        directionNav: true,
        prevText: "Previous",
        nextText: "Next",
        keyboard: true,
        multipleKeyboard: false,
        mousewheel: false,
        pausePlay: false,
        pauseText: "Pause",
        playText: "Play",
        controlsContainer: "",
        manualControls: "",
        customDirectionNav: "",
        sync: "",
        asNavFor: "",
        itemWidth: 0,
        itemMargin: 0,
        minItems: 1,
        maxItems: 0,
        move: 0,
        allowOneSlide: true,
        start: function() {},
        before: function() {},
        after: function() {},
        end: function() {},
        added: function() {},
        removed: function() {},
        init: function() {}
    };
    e.fn.flexslider = function(t) {
        if (t === undefined) {
            t = {}
        }
        if (typeof t === "object") {
            return this.each(function() {
                var i = e(this),
                    a = t.selector ? t.selector : ".slides > li",
                    r = i.find(a);
                if (r.length === 1 && t.allowOneSlide === true || r.length === 0) {
                    r.fadeIn(400);
                    if (t.start) {
                        t.start(i)
                    }
                } else if (i.data("flexslider") === undefined) {
                    new e.flexslider(this, t)
                }
            })
        } else {
            var i = e(this).data("flexslider");
            switch (t) {
                case "play":
                    i.play();
                    break;
                case "pause":
                    i.pause();
                    break;
                case "stop":
                    i.stop();
                    break;
                case "next":
                    i.flexAnimate(i.getTarget("next"), true);
                    break;
                case "prev":
                case "previous":
                    i.flexAnimate(i.getTarget("prev"), true);
                    break;
                default:
                    if (typeof t === "number") {
                        i.flexAnimate(t, true)
                    }
            }
        }
    }
})(jQuery);
! function(e, t, i) {
    "use strict";
    "undefined" != typeof module && module.exports ? module.exports = i(t, e) : "function" == typeof define && define.amd ? define(function() {
        return i(t, e)
    }) : e[t] = i(t, e)
}(window, "Audio5js", function(e, t) {
    "use strict";

    function i(e) {
        this.message = e
    }

    function a(e) {
        var t, i = {};
        for (t in e) "object" == typeof e[t] ? i[t] = a(e[t]) : i[t] = e[t];
        return i
    }
    var r = t.ActiveXObject;
    i.prototype = new Error;
    var s = function(e, t) {
            var i, r = a(t);
            for (i in r) r.hasOwnProperty(i) && (e[i] = r[i]);
            return e
        },
        n = function(e, t) {
            return s(e.prototype, t)
        },
        o = {
            on: function(e, t, i) {
                this.subscribe(e, t, i, !1)
            },
            one: function(e, t, i) {
                this.subscribe(e, t, i, !0)
            },
            off: function(e, t) {
                if (void 0 !== this.channels[e]) {
                    var i, a;
                    for (i = 0, a = this.channels[e].length; a > i; i++) {
                        var r = this.channels[e][i].fn;
                        if (r === t) {
                            this.channels[e].splice(i, 1);
                            break
                        }
                    }
                }
            },
            subscribe: function(e, t, i, a) {
                void 0 === this.channels && (this.channels = {}), this.channels[e] = this.channels[e] || [], this.channels[e].push({
                    fn: t,
                    ctx: i,
                    once: a || !1
                })
            },
            trigger: function(e) {
                if (this.channels && this.channels.hasOwnProperty(e)) {
                    for (var t = Array.prototype.slice.call(arguments, 1), i = []; this.channels[e].length > 0;) {
                        var a = this.channels[e].shift();
                        "function" == typeof a.fn && a.fn.apply(a.ctx, t), a.once || i.push(a)
                    }
                    this.channels[e] = i
                }
            }
        },
        l = {
            flash_embed_code: function(t, i, a) {
                var s, n = '<param name="movie" value="' + i + "?playerInstance=window." + e + "_flash.instances['" + t + "']&datetime=" + a + '"/><param name="wmode" value="transparent"/><param name="allowscriptaccess" value="always" /></object>';
                return s = r ? '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="1" height="1" id="' + t + '">' : '<object type="application/x-shockwave-flash" data="' + i + "?playerInstance=window." + e + "_flash.instances['" + t + "']&datetime=" + a + '" width="1" height="1" id="' + t + '" >', s + n
            },
            can_play: function(e) {
                var t, i = document.createElement("audio");
                switch (e) {
                    case "mp3":
                        t = "audio/mpeg;";
                        break;
                    case "vorbis":
                        t = 'audio/ogg; codecs="vorbis"';
                        break;
                    case "opus":
                        t = 'audio/ogg; codecs="opus"';
                        break;
                    case "webm":
                        t = 'audio/webm; codecs="vorbis"';
                        break;
                    case "mp4":
                        t = 'audio/mp4; codecs="mp4a.40.5"';
                        break;
                    case "wav":
                        t = 'audio/wav; codecs="1"'
                }
                if (void 0 !== t) {
                    if ("mp3" === e && navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/Firefox/i)) return !0;
                    try {
                        return !!i.canPlayType && "" !== i.canPlayType(t)
                    } catch (e) {
                        return !1
                    }
                }
                return !1
            },
            has_flash: function() {
                var e = !1;
                if (navigator.plugins && navigator.plugins.length && navigator.plugins["Shockwave Flash"]) e = !0;
                else if (navigator.mimeTypes && navigator.mimeTypes.length) {
                    var t = navigator.mimeTypes["application/x-shockwave-flash"];
                    e = t && t.enabledPlugin
                } else try {
                    var i = new r("ShockwaveFlash.ShockwaveFlash");
                    e = "object" == typeof i
                } catch (e) {}
                return e
            }(),
            embedFlash: function(i, a) {
                var r = document.createElement("div");
                if (r.style.position = "absolute", r.style.width = "1px", r.style.height = "1px", r.style.top = "1px", document.body.appendChild(r), "object" == typeof t.swfobject) {
                    var s = {
                            playerInstance: "window." + e + "_flash.instances['" + a + "']"
                        },
                        n = {
                            allowscriptaccess: "always",
                            wmode: "transparent"
                        };
                    r.innerHTML = '<div id="' + a + '"></div>', swfobject.embedSWF(i + "?ts=" + ((new Date).getTime() + Math.random()), a, "1", "1", "9.0.0", null, s, n)
                } else {
                    var o = (new Date).getTime() + Math.random();
                    r.innerHTML = this.flash_embed_code(a, i, o)
                }
                return document.getElementById(a)
            },
            formatTime: function(e) {
                var t, i = parseInt(e / 3600, 10) % 24,
                    a = parseInt(e / 60, 10) % 60,
                    r = parseInt(e % 60, 10),
                    s = (10 > a ? "0" + a : a) + ":" + (10 > r ? "0" + r : r);
                return t = i > 0 ? (10 > i ? "0" + i : i) + ":" + s : s
            }
        };
    l.use_flash = l.can_play("mp3");
    var u, d, c, h = {
            playing: !1,
            vol: 1,
            duration: 0,
            position: 0,
            load_percent: 0,
            seekable: !1,
            ready: null
        },
        p = t[e + "_flash"] = t[e + "_flash"] || {
            instances: {},
            count: 0
        };
    d = function() {
        if (l.use_flash && !l.has_flash) throw new Error("Flash Plugin Missing")
    }, d.prototype = {
        init: function(t) {
            p.count += 1, this.id = e + p.count, p.instances[this.id] = this, this.embed(t)
        },
        embed: function(e) {
            l.embedFlash(e, this.id)
        },
        eiReady: function() {
            this.audio = document.getElementById(this.id), this.trigger("ready")
        },
        eiLoadStart: function() {
            this.trigger("loadstart")
        },
        eiLoadedMetadata: function() {
            this.trigger("loadedmetadata")
        },
        eiCanPlay: function() {
            this.trigger("canplay")
        },
        eiTimeUpdate: function(e, t, i) {
            this.position = e, this.duration = t, this.seekable = i, this.trigger("timeupdate", e, this.seekable ? t : null)
        },
        eiProgress: function(e, t, i) {
            this.load_percent = e, this.duration = t, this.seekable = i, this.trigger("progress", e)
        },
        eiLoadError: function(e) {
            this.trigger("error", e)
        },
        eiPlay: function() {
            this.playing = !0, this.trigger("play"), this.trigger("playing")
        },
        eiPause: function() {
            this.playing = !1, this.trigger("pause")
        },
        eiEnded: function() {
            this.pause(), this.trigger("ended")
        },
        eiSeeking: function() {
            this.trigger("seeking")
        },
        eiSeeked: function() {
            this.trigger("seeked")
        },
        reset: function() {
            this.seekable = !1, this.duration = 0, this.position = 0, this.load_percent = 0
        },
        load: function(e) {
            this.reset(), this.audio.load(e)
        },
        play: function() {
            this.audio.pplay()
        },
        pause: function() {
            this.audio.ppause()
        },
        volume: function(e) {
            return void 0 === e || isNaN(parseInt(e, 10)) ? this.vol : (this.audio.setVolume(e), void(this.vol = e))
        },
        seek: function(e) {
            try {
                this.audio.seekTo(e), this.position = e
            } catch (e) {}
        },
        destroyAudio: function() {
            this.audio && (this.pause(), this.audio.parentNode.removeChild(this.audio), delete p.instances[this.id], delete this.audio)
        }
    }, n(d, o), n(d, h), c = function() {}, c.prototype = {
        init: function() {
            this.trigger("ready")
        },
        createAudio: function() {
            this.audio = new Audio, this.audio.autoplay = !1, this.audio.preload = "auto", this.audio.autobuffer = !0, this.bindEvents()
        },
        destroyAudio: function() {
            if (this.audio) {
                this.pause(), this.unbindEvents();
                try {
                    this.audio.setAttribute("src", "")
                } finally {
                    delete this.audio
                }
            }
        },
        setupEventListeners: function() {
            this.listeners = {
                loadstart: this.onLoadStart.bind(this),
                canplay: this.onLoad.bind(this),
                loadedmetadata: this.onLoadedMetadata.bind(this),
                play: this.onPlay.bind(this),
                playing: this.onPlaying.bind(this),
                pause: this.onPause.bind(this),
                ended: this.onEnded.bind(this),
                error: this.onError.bind(this),
                timeupdate: this.onTimeUpdate.bind(this),
                seeking: this.onSeeking.bind(this),
                seeked: this.onSeeked.bind(this)
            }
        },
        bindEvents: function() {
            void 0 === this.listeners && this.setupEventListeners(), this.audio.addEventListener("loadstart", this.listeners.loadstart, !1), this.audio.addEventListener("canplay", this.listeners.canplay, !1), this.audio.addEventListener("loadedmetadata", this.listeners.loadedmetadata, !1), this.audio.addEventListener("play", this.listeners.play, !1), this.audio.addEventListener("playing", this.listeners.playing, !1), this.audio.addEventListener("pause", this.listeners.pause, !1), this.audio.addEventListener("ended", this.listeners.ended, !1), this.audio.addEventListener("error", this.listeners.error, !1), this.audio.addEventListener("timeupdate", this.listeners.timeupdate, !1), this.audio.addEventListener("seeking", this.listeners.seeking, !1), this.audio.addEventListener("seeked", this.listeners.seeked, !1)
        },
        unbindEvents: function() {
            this.audio.removeEventListener("loadstart", this.listeners.loadstart), this.audio.removeEventListener("canplay", this.listeners.canplay), this.audio.removeEventListener("loadedmetadata", this.listeners.loadedmetadata), this.audio.removeEventListener("play", this.listeners.play), this.audio.removeEventListener("playing", this.listeners.playing), this.audio.removeEventListener("pause", this.listeners.pause), this.audio.removeEventListener("ended", this.listeners.ended), this.audio.removeEventListener("error", this.listeners.error), this.audio.removeEventListener("timeupdate", this.listeners.timeupdate), this.audio.removeEventListener("seeking", this.listeners.seeking), this.audio.removeEventListener("seeked", this.listeners.seeked)
        },
        onLoadStart: function() {
            this.trigger("loadstart")
        },
        onLoad: function() {
            return this.audio ? (this.seekable = this.audio.seekable && this.audio.seekable.length > 0, this.seekable && (this.timer = setInterval(this.onProgress.bind(this), 250)), void this.trigger("canplay")) : setTimeout(this.onLoad.bind(this), 100)
        },
        onLoadedMetadata: function() {
            this.trigger("loadedmetadata")
        },
        onPlay: function() {
            this.playing = !0, this.trigger("play")
        },
        onPlaying: function() {
            this.playing = !0, this.trigger("playing")
        },
        onPause: function() {
            this.playing = !1, this.trigger("pause")
        },
        onEnded: function() {
            this.playing = !1, this.trigger("ended")
        },
        onTimeUpdate: function() {
            if (this.audio && this.playing) {
                try {
                    this.position = this.audio.currentTime, this.duration = this.audio.duration === 1 / 0 ? null : this.audio.duration
                } catch (e) {}
                this.trigger("timeupdate", this.position, this.duration)
            }
        },
        onProgress: function() {
            this.audio && null !== this.audio.buffered && this.audio.buffered.length && (this.duration = this.audio.duration === 1 / 0 ? null : this.audio.duration, this.load_percent = parseInt(this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration * 100, 10), this.trigger("progress", this.load_percent), this.load_percent >= 100 && this.clearLoadProgress())
        },
        onError: function(e) {
            this.trigger("error", e)
        },
        onSeeking: function() {
            this.trigger("seeking")
        },
        onSeeked: function() {
            this.trigger("seeked")
        },
        clearLoadProgress: function() {
            void 0 !== this.timer && (clearInterval(this.timer), delete this.timer)
        },
        reset: function() {
            this.clearLoadProgress(), this.seekable = !1, this.duration = 0, this.position = 0, this.load_percent = 0
        },
        load: function(e) {
            this.reset(), this.trigger("pause"), void 0 === this.audio && this.createAudio(), this.audio.setAttribute("src", e), this.audio.load()
        },
        play: function() {
            this.audio && this.audio.play()
        },
        pause: function() {
            this.audio && this.audio.pause()
        },
        volume: function(e) {
            if (void 0 === e || isNaN(parseInt(e, 10))) return this.vol;
            var t = 0 > e ? 0 : Math.min(1, e);
            this.audio.volume = t, this.vol = t
        },
        seek: function(e) {
            var t = this.playing;
            this.position = e, this.audio.currentTime = e, t ? this.play() : null !== this.audio.buffered && this.audio.buffered.length && this.trigger("timeupdate", this.position, this.duration)
        }
    }, n(c, o), n(c, h);
    var f = {
        swf_path: "/swf/audiojs.swf",
        throw_errors: !0,
        format_time: !0,
        codecs: ["mp3"]
    };
    return u = function(e) {
        e = e || {};
        var t;
        for (t in f) f.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = f[t]);
        this.init(e)
    }, u.can_play = function(e) {
        return l.can_play(e)
    }, u.prototype = {
        init: function(e) {
            this.ready = !1, this.settings = e, this.audio = this.getPlayer(), this.bindAudioEvents(), this.settings.use_flash ? this.audio.init(e.swf_path) : this.audio.init()
        },
        getPlayer: function() {
            var e, t, i, a;
            if (this.settings.use_flash) i = new d, this.settings.player = {
                engine: "flash",
                codec: "mp3"
            };
            else {
                for (e = 0, t = this.settings.codecs.length; t > e; e++)
                    if (a = this.settings.codecs[e], u.can_play(a)) {
                        i = new c, this.settings.use_flash = !1, this.settings.player = {
                            engine: "html",
                            codec: a
                        };
                        break
                    }
                void 0 === i && (this.settings.use_flash = !u.can_play("mp3"), i = this.settings.use_flash ? new d : new c, this.settings.player = {
                    engine: this.settings.use_flash ? "flash" : "html",
                    codec: "mp3"
                })
            }
            return i
        },
        bindAudioEvents: function() {
            this.audio.on("ready", this.onReady, this), this.audio.on("loadstart", this.onLoadStart, this), this.audio.on("loadedmetadata", this.onLoadedMetadata, this), this.audio.on("play", this.onPlay, this), this.audio.on("pause", this.onPause, this), this.audio.on("ended", this.onEnded, this), this.audio.on("canplay", this.onCanPlay, this), this.audio.on("timeupdate", this.onTimeUpdate, this), this.audio.on("progress", this.onProgress, this), this.audio.on("error", this.onError, this), this.audio.on("seeking", this.onSeeking, this), this.audio.on("seeked", this.onSeeked, this)
        },
        unbindAudioEvents: function() {
            this.audio.off("ready", this.onReady), this.audio.off("loadstart", this.onLoadStart), this.audio.off("loadedmetadata", this.onLoadedMetadata),
                this.audio.off("play", this.onPlay), this.audio.off("pause", this.onPause), this.audio.off("ended", this.onEnded), this.audio.off("canplay", this.onCanPlay), this.audio.off("timeupdate", this.onTimeUpdate), this.audio.off("progress", this.onProgress), this.audio.off("error", this.onError), this.audio.off("seeking", this.onSeeking), this.audio.off("seeked", this.onSeeked)
        },
        load: function(e) {
            var t = this,
                i = function(e) {
                    t.audio.load(e), t.trigger("load")
                };
            this.ready ? i(e) : this.on("ready", i)
        },
        play: function() {
            this.playing || this.audio.play()
        },
        pause: function() {
            this.playing && this.audio.pause()
        },
        playPause: function() {
            this[this.playing ? "pause" : "play"]()
        },
        volume: function(e) {
            return void 0 === e || isNaN(parseInt(e, 10)) ? this.vol : (this.audio.volume(e), void(this.vol = e))
        },
        seek: function(e) {
            this.audio.seek(e), this.position = e
        },
        destroy: function() {
            this.unbindAudioEvents(), this.audio.destroyAudio()
        },
        onReady: function() {
            this.ready = !0, "function" == typeof this.settings.ready && this.settings.ready.call(this, this.settings.player), this.trigger("ready")
        },
        onLoadStart: function() {
            this.trigger("loadstart")
        },
        onLoadedMetadata: function() {
            this.trigger("loadedmetadata")
        },
        onPlay: function() {
            this.playing = !0, this.trigger("play")
        },
        onPause: function() {
            this.playing = !1, this.trigger("pause")
        },
        onEnded: function() {
            this.playing = !1, this.trigger("ended")
        },
        onError: function() {
            var e = new i("Audio Error. Failed to Load Audio");
            if (this.settings.throw_errors) throw e;
            this.trigger("error", e)
        },
        onCanPlay: function() {
            this.trigger("canplay")
        },
        onSeeking: function() {
            this.trigger("seeking")
        },
        onSeeked: function() {
            this.trigger("seeked")
        },
        onTimeUpdate: function(e, t) {
            this.position = this.settings.format_time ? l.formatTime(e) : e, this.duration !== t && (this.duration = this.settings.format_time && null !== t ? l.formatTime(t) : t), this.trigger("timeupdate", this.position, this.duration)
        },
        onProgress: function(e) {
            this.duration = this.audio.duration, this.load_percent = e, this.trigger("progress", e)
        }
    }, n(u, o), n(u, h), u
});

function MarkerClusterer(e, t, i) {
    this.extend(MarkerClusterer, google.maps.OverlayView);
    this.map_ = e;
    this.markers_ = [];
    this.clusters_ = [];
    this.sizes = [53, 56, 66, 78, 90];
    this.styles_ = [];
    this.cssClass_ = "";
    this.ready_ = false;
    var a = i || {};
    this.gridSize_ = a["gridSize"] || 60;
    this.minClusterSize_ = a["minimumClusterSize"] || 2;
    this.maxZoom_ = a["maxZoom"] || null;
    this.styles_ = a["styles"] || [];
    this.cssClass_ = a["cssClass"] || null;
    this.imagePath_ = a["imagePath"] || this.MARKER_CLUSTER_IMAGE_PATH_;
    this.imageExtension_ = a["imageExtension"] || this.MARKER_CLUSTER_IMAGE_EXTENSION_;
    this.zoomOnClick_ = true;
    if (a["zoomOnClick"] != undefined) {
        this.zoomOnClick_ = a["zoomOnClick"]
    }
    this.averageCenter_ = false;
    if (a["averageCenter"] != undefined) {
        this.averageCenter_ = a["averageCenter"]
    }
    this.setupStyles_();
    this.setMap(e);
    this.prevZoom_ = this.map_.getZoom();
    var r = this;
    google.maps.event.addListener(this.map_, "zoom_changed", function() {
        var e = r.map_.getZoom();
        if (r.prevZoom_ != e) {
            r.prevZoom_ = e;
            r.resetViewport()
        }
    });
    google.maps.event.addListener(this.map_, "idle", function() {
        r.redraw()
    });
    if (t && t.length) {
        this.addMarkers(t, false)
    }
}
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/" + "images/m";
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = "png";
MarkerClusterer.prototype.extend = function(e, t) {
    return function(e) {
        for (var t in e.prototype) {
            this.prototype[t] = e.prototype[t]
        }
        return this
    }.apply(e, [t])
};
MarkerClusterer.prototype.onAdd = function() {
    this.setReady_(true)
};
MarkerClusterer.prototype.draw = function() {};
MarkerClusterer.prototype.setupStyles_ = function() {
    if (this.styles_.length) {
        return
    }
    for (var e = 0, t; t = this.sizes[e]; e++) {
        this.styles_.push({
            url: this.imagePath_ + (e + 1) + "." + this.imageExtension_,
            height: t,
            width: t
        })
    }
};
MarkerClusterer.prototype.fitMapToMarkers = function() {
    var e = this.getMarkers();
    var t = new google.maps.LatLngBounds;
    for (var i = 0, a; a = e[i]; i++) {
        t.extend(a.getPosition())
    }
    this.map_.fitBounds(t)
};
MarkerClusterer.prototype.setStyles = function(e) {
    this.styles_ = e
};
MarkerClusterer.prototype.getStyles = function() {
    return this.styles_
};
MarkerClusterer.prototype.isZoomOnClick = function() {
    return this.zoomOnClick_
};
MarkerClusterer.prototype.isAverageCenter = function() {
    return this.averageCenter_
};
MarkerClusterer.prototype.getMarkers = function() {
    return this.markers_
};
MarkerClusterer.prototype.getTotalMarkers = function() {
    return this.markers_.length
};
MarkerClusterer.prototype.setMaxZoom = function(e) {
    this.maxZoom_ = e
};
MarkerClusterer.prototype.getMaxZoom = function() {
    return this.maxZoom_
};
MarkerClusterer.prototype.calculator_ = function(e, t) {
    var i = 0;
    var a = e.length;
    var r = a;
    while (r !== 0) {
        r = parseInt(r / 10, 10);
        i++
    }
    i = Math.min(i, t);
    return {
        text: a,
        index: i
    }
};
MarkerClusterer.prototype.setCalculator = function(e) {
    this.calculator_ = e
};
MarkerClusterer.prototype.getCalculator = function() {
    return this.calculator_
};
MarkerClusterer.prototype.addMarkers = function(e, t) {
    for (var i = 0, a; a = e[i]; i++) {
        this.pushMarkerTo_(a)
    }
    if (!t) {
        this.redraw()
    }
};
MarkerClusterer.prototype.pushMarkerTo_ = function(e) {
    e.isAdded = false;
    if (e["draggable"]) {
        var t = this;
        google.maps.event.addListener(e, "dragend", function() {
            e.isAdded = false;
            t.repaint()
        })
    }
    this.markers_.push(e)
};
MarkerClusterer.prototype.addMarker = function(e, t) {
    this.pushMarkerTo_(e);
    if (!t) {
        this.redraw()
    }
};
MarkerClusterer.prototype.removeMarker_ = function(e) {
    var t = -1;
    if (this.markers_.indexOf) {
        t = this.markers_.indexOf(e)
    } else {
        for (var i = 0, a; a = this.markers_[i]; i++) {
            if (a == e) {
                t = i;
                break
            }
        }
    }
    if (t == -1) {
        return false
    }
    e.setMap(null);
    this.markers_.splice(t, 1);
    return true
};
MarkerClusterer.prototype.removeMarker = function(e, t) {
    var i = this.removeMarker_(e);
    if (!t && i) {
        this.resetViewport();
        this.redraw();
        return true
    } else {
        return false
    }
};
MarkerClusterer.prototype.removeMarkers = function(e, t) {
    var i = false;
    for (var a = 0, r; r = e[a]; a++) {
        var s = this.removeMarker_(r);
        i = i || s
    }
    if (!t && i) {
        this.resetViewport();
        this.redraw();
        return true
    }
};
MarkerClusterer.prototype.setReady_ = function(e) {
    if (!this.ready_) {
        this.ready_ = e;
        this.createClusters_()
    }
};
MarkerClusterer.prototype.getTotalClusters = function() {
    return this.clusters_.length
};
MarkerClusterer.prototype.getMap = function() {
    return this.map_
};
MarkerClusterer.prototype.setMap = function(e) {
    this.map_ = e
};
MarkerClusterer.prototype.getGridSize = function() {
    return this.gridSize_
};
MarkerClusterer.prototype.setGridSize = function(e) {
    this.gridSize_ = e
};
MarkerClusterer.prototype.getMinClusterSize = function() {
    return this.minClusterSize_
};
MarkerClusterer.prototype.setMinClusterSize = function(e) {
    this.minClusterSize_ = e
};
MarkerClusterer.prototype.getExtendedBounds = function(e) {
    var t = this.getProjection();
    var i = new google.maps.LatLng(e.getNorthEast().lat(), e.getNorthEast().lng());
    var a = new google.maps.LatLng(e.getSouthWest().lat(), e.getSouthWest().lng());
    var r = t.fromLatLngToDivPixel(i);
    r.x += this.gridSize_;
    r.y -= this.gridSize_;
    var s = t.fromLatLngToDivPixel(a);
    s.x -= this.gridSize_;
    s.y += this.gridSize_;
    var n = t.fromDivPixelToLatLng(r);
    var o = t.fromDivPixelToLatLng(s);
    e.extend(n);
    e.extend(o);
    return e
};
MarkerClusterer.prototype.isMarkerInBounds_ = function(e, t) {
    return t.contains(e.getPosition())
};
MarkerClusterer.prototype.clearMarkers = function() {
    this.resetViewport(true);
    this.markers_ = []
};
MarkerClusterer.prototype.resetViewport = function(e) {
    for (var t = 0, i; i = this.clusters_[t]; t++) {
        i.remove()
    }
    for (var t = 0, a; a = this.markers_[t]; t++) {
        a.isAdded = false;
        if (e) {
            a.setMap(null)
        }
    }
    this.clusters_ = []
};
MarkerClusterer.prototype.repaint = function() {
    var e = this.clusters_.slice();
    this.clusters_.length = 0;
    this.resetViewport();
    this.redraw();
    window.setTimeout(function() {
        for (var t = 0, i; i = e[t]; t++) {
            i.remove()
        }
    }, 0)
};
MarkerClusterer.prototype.redraw = function() {
    this.createClusters_()
};
MarkerClusterer.prototype.distanceBetweenPoints_ = function(e, t) {
    if (!e || !t) {
        return 0
    }
    var i = 6371;
    var a = (t.lat() - e.lat()) * Math.PI / 180;
    var r = (t.lng() - e.lng()) * Math.PI / 180;
    var s = Math.sin(a / 2) * Math.sin(a / 2) + Math.cos(e.lat() * Math.PI / 180) * Math.cos(t.lat() * Math.PI / 180) * Math.sin(r / 2) * Math.sin(r / 2);
    var n = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
    var o = i * n;
    return o
};
MarkerClusterer.prototype.addToClosestCluster_ = function(e) {
    var t = 4e4;
    var i = null;
    var a = e.getPosition();
    for (var r = 0, s; s = this.clusters_[r]; r++) {
        var n = s.getCenter();
        if (n) {
            var o = this.distanceBetweenPoints_(n, e.getPosition());
            if (o < t) {
                t = o;
                i = s
            }
        }
    }
    if (i && i.isMarkerInClusterBounds(e)) {
        i.addMarker(e)
    } else {
        var s = new Cluster(this);
        s.addMarker(e);
        this.clusters_.push(s)
    }
};
MarkerClusterer.prototype.createClusters_ = function() {
    if (!this.ready_) {
        return
    }
    var e = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(), this.map_.getBounds().getNorthEast());
    var t = this.getExtendedBounds(e);
    for (var i = 0, a; a = this.markers_[i]; i++) {
        if (!a.isAdded && this.isMarkerInBounds_(a, t)) {
            this.addToClosestCluster_(a)
        }
    }
};

function Cluster(e) {
    this.markerClusterer_ = e;
    this.map_ = e.getMap();
    this.gridSize_ = e.getGridSize();
    this.minClusterSize_ = e.getMinClusterSize();
    this.averageCenter_ = e.isAverageCenter();
    this.center_ = null;
    this.markers_ = [];
    this.bounds_ = null;
    this.clusterIcon_ = new ClusterIcon(this, e.getStyles(), e.getGridSize())
}
Cluster.prototype.isMarkerAlreadyAdded = function(e) {
    if (this.markers_.indexOf) {
        return this.markers_.indexOf(e) != -1
    } else {
        for (var t = 0, i; i = this.markers_[t]; t++) {
            if (i == e) {
                return true
            }
        }
    }
    return false
};
Cluster.prototype.addMarker = function(e) {
    if (this.isMarkerAlreadyAdded(e)) {
        return false
    }
    if (!this.center_) {
        this.center_ = e.getPosition();
        this.calculateBounds_()
    } else {
        if (this.averageCenter_) {
            var t = this.markers_.length + 1;
            var i = (this.center_.lat() * (t - 1) + e.getPosition().lat()) / t;
            var a = (this.center_.lng() * (t - 1) + e.getPosition().lng()) / t;
            this.center_ = new google.maps.LatLng(i, a);
            this.calculateBounds_()
        }
    }
    e.isAdded = true;
    this.markers_.push(e);
    var r = this.markers_.length;
    if (r < this.minClusterSize_ && e.getMap() != this.map_) {
        e.setMap(this.map_)
    }
    if (r == this.minClusterSize_) {
        for (var s = 0; s < r; s++) {
            this.markers_[s].setMap(null)
        }
    }
    if (r >= this.minClusterSize_) {
        e.setMap(null)
    }
    this.updateIcon();
    return true
};
Cluster.prototype.getMarkerClusterer = function() {
    return this.markerClusterer_
};
Cluster.prototype.getBounds = function() {
    var e = new google.maps.LatLngBounds(this.center_, this.center_);
    var t = this.getMarkers();
    for (var i = 0, a; a = t[i]; i++) {
        e.extend(a.getPosition())
    }
    return e
};
Cluster.prototype.remove = function() {
    this.clusterIcon_.remove();
    this.markers_.length = 0;
    delete this.markers_
};
Cluster.prototype.getSize = function() {
    return this.markers_.length
};
Cluster.prototype.getMarkers = function() {
    return this.markers_
};
Cluster.prototype.getCenter = function() {
    return this.center_
};
Cluster.prototype.calculateBounds_ = function() {
    var e = new google.maps.LatLngBounds(this.center_, this.center_);
    this.bounds_ = this.markerClusterer_.getExtendedBounds(e)
};
Cluster.prototype.isMarkerInClusterBounds = function(e) {
    return this.bounds_.contains(e.getPosition())
};
Cluster.prototype.getMap = function() {
    return this.map_
};
Cluster.prototype.updateIcon = function() {
    var e = this.map_.getZoom();
    var t = this.markerClusterer_.getMaxZoom();
    if (t && e > t) {
        for (var i = 0, a; a = this.markers_[i]; i++) {
            a.setMap(this.map_)
        }
        return
    }
    if (this.markers_.length < this.minClusterSize_) {
        this.clusterIcon_.hide();
        return
    }
    var r = this.markerClusterer_.getStyles().length;
    var s = this.markerClusterer_.getCalculator()(this.markers_, r);
    this.clusterIcon_.setCenter(this.center_);
    this.clusterIcon_.setSums(s);
    this.clusterIcon_.show()
};

function ClusterIcon(e, t, i) {
    e.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);
    this.styles_ = t;
    this.padding_ = i || 0;
    this.cluster_ = e;
    this.center_ = null;
    this.map_ = e.getMap();
    this.div_ = null;
    this.sums_ = null;
    this.visible_ = false;
    this.setMap(this.map_)
}
ClusterIcon.prototype.triggerClusterClick = function() {
    var e = this.cluster_.getMarkerClusterer();
    google.maps.event.trigger(e, "clusterclick", this.cluster_);
    if (e.isZoomOnClick()) {
        this.map_.fitBounds(this.cluster_.getBounds())
    }
};
ClusterIcon.prototype.onAdd = function() {
    this.div_ = document.createElement("DIV");
    if (this.visible_) {
        var e = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(e);
        this.div_.innerHTML = this.sums_.text;
        var t = this.cluster_.getMarkerClusterer();
        if (t.cssClass_) {
            this.div_.className = t.cssClass_
        }
    }
    var i = this.getPanes();
    i.overlayMouseTarget.appendChild(this.div_);
    var a = this;
    google.maps.event.addDomListener(this.div_, "click", function() {
        a.triggerClusterClick()
    })
};
ClusterIcon.prototype.getPosFromLatLng_ = function(e) {
    var t = this.getProjection().fromLatLngToDivPixel(e);
    t.x -= parseInt(this.width_ / 2, 10);
    t.y -= parseInt(this.height_ / 2, 10);
    return t
};
ClusterIcon.prototype.draw = function() {
    if (this.visible_) {
        var e = this.getPosFromLatLng_(this.center_);
        this.div_.style.top = e.y + "px";
        this.div_.style.left = e.x + "px"
    }
};
ClusterIcon.prototype.hide = function() {
    if (this.div_) {
        this.div_.style.display = "none"
    }
    this.visible_ = false
};
ClusterIcon.prototype.show = function() {
    if (this.div_) {
        var e = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(e);
        this.div_.style.display = ""
    }
    this.visible_ = true
};
ClusterIcon.prototype.remove = function() {
    this.setMap(null)
};
ClusterIcon.prototype.onRemove = function() {
    if (this.div_ && this.div_.parentNode) {
        this.hide();
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null
    }
};
ClusterIcon.prototype.setSums = function(e) {
    this.sums_ = e;
    this.text_ = e.text;
    this.index_ = e.index;
    if (this.div_) {
        this.div_.innerHTML = e.text
    }
    this.useStyle()
};
ClusterIcon.prototype.useStyle = function() {
    var e = Math.max(0, this.sums_.index - 1);
    e = Math.min(this.styles_.length - 1, e);
    var t = this.styles_[e];
    this.url_ = t["url"];
    this.height_ = t["height"];
    this.width_ = t["width"];
    this.textColor_ = t["textColor"];
    this.anchor_ = t["anchor"];
    this.textSize_ = t["textSize"];
    this.backgroundPosition_ = t["backgroundPosition"]
};
ClusterIcon.prototype.setCenter = function(e) {
    this.center_ = e
};
ClusterIcon.prototype.createCss = function(e) {
    var t = [];
    var i = this.cluster_.getMarkerClusterer();
    if (!i.cssClass_) {
        t.push("background-image:url(" + this.url_ + ");");
        var a = this.backgroundPosition_ ? this.backgroundPosition_ : "0 0";
        t.push("background-position:" + a + ";");
        if (typeof this.anchor_ === "object") {
            if (typeof this.anchor_[0] === "number" && this.anchor_[0] > 0 && this.anchor_[0] < this.height_) {
                t.push("height:" + (this.height_ - this.anchor_[0]) + "px; padding-top:" + this.anchor_[0] + "px;")
            } else {
                t.push("height:" + this.height_ + "px; line-height:" + this.height_ + "px;")
            }
            if (typeof this.anchor_[1] === "number" && this.anchor_[1] > 0 && this.anchor_[1] < this.width_) {
                t.push("width:" + (this.width_ - this.anchor_[1]) + "px; padding-left:" + this.anchor_[1] + "px;")
            } else {
                t.push("width:" + this.width_ + "px; text-align:center;")
            }
        } else {
            t.push("height:" + this.height_ + "px; line-height:" + this.height_ + "px; width:" + this.width_ + "px; text-align:center;")
        }
        var r = this.textColor_ ? this.textColor_ : "black";
        var s = this.textSize_ ? this.textSize_ : 11;
        t.push("cursor:pointer; color:" + r + "; position:absolute; font-size:" + s + "px; font-family:Arial,sans-serif; font-weight:bold")
    } else {
        t.push("top:" + e.y + "px; left:" + e.x + "px;")
    }
    return t.join("")
};
window["MarkerClusterer"] = MarkerClusterer;
MarkerClusterer.prototype["addMarker"] = MarkerClusterer.prototype.addMarker;
MarkerClusterer.prototype["addMarkers"] = MarkerClusterer.prototype.addMarkers;
MarkerClusterer.prototype["clearMarkers"] = MarkerClusterer.prototype.clearMarkers;
MarkerClusterer.prototype["fitMapToMarkers"] = MarkerClusterer.prototype.fitMapToMarkers;
MarkerClusterer.prototype["getCalculator"] = MarkerClusterer.prototype.getCalculator;
MarkerClusterer.prototype["getGridSize"] = MarkerClusterer.prototype.getGridSize;
MarkerClusterer.prototype["getExtendedBounds"] = MarkerClusterer.prototype.getExtendedBounds;
MarkerClusterer.prototype["getMap"] = MarkerClusterer.prototype.getMap;
MarkerClusterer.prototype["getMarkers"] = MarkerClusterer.prototype.getMarkers;
MarkerClusterer.prototype["getMaxZoom"] = MarkerClusterer.prototype.getMaxZoom;
MarkerClusterer.prototype["getStyles"] = MarkerClusterer.prototype.getStyles;
MarkerClusterer.prototype["getTotalClusters"] = MarkerClusterer.prototype.getTotalClusters;
MarkerClusterer.prototype["getTotalMarkers"] = MarkerClusterer.prototype.getTotalMarkers;
MarkerClusterer.prototype["redraw"] = MarkerClusterer.prototype.redraw;
MarkerClusterer.prototype["removeMarker"] = MarkerClusterer.prototype.removeMarker;
MarkerClusterer.prototype["removeMarkers"] = MarkerClusterer.prototype.removeMarkers;
MarkerClusterer.prototype["resetViewport"] = MarkerClusterer.prototype.resetViewport;
MarkerClusterer.prototype["repaint"] = MarkerClusterer.prototype.repaint;
MarkerClusterer.prototype["setCalculator"] = MarkerClusterer.prototype.setCalculator;
MarkerClusterer.prototype["setGridSize"] = MarkerClusterer.prototype.setGridSize;
MarkerClusterer.prototype["setMaxZoom"] = MarkerClusterer.prototype.setMaxZoom;
MarkerClusterer.prototype["onAdd"] = MarkerClusterer.prototype.onAdd;
MarkerClusterer.prototype["draw"] = MarkerClusterer.prototype.draw;
Cluster.prototype["getCenter"] = Cluster.prototype.getCenter;
Cluster.prototype["getSize"] = Cluster.prototype.getSize;
Cluster.prototype["getMarkers"] = Cluster.prototype.getMarkers;
ClusterIcon.prototype["onAdd"] = ClusterIcon.prototype.onAdd;
ClusterIcon.prototype["draw"] = ClusterIcon.prototype.draw;
ClusterIcon.prototype["onRemove"] = ClusterIcon.prototype.onRemove;
(function(e) {
    var t = e.event,
        i, a;
    i = t.special.debouncedresize = {
        setup: function() {
            e(this).on("resize", i.handler)
        },
        teardown: function() {
            e(this).off("resize", i.handler)
        },
        handler: function(e, r) {
            var s = this,
                n = arguments,
                o = function() {
                    e.type = "debouncedresize";
                    t.dispatch.apply(s, n)
                };
            if (a) {
                clearTimeout(a)
            }
            r ? o() : a = setTimeout(o, i.threshold)
        },
        threshold: 150
    }
})(jQuery);
