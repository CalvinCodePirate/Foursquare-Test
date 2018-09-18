var url = 'https://api.foursquare.com/v2/venues/explore?client_id=Y3Y5DQQZQ0FCFTQ3DK5CLLTC2TVLBLY14GBKOA1IG424T0RV&client_secret=F4K10HJ4LUZRSUPIWSAPFSZQINTGMCMMSZ4T2QB3GYIBFMAD+&v=20130815+&limit=10';

var ctrl = function(url, el) {
  this.url = url || null;
  this.el  = el  || null;
}

ctrl.prototype.getData = function() {
  var self = this;
	$.get(self.url)
		.done(function(res) {
  		if (self.update)   self.createEl(res);
  		else self.append(res);
		});
}

var createTD = new ctrl();
createTD.url = url+ '&query=outdoor';
createTD.el = $('.body .outdoor'); 

var createRestaurant = new ctrl();
createRestaurant.url = url+ '&query=food';
createRestaurant.el = $('.body .rest'); 

var createShopping = new ctrl();
createShopping.url = url+ '&query=shopping';
createShopping.el = $('.body .shopping'); 

var createArts = new ctrl();
createArts.url = url+ '&query=arts';
createArts.el = $('.body .arts'); 

createTD.createEl =  function (res) {
	var  venues  =  res.response.groups[0].items,
 		el = this.el,
    $node;
  
  for (var i=0; i<venues.length; i++) {
    $node = tpl(venues[i].venue);
    el.append($node);
  }
  this.data = res;
}

createRestaurant.createEl =  function (res) {
	var  venues  =  res.response.groups[0].items,
 		el = this.el,
    $node;
  
  console.log(el);
  for (var i=0; i<venues.length; i++) {
    $node = tpl(venues[i].venue);
    el.append($node);
  }
  this.data = res;
}

createShopping.createEl =  function (res) {
	var  venues  =  res.response.groups[0].items,
 		el = this.el,
    $node;
  
  for (var i=0; i<venues.length; i++) {
    $node = tpl(venues[i].venue);
    el.append($node);
  }
  this.data = res;
}

createArts.createEl =  function (res) {
	var  venues  =  res.response.groups[0].items,
 		el = this.el,
    $node;
  
  for (var i=0; i<venues.length; i++) {
    $node = tpl(venues[i].venue);
    el.append($node);
  }
  this.data = res;
}

var tpl = function(venue) {
  console.log(venue);
  var node = '';
  
  node += '<li class="list-item" data-id="'+ venue.id +'"';
  node += 'data-req=0>';
  node += '<div class="name">'+ venue.name  +'</div>';
  node += '<div class="address"><i class="fa fa-map-marker"></i>'+ venue.location.address +'</li>';
  node += '<div class="details"></div>';
  
  return $(node);
}

function showContent(text) {
  $('.list-container').css('display', 'none');
  
  if (text == 'Tourist Destinations') 		
  $('.outdoor').css('display', 'block');
  
  if (text == 'Restaurants') 
  $('.rest').css('display', 'block');
  
  if (text == 'Shopping') 
  $('.shopping').css('display', 'block');
  
  if (text == 'Arts') 
  $('.arts').css('display', 'block');  
}

function positionArrow(text) {
  if (text == 'Tourist Destinations') return '2px';
  if (text == 'Restaurants') return '36px';
  if (text == 'Shopping') return '70px';
  if (text == 'Arts') return '104px';
}

function createDetails($node) {
  $('.details').css('display', 'none');
  if (!$node.data('req')) {
    $node.data('req', 1);
  }
  else {
    
  }
  $node.next().css('display', 'block');
}

function domEvents() {
  $('.get-started').click(function() {
  	$('html, body').animate({
        scrollTop: $('.content').offset().top
  	 }, 200);
  });
  
  $('.nav li').click(function() {
   if ($(this).attr('class') == 'city-small') return;
    
   $('.nav li').removeClass('selected');
   $(this).addClass('selected');
   var top = positionArrow($(this).text());
   $('.arrow').css('top', top);
    
   showContent($(this).text());
  });
  
  $('.list-container').on('click','.list-item', function() {
    //createDetails($(this));
  });
}

function geoCoder() {
	navigator.geolocation.getCurrentPosition(function(pos) {
		geocoder = new google.maps.Geocoder();
		var latlng = new 				google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
    console.log(latlng)
		geocoder.geocode({'latLng': latlng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var result = results[0];
				var city = "";
				var state = "";
				for(var i=0, len=result.address_components.length; i<len; i++) {
					var ac = result.address_components[i];
					if(ac.types.indexOf("locality") >= 0) city = ac.long_name;
					if(ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.long_name;
				}
				if(city != '' ) {
					initiateRequests(city);
				}
			} 
		});
	});  
}

function setCity(city) {
  $('.main .city').text(city);
  $('.nav .city-small').text(city);
}

function initiateRequests(city) {
  //city = 'barcelona'; 
  createTD.update = true;
  createTD.url += '&near='+ city;
  createTD.getData();
  
  createRestaurant.update = true;
  createRestaurant.url += '&near='+ city;
  createRestaurant.getData();
  
  createShopping.update = true;
  createShopping.url += '&near='+ city;
  createShopping.getData();
  
  createArts.update = true;
  createArts.url += '&near='+ city;
  createArts.getData();
  
  setCity(city);
  domEvents();
}

geoCoder();