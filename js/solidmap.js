/*!
 * solidMap
 * author: Radoslaw Malysa
 * easy to deploy google map with many well described markers
 * Licensed under the MIT license
 */
;(function($, window, document, undefined) {

	"use strict";

    var pluginName = "solidMap",
        defaults = {
            zoom: 10,
            lat: '51.402196',
            lng: '21.145046',
            title: undefined,
            icon: undefined,
            markerSelector: '.marker',
            styles: [{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d3d3d3"}]},{"featureType":"transit","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ebebeb"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#efefef"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#696969"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#dadada"}]}]
        };
        var infowindow = new google.maps.InfoWindow();
        
    function Plugin (element, options) {
        this.element = element;
        
        //alternative config in html
        var htmlOptions = $(this.element).data();
        
        this.settings = $.extend( {}, defaults, options, htmlOptions);
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function() {
            this.extractMarkers();
            this.initializeMap();
            
            this.markers = [];
            this.bounds = new google.maps.LatLngBounds();
            
            
            
            this.createMarkers();
        },
        initializeMap: function () {
            var mapOptions = {
                zoom: this.settings.zoom,
                center: (this.settings.lat && this.settings.lng) ? new google.maps.LatLng(this.settings.lat, this.settings.lng) : undefined,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: this.settings.styles,
                scrollwheel: false
            };
            
            this.map = new google.maps.Map($(this.element).get(0), mapOptions);
            
            google.maps.event.addListener(this.map, 'click', function() {
                //this.infowindow.close();
            });
            //center after resize
            google.maps.event.addDomListener(window, "resize", function() {
                var center = this.map.getCenter();
                google.maps.event.trigger(this.map, "resize");
                this.map.setCenter(center);
            });
            //activate map on click
            google.maps.event.addListener(this.map, 'click', function(){
                this.setOptions({scrollwheel:true});
            });
        },
        extractMarkers: function() {
            var htmlMarkers = $(this.element).find(this.settings.markerSelector),
            htmlMarkersLength = htmlMarkers.length,
            markersData = [];
            
            for (var i=0; i<htmlMarkersLength; i++) {
                markersData[i] = $(htmlMarkers[i]).data();
                markersData[i].content = $(htmlMarkers[i]).html();
            }
            
            this.markersData = markersData;
        },
        createMarkers: function() {
            var markersDataLength = this.markersData.length;
            if (markersDataLength > 0) {
                for (var i=0; i<markersDataLength; i++) {
                    this.createMarker(this.markersData[i]);
                }
            }
        },
        createMarker: function (obj, i) {
            
            var myLatLng = new google.maps.LatLng(obj['lat'], obj['lng']);
            
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: this.map,
                icon: (obj['icon']) ? obj['icon'] : undefined
            });
            
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    
                    infowindow.setContent(obj.content); 
                    infowindow.open(this.map, marker);
                }
            })(marker, i));
            
            this.bounds.extend(myLatLng);
            this.markers.push(marker);
        }
    });

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };
    
    // start
	$(function() {
		$(".solidmap").solidMap();
	});

} )(jQuery, window, document);
