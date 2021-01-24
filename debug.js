function showHeaders() {
	showParamHeaders();
}

function showParamHeaders() {
	if ($("#allparameters").find(".realinputvalue").length > 0) {
		$("#allparameters").show();
	} else {
		$("#allparameters").hide();
	}
}

//this specifies the parameter names
$(".fakeinputname").blur(function() {
  var newparamname = $(this).val();
  $(this).parent().parent().parent().parent().find(".realinputvalue").attr("name", newparamname);
});
 

$(".close").click(function(e) {
  e.preventDefault();
  $(this).parent().remove();
	showHeaders();
});

$("#addauthbutton").click(function(e) {
  e.preventDefault();
	if ($("#authentication").find(".realinputvalue").length == 0) {
		$('.httpauth:first').clone(true).appendTo("#authentication");
	}
	showHeaders();
});

$("#addheaderbutton").click(function(e) {
  e.preventDefault();
	$('.httpparameter:first').clone(true).appendTo("#allheaders");
	showHeaders();
});

$("#addprambutton").click(function(e) {
  e.preventDefault();
	$('.httpparameter:first').clone(true).appendTo("#allparameters");
	showHeaders();
});

$("#addfilebutton").click(function(e) {
  e.preventDefault();
	$('.httpfile:first').clone(true).appendTo("#allparameters");
	showHeaders();
});

function postWithAjax(myajax) {
	myajax = myajax || {};
	let url = $("#urlvalue").val();
	myajax.method = $("#httpmethod").val();

	if(myajax.method.toUpperCase()=="GET" || myajax.method.toUpperCase()=="HEAD"){
		delete myajax["body"];
	} else {
		myajax.body = JSON.stringify(myajax.body);
	}

	$("#outputframe").hide();
	$("#outputpre").empty();
	$("#headerpre").empty();
	$("#outputframe").attr("src", "")
	$("#ajaxoutput").show();
	$("#statuspre").text("0");
	$("#statuspre").removeClass("alert-success");
	$("#statuspre").removeClass("alert-error");
	$("#statuspre").removeClass("alert-warning");

  $('#ajaxspinner').show();

  fetch(url, myajax).then(res=>{
	$('#ajaxspinner').hide();
	$("#statuspre").text("HTTP " + res.status + " " + res.statusText);
	if (res.status == 0) {
		httpZeroError();
	} else if (res.status >= 200 && res.status < 300) {
		$("#statuspre").addClass("alert-success");
	} else if (res.status >= 400) {
		$("#statuspre").addClass("alert-error");
	} else {
		$("#statuspre").addClass("alert-warning");
	}

	res.text().then(text=>{
		$("#outputpre").text(text);
		//$("#headerpre").text(jqXHR.getAllResponseHeaders());
	})
  })
/*
	$.ajax(myajax).always(function(){
    $('#ajaxspinner').hide();
	});*/
}

$("#submitajax").click(function(e) {
  e.preventDefault();
  if(checkForFiles()){
    postWithAjax({
      headers: createHeaderData(),
      body : createMultipart(), 
      cache: false,
      credentials: 'include'
    });
  } else {
    postWithAjax({
      headers : createHeaderData(),
	  body : createUrlData(),
	  credentials: 'include'
    });    
  }
});

function checkForFiles() {
	return $("#paramform").find(".input-file").length > 0;
}

function createUrlData(){
  var mydata = {};
	var parameters = $("#allparameters").find(".realinputvalue");
	for (i = 0; i < parameters.length; i++) {
		name = $(parameters).eq(i).attr("name");
		if (name == undefined || name == "undefined") {
			continue;
		}
		value = $(parameters).eq(i).val();
		mydata[name] = value
	}
  return(mydata);
}

function createMultipart(){
  //create multipart object
  var data = new FormData();
  
  //add parameters
  var parameters = $("#allparameters").find(".realinputvalue");
	for (i = 0; i < parameters.length; i++) {
		name = $(parameters).eq(i).attr("name");
		if (name == undefined || name == "undefined") {
			continue;
		}
    if(parameters[i].files){
  	  data.append(name, parameters[i].files[0]);      
    } else {
		  data.append(name, $(parameters).eq(i).val());
    }
	}
  return(data)  
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function createHeaderData(){
  var mydata = {/*
	"Accept": "application/json",
	"Content-Type": "application/json"*/
  };
  /*
	var parameters = $("#allheaders").find(".realinputvalue");
	for (i = 0; i < parameters.length; i++) {
		name = $(parameters).eq(i).attr("name");
		if (name == undefined || name == "undefined") {
			continue;
		}
		value = $(parameters).eq(i).val();
		mydata[name] = value
	}
	*/
  return(mydata);
}

function httpZeroError() {
	$("#errordiv").append('<div class="alert alert-error"> <a class="close" data-dismiss="alert">&times;</a> <strong>Oh no!</strong> Javascript returned an HTTP 0 error. One common reason this might happen is that you requested a cross-domain resource from a server that did not include the appropriate CORS headers in the response. Better open up your Firebug...</div>');
}
