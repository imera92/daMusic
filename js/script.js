function validateSearch(input){
	var url='https://api.spotify.com/v1/search?q='+input+'&type=artist';
	$.getJSON(url, function(ans){
		var artists = ans.artists.items;
		var myArtist = artists[0];
		if(artists.length == 0){
			console.log('No hay artistas');
			alert('La busqueda no arrojo ningun resultado. Intenta con otro nombre.');
		}else if(myArtist.popularity == 0){
			console.log('Popularidad cero');
			alert('La busqueda no arrojo ningun resultado. Intenta con otro nombre.');
		}else{
			search(input);
		}
	});
}

function search(input){
	var url='https://api.spotify.com/v1/search?q='+input+'&type=artist';
	$.getJSON(url, function(ans){
		var artists = ans.artists.items;
		var myArtist = artists[0];
		loadArtist(myArtist);
		loadTop(myArtist.id);
	});
}

function loadArtist(artist){
	var images = artist.images;
	var followers = artist.followers;
	var genres = artist.genres;
	var st = '';
	var artistImg = images[0];
	var artistLink = artist.external_urls.spotify;

	if(images.length == 0){
		$('#artist-img').attr('src', 'img/no-img.png');
	}else{
		$('#artist-img').attr('src', artistImg.url);
	}
	$('#name').text(artist.name);
	$('#followers').text(followers.total);
	for(i = 0; i < genres.length; i++){
		if(i == genres.length - 1){
			st += genres[i];
		}else{ 
			st += genres[i] + ', ';
		}
	}
	$('#genre').text(st);
	$('#spotify').attr('href', artistLink);
	$('#artist-pane').css('display','block');
}

function loadTop(id){
	var index = 0;
	var url = 'https://api.spotify.com/v1/artists/'+id+'/top-tracks?country=EC';
	$.getJSON(url, function(ans){
		var tracks = ans.tracks;
		var top5 = [];
		for(i = 0; i < 5; i++){
			top5.push(tracks[i]);
		}
		for(i = 0; i < 5; i++){
			var artist = top5[i].artists[0].name.toLowerCase();
			var str = top5[i].name.toLowerCase();
			var song = str.replace('- ', '').replace(/ /g,'+');
			var videoUrl = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyB9311I48xU6Oh2OPxd1qgnaHNP5K1fGMI&q='+artist+'+'+song+'&part=snippet&type=video'
			$.getJSON(videoUrl, function(ans){
				index++;
				var video = ans.items[0];
				var imgUrl = video.snippet.thumbnails.high.url;
				var videoUrl = 'https://www.youtube.com/watch?v='+video.id.videoId;
				switch (index){
					case 4:
						var $div = $('<div>', {'class': 'col-sm-4 col-sm-offset-2 col-md-4 col-md-offset-2 col-lg-4 col-lg-offset-2',});
						var $a = $('<a>', {'href': videoUrl, 'target': '_blank'});
						var $img = $('<img>', {'src': imgUrl, 'class': 'img-responsive'});
						$a.append($img);
						$div.append($a);
						$('#tile-2').append($div);
						break;
					case 5:
						var $div = $('<div>', {'class': 'col-sm-4 col-md-4 col-lg-4',});
						var $a = $('<a>', {'href': videoUrl, 'target': '_blank'});
						var $img = $('<img>', {'src': imgUrl, 'class': 'img-responsive'});
						$a.append($img);
						$div.append($a);
						$('#tile-2').append($div);
						break;
					default:
						var $div = $('<div>', {'class': 'col-sm-4 col-md-4 col-lg-4',});
						var $a = $('<a>', {'href': videoUrl, 'target': '_blank'});
						var $img = $('<img>', {'src': imgUrl, 'class': 'img-responsive'});
						/*
						var $text = $('<span>', {'class': 'text'});
						$text.text('HOLA');
						$text.css({'position': 'absolute', 'top': '0', 'color': '#f00', 'background-color': 'rgba(0,0,0,0.8)', 'width': '100%', 'height': '100%', 'text-align': 'left', 'z-index': '10', 'opacity': '0', 'transition': 'all 0.2s ease'});
						$text.hover(function(){$(this).css('opacity', '1');}, function(){$(this).css('opacity', '0');});
						*/
						$a.append($img);
						//$div.append($text);
						$div.append($a);
						$('#tile-1').append($div);
						break;
				}
			});
		}
	});
	$('#top').css('display','block');
}

function startSearch(){
	if($('#artist-input').val()){
		$('#artist-pane').css('display', 'none');
		$('#top').css('display', 'none');
		$('#tile-1').empty();
		$('#tile-2').empty();
		validateSearch($('#artist-input').val());
		if($('#artist-input').val()){
			$('#artist-input').val('');
		}
	}else{
		alert('Ingresa el nombre de un artista/banda');
	}
}

$(document).ready(function(){
	$('#artist-input').keypress(function(event){
		if(event.keyCode === 13){
			startSearch();
		}
	});
	search('megadeth');
});