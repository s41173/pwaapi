$(document).ready(function (e) {
	
	var _url = "https://my-json-server.typicode.com/s41173/pwaapi/products";
	
	var dataResults = '';
	var catResults = '';
	var categories = [];

	function renderPage(data){
		$.each(data,function(key,items){

			_cat = items.category;
			dataResults += "<div> <h3> "+items.name+" </h3> <p> "+_cat+" </p> </div>";

			if ($.inArray(_cat,categories) == -1){
				categories.push(_cat);
				catResults += "<option value'"+_cat+"'>" +_cat+" </option>";
			}
		})
		
		$('#products').html(dataResults);
		$('#cat_select').html("<option value='all'> semua </option>"+catResults);
	
		$("#cat_select").on('change', function(){
			updateProduct($(this).val());
		})
	} // end render page

	var networDataReceived = false;
	
	// fresh data from online
	var networkUpdate = fetch(_url).then(function(response){
		return response.json()
	}).then(function(data){
		networDataReceived = true 
		renderPage(data)
	})

	// return data from cache
    caches.match(_url).then(function(response){
	  if(!response) throw Error('no data on cache')
	  return response.json()
	}).then(function(data){
		if (!networDataReceived){
			renderPage(data)
			console.log('render data from cache');
		}
	}).catch(function(){
		return networkUpdate // render data from api
	})
 
	function updateProduct(cat){
	  
		var newdataResults = '';
		var _newUrl = _url;
		if (cat != 'all'){ _newUrl = _url+"?category="+cat;}

		$.get(_newUrl, function(data, status){
			$.each(data,function(key,items){
				_cat = items.category;
				newdataResults += "<div> <h3> "+items.name+" </h3> <p> "+_cat+" </p> </div>";
			})
			$('#products').html(newdataResults);
		});
	}
		
// document ready end	
});

// register service workers
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
	  navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
		// Registration was successful
		console.log('ServiceWorker registration successful with scope: ', registration.scope);
	  }, function(err) {
		// registration failed :(
		console.log('ServiceWorker registration failed: ', err);
	  });
	});
  }




	

	
	