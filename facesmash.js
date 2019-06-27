$(document).ready(function() { 	
	
function loadTwoFaces(){

	//import two random faces from db

	$(".faces").html("");

	var random_a = Math.floor((Math.random() * 650) + 1);
	var random_b = Math.floor((Math.random() * 650) + 1);

	while(random_a == random_b){
		random_b = Math.floor((Math.random() * 650) + 1);
	} 

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var face_data = this.responseText;
			var split_by_quotes = face_data.split('"');
			var face_a_name = split_by_quotes[0].split(",")[0].trim();
			var face_a_constit = split_by_quotes[1].trim();
			var face_a_rating = split_by_quotes[2].split(",")[1].trim();
			var face_a_img = "default.png&f=1";
			face_a_img = split_by_quotes[2].split(",")[2].trim();

			$(".faces").append ('<div id="'+
				random_a
				+'" class="a"><img src="' +
				face_a_img
				+'"><p>' +
				face_a_name 
				+ "</br>" +
				face_a_constit
				+ '</br><span id="' + 
				face_a_rating
				+ '" class="rating"><strong>Score: </strong>' +
				face_a_rating
				+ '</span></p></div>');
		}
	}
	xmlhttp.open("GET", "getData.php?id="+random_a, true);
	xmlhttp.send();	 

	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var face_data = this.responseText;
			var split_by_quotes = face_data.split('"');
			var face_b_name = split_by_quotes[0].split(",")[0].trim();
			var face_b_constit = split_by_quotes[1].trim();
			var face_b_rating = split_by_quotes[2].split(",")[1].trim();
			var face_b_img = "default.png&f=1";
			face_b_img = split_by_quotes[2].split(",")[2].trim();

			$(".faces").append ('<div id="'+
				random_b
				+'" class="b"><img src="' +
				face_b_img
				+'"><p>' +
				face_b_name 
				+ "</br>" +
				face_b_constit
				+ '</br><span id="' + 
				face_b_rating
				+ '" class="rating"><strong>Score: </strong>' +
				face_b_rating
				+ '</span></p></div>');
		}
	}
	xmlhttp.open("GET", "getData.php?id="+random_b, true);
	xmlhttp.send();	 

	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			$("#scoreboardTable").html(this.responseText);
		}
	}
	xmlhttp.open("GET", "getScores.php", true);
	xmlhttp.send();	    

}

loadTwoFaces();
	
$(document).on('click', '.faces > div', function (e) { 
    e.preventDefault();	  
	
	var ea, eb, face_a_new_rating, face_b_new_rating;
	var k = 24;
	var chosen_face = $(this).attr("class");
	var face_a_id = $(".faces div:nth-child(1)").attr("id");
	var face_b_id = $(".faces div:nth-child(2)").attr("id");
	var face_a_rating = $(".faces .rating").attr("id"); //ra
	var face_b_rating = $(".faces .rating").attr("id"); //rb
									   
    ea = 1/(1+10^((face_b_rating - face_a_rating)/400));
	eb = 1/(1+10^((face_a_rating - face_b_rating)/400));

	if(chosen_face == "a")
	{

		face_a_new_rating = face_a_rating + (k * ea);
		face_b_new_rating = face_b_rating - (k * eb);

	}else
	{

		face_a_new_rating = face_a_rating - (k * ea);
		face_b_new_rating = face_b_rating + (k * eb);

	}
	
	//update database
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);		
		}
	}
	xmlhttp.open("POST", "update.php?id_a="+face_a_id+"&new_rating_a="+face_a_new_rating+"&id_b="+face_b_id+"&new_rating_b="+face_b_new_rating+"&pw=d1!!_gdfs8g", true);
	xmlhttp.send();	 
	
	loadTwoFaces();
  
});

});