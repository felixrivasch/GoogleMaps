function changePageTo (idPage,typeTransition,trueOrFalse) {
	$.mobile.changePage("#"+idPage, {
		transition: typeTransition,
		reverse: trueOrFalse
	});
}

var dataHotels = [];

function showDataHotel (numIdHotel) {
	//dataHotelShow = dataHotels[numIdHotel];
	var dataMessage = "";
	dataMessage += "<b>Nombre: </b>"+dataHotels[numIdHotel].name+"<br>";
	dataMessage += "<b>Ciudad: </b>"+dataHotels[numIdHotel].city+"<br>";
	dataMessage += "<b>Teléfono: </b>"+dataHotels[numIdHotel].phone+"<br>";
	dataMessage += "<b>Estrellas: </b>"+dataHotels[numIdHotel].stars+"<br>";

	$("#data-hotel").html(dataMessage);

	changePageTo("page-data", "slide", false);

	var locationHotel = dataHotels[numIdHotel].latLongHotel

	showMapHotel(locationHotel);
	//addMarkerToMap();
}

function showMapHotel (locationHotel) {

	showLoading("Cargando ubicación del hotel...");

	var optionMapHotel = {
	 	zoom: 18,
	 	center: locationHotel,
	 	mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	var mapHotel = new google.maps.Map(document.getElementById("ubiety-hotel"), optionMapHotel);

	var markerHotel = new google.maps.Marker({
	 	position: locationHotel,
	 	map: mapHotel,
	 	icon: "image_icon/iconoLocation.png"
	});

	setTimeout(function () {
		hideLoading();
	}, 1000);
	
}


function showLoading (textLoad) {
	$.mobile.loading('show', {
		text: textLoad,
		textVisible: true,
		theme: "a",
		textonly: false
	});
}

function hideLoading () {
	$.mobile.loading('hide');
}



$(document).ready(function() {
	$("#btn-go-registry").click(function(event) {
		changePageTo("page-registry", "slide", false);
		showMap();
	});

	$("#btn-go-list").click(function(event) {
		changePageTo("page-list", "slide", false)
	});

	$("#btn-reg-back-management").click(function(event) {
		changePageTo("page-management", "slide", true)
	});

	$("#btn-list-back-management").click(function(event) {
		changePageTo("page-management", "slide", true)
	});

	$("#btn-back-list").click(function(event) {
		changePageTo("page-list", "slide", true)
	});

	var map
	var marker;
	var latLongStart = new google.maps.LatLng(-12.046374, -77.042793);
	/*var latNew;
	var longNew;*/

	function showMap () {

		showLoading("Cargando Mapa...");

		var  options = {
			zoom: 12,
			center: latLongStart,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}

		map = new google.maps.Map(document.getElementById("ubiety"), options);

		marker = new google.maps.Marker({
			position: latLongStart,
			map: map,
			draggable: true,
			icon: "image_icon/iconoLocation.png",
			title: ""
		})

		contentMarker = '<div style="width: 190px; height: 35px; padding: 0; margin:0">Por favor, arrastra este marcador a la ubicación de tu hotel.</div>';

		infoWindow = new google.maps.InfoWindow({
			content: contentMarker
		});

		infoWindow.open(map, marker);

		setTimeout(function () {
			hideLoading();

			getCurrentlyPosition();

		}, 1500);



		google.maps.event.addListener(marker, 'click', function () {
			infoWindow.open(map, marker)
		});

		google.maps.event.addListener(marker, 'dragend', function (event) {
			// latNew = event.latLng.lat();
			// longNew = event.latLng.lng();
			// latLongNew = new google.maps.LatLng(latNew, longNew);
			alert("¡Has arrastrado el marcador a una nueva posición!")
		})

	}


	$("#btn-search").click(function(event) {
		validateField("place-search");
		
	});

	function validateField (idField) {
		if ($("#"+idField).val() == "") {
			alert("Por favor, ingrese el nombre de un hotel.")
		}
		else {
			convertAddress();
		}
	}


	function convertAddress () {
		var address = $("#place-search"). val();
		var geoCoder = new google.maps.Geocoder();

		showLoading("Buscando el Lugar ...");

		geoCoder.geocode({
			'address': address
		}, function (result, state) {
			if (state == google.maps.GeocoderStatus.OK) {
				marker.setPosition(result[0].geometry.location);
				map. setCenter(result[0].geometry.location);

				hideLoading();

			} else {
				hideLoading();
				alert("¡Error en el servicio!"+state);
			}
		})
	}


	function success (position) {
		var latLongCurrent = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			marker.setPosition(latLongCurrent);
			map.setCenter(latLongCurrent);

			hideLoading();
	}
	function fail (error) {
		hideLoading();

		if (error.code == 0) {
			alert("¡Lo sentimos, no se puede obtener la posición actual!");
		}
		else if (error.code == 1) {
			alert("¡Hola, no has aceptado compartir tu posición actual, gracias de todas maneras!");
		}
		else if (error.code == 2) {
			alert("¡Hola, no has aceptado compartir su posición actual, gracias de todas maneras!")
		}
		else if (error.code == 3) {
			alert("¡Ops, se ha superado el tiempo de espera!")
		}
		else {
			alert("Hemos tenido un problema, por favor, discúlpenos por esta molestia.")
		}
	}

	function getCurrentlyPosition () {
		showLoading("Cargando ubicación...");

		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(success, fail, {
				maximumAge: 500000,
				enableHighAccuracy: true,
				timeout:8000
			})
		} 
	}
	
	

	$("#btn-registry").click(function(event) {
		saveRegistry();
	});

	function saveRegistry () {
		var name = $("#name").val();
		var latLongHotel = marker.getPosition();
		var city = $("#city").val();
		var phone = $("#phone").val();
		var stars = $("#stars").val();

		var dataHotel = {
			name: name,
			latLongHotel: latLongHotel,
			city: city,
			phone: phone,
			stars: stars
		}

		dataHotels.push(dataHotel);

		alert("Se ha registrado el Hotel "+name+".");

		clearFields();
	}

	$("#btn-go-list").click(function(event) {
		listHotels();
	});


	function clearFields () {
		$("#name").val("");
		$("#city").val("");
		$("#phone").val("");
		$("#stars").val("");
	}


	function listHotels () {
		var nameHotelToList ="";
		for (var i = 0; i < dataHotels.length; i++) {
			nameHotelToList += '<li><a class=ui-btn id=h'+i+' onclick='+'"showDataHotel('+i+')">'+dataHotels[i].name+'</a></li>';
			//$("#list-hotels").append(nameHotelToList);
		}
		$("#list-hotels").html(nameHotelToList);
		
		console.log($("#h0").text())
	}

	// for (var i = 0; i < dataHotels.length; i++) {
	// 	$("#h"+i).click(function(event) {
	// 		showDataHotel(i);
	// 		changePageTo("page-data");
	// 	});
	// }

});
