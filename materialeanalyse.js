

function htmlEntities(str) {
    return String(str).replace(/\$/g, '&#36;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


function isUseragentSafari(){

	// SEE:  
	// http://sixrevisions.com/javascript/browser-detection-javascript/
	// http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
	// https://jsfiddle.net/9atsffau/

	console.log('isUseragentSafari - navigator.userAgent: ' + navigator.userAgent);
	
	// return (navigator.userAgent.indexOf('Safari')!==-1)?true:false;

	// return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;   // SEE:  https://jsfiddle.net/9atsffau/  // Commented out 05-10-2016

	return ((navigator.userAgent.indexOf('Safari')!==-1) && (navigator.userAgent.indexOf('Chrome')===-1) && (navigator.userAgent.indexOf('Chromium')===-1))?true:false;  // Added 05-10-2016, see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
}
console.log('isUseragentSafari: ' + isUseragentSafari());


function returnLastStudentSession() {
	window.osc = Object.create(objectStorageClass);
	osc.init('studentSession_4');
	osc.exist('jsonData');

	var TjsonData = osc.load('jsonData');
	console.log('returnLastStudentSession - TjsonData: ' + JSON.stringify(TjsonData));

	// IMPORTANT: 
	// In this exercise, the user has to download a word-document in the last step. This is not possible when using Safari - this is why this if-clause has been added.
	if ((isUseragentSafari()) && (typeof(safariUserHasAgreed) === 'undefined')){

		window.safariUserHasAgreed = false;

		UserMsgBox("body", '<h4>OBS</h4> <p>Du arbejder på en Mac og bruger browseren Safari. <br> Denne øvelse virker desværre ikke optimalt på Safari-platformen. Du vil ikke kunne downloade de udfyldte felter som wordfil til sidst i øvelsen.</p><br> <p>Brug i stedet <b>Chrome</b> (<a href="https://www.google.dk/chrome/browser/desktop/">Hent den her</a>) eller <b>Firefox</b>  (<a href="https://www.mozilla.org/da/firefox/new/">Hent den her</a>).</p><br> <p>Mvh <a href="https://www.vucdigital.dk">vucdigital.dk</a> </p>');
		
		$('#UserMsgBox').addClass('UserMsgBox_safari');
		$('.MsgBox_bgr').addClass('MsgBox_bgr_safari');

		$( document ).on('click', ".UserMsgBox_safari", function(event){
			$(".UserMsgBox_safari").fadeOut(200, function() {
	            $(this).remove();
	        });
			safariUserHasAgreed = true;
	        returnLastStudentSession();
		});

		$( document ).on('click', ".MsgBox_bgr_safari", function(event){
			$(".MsgBox_bgr_safari").fadeOut(200, function() {
	            $(this).remove();
	        });
	        safariUserHasAgreed = true;
	        returnLastStudentSession();
		});

		return 0;
	}
	
	if ((TjsonData !== null) && (typeof(TjsonData) !== 'undefined')){
		console.log('returnLastStudentSession - getTimeStamp: ' + osc.getTimeStamp());
	// if (TjsonData !== null){
		var HTML = '';
		HTML += '<h4>OBS</h4> Du har lavet denne øvelse før og indtastet data allerede.';
		HTML += '<div> <span id="objectStorageClass_yes" class="objectStorageClass btn btn-info">Jeg vil fortsætte, hvor jeg slap</span> <span id="objectStorageClass_no" class="objectStorageClass btn btn-info">Jeg vil starte forfra</span> </div>';
		UserMsgBox("body", HTML);

		$('.CloseClass').remove(); // <---- removes the "X" in the UserMsgBox.
		$('.container-fluid').hide();  // Hide all program-content.

	    $('#UserMsgBox').unbind('click');
	    $('.MsgBox_bgr').unbind('click');

	    $( document ).on('click', "#objectStorageClass_yes", function(event){
	        console.log("objectStorageClass.init - objectStorageClass_yes - CLICK" );
	        $(".MsgBox_bgr").fadeOut(200, function() {
	            $(this).remove();
	            $('.container-fluid').fadeIn('slow');  // Fade in all program-content.
	        });
	       
	        jsonData = TjsonData;
			// $('#DataInput').html(eval('step_'+TjsonData.currentStep+'_template()'));
			console.log('returnLastStudentSession - jsonData : ' + JSON.stringify(jsonData)); 
			template();
	
	    });

	    $( document ).on('click', "#objectStorageClass_no", function(event){
	    	// osc.stopAutoSave('test1');
	        console.log("objectStorageClass.init - objectStorageClass_no - CLICK" );
	        osc.delete(osc.localStorageObjName);
	        $(".MsgBox_bgr").fadeOut(200, function() {
	            $(this).remove();
	            $('.container-fluid').fadeIn('slow');  // Fade in all program-content.
	        });

	        // step_0_template();
	        template();
	    });
	} else {
		// step_0_template();
		template();
	}
}




function template() {

	var HTML = '';

	console.log('template - jsonData: ' + JSON.stringify(jsonData)); 

	HTML += '<h1>'+jsonData.mainHeader+'</h1>';
	HTML += '<div class="col-xs-12 col-md-8">'+instruction(jsonData.instruction)+'</div><div class="clear"></div>';
	// HTML += explanation(jsonData.explanation);

	HTML += makeTable();

	HTML += '<span id="download" class="btn btn-lg btn-primary"><span class="glyphicons glyphicons-download-alt"></span> Download</span>';
	HTML += '<span id="copy" class="btn btn-lg btn-primary"><span class="glyphicons glyphicons-notes-2"></span>Kopier</span>';

	$('#DataInput').html(HTML);
}


function makeTable() {
	var HTML = '<div id="dataTable">';
	var objKeys = Object.keys(jsonData.templateData);
	for (var n in jsonData.templateData){
		HTML += '<div class="row">';
		HTML += 	'<div class="leftCol col-xs-12 col-md-4">';
		HTML += 		'<h4>'+jsonData.templateData[n].heading+'</h4>';
		HTML += 		'<div class="description">'+jsonData.templateData[n].description+'</div>'; 
		HTML += 	'</div>';
		HTML += 	'<div class="rightCol col-xs-12 col-md-8">';
		HTML += 		'<textarea class="studentInput" placeholder="'+jsonData.templateData[n].placeholderTxt+'" value="'+jsonData.templateData[n].value+'">'+jsonData.templateData[n].value+'</textarea>';
		HTML += 	'</div>';
		HTML += '</div>';
	}
	HTML += '</div>';
	return HTML;
}


// This keypress eventhandler listens for the press of the return-key. If a return-key event is encountered the  
// first empty input-field is found and focus is given to that field.
$( document ).on('keypress', ".subQuestionAnswer", function(event){
	console.log("keypress - keyThemesByStudent - PRESSED");
	if ( event.which == 13 ) {  // If a press on the return-key is encountered... (NOTE: "13" equals the "return" key)
		event.preventDefault(); // ...prevents the normal action of the return-key. 
		console.log("keypress - keyThemesByStudent - PRESSED RETURN");
		if ($(this).val().length > 0){
			// var parentObj = $(this).parent().parent().parent();             // <---- OK 
			// $( ".addNewSubQuestionAnswer", parentObj ).trigger( "click" );  // <---- OK 

			var parentObj = $(this).parent();
			$(parentObj).after(returnInputBoxes4(1, 'subQuestionAnswer starMark studentInput', [''], ['Skriv din besvarelse her...']));
			$(parentObj).next().prepend('<span class="glyphLi glyphicon glyphicon-asterisk"></span>');

			$('.subQuestionAnswer', $(this).parent().next()).focus();
		} else { // If the input-field is empty...
			console.log("keypress - keyThemesByStudent - PRESSED");
			$(this).focus(); // ...give the input-field focus...
		} 
	}
});




function saveJsonData(){
	var objKeys = Object.keys(jsonData.templateData);
	$( "#DataInput .studentInput" ).each(function( index, element ) {
		jsonData.templateData[objKeys[index]].value = $(element).val();
	});
	console.log('saveJsonData - jsonData.templateData 2: ' + JSON.stringify(jsonData.templateData)); 
}


function warnStudent(){
	var JT = jsonData.templateData;
	inputError = false;
	var HTML = '';

	for (var n in jsonData.templateData){
		if (jsonData.templateData[n].value.length == 0){
			UserMsgBox("body", '<h4>OBS</h4> <p>Feltet "'+jsonData.templateData[n].heading+'" indeholder ikke en beskrivelse! <br><br> For at lave en grundig analyse er det vigtigt at gøre sig nogle tanker om forholdene omkring kilderne.</p>');
			inputError = true;
			break;
		}
	}
	console.log('saveJsonData - jsonData.templateData: ' + JSON.stringify(jsonData.templateData)); 
	
	return inputError;
}


function dataHasBeenEntered() {
	for (var n in jsonData.templateData){
		if (jsonData.templateData[n].value.length > 0){
			return true;
		}
	}
	return false;
}


function detectBootstrapBreakpoints(){
    if (typeof(bootstrapBreakpointSize) === 'undefined') {
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize defined.');
        window.bootstrapBreakpointSize = null;
        window.bootstrapcolObj = {xs:0,sm:1,md:2,lg:3};
    }

    $(document).ready(function() {
        console.log('detectBootstrapBreakpoints - document.ready.');
        $('body').append('<div id="bootstrapBreakpointWrapper"> <span class="visible-xs-block"> </span> <span class="visible-sm-block"></span> <span class="visible-md-block"> </span> <span class="visible-lg-block"> </span> </div>');
        bootstrapBreakpointSize = $( "#bootstrapBreakpointWrapper>span:visible" ).prop('class').split('-')[1];
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize: ' + bootstrapBreakpointSize);
    });

    $(window).on('resize', function () {
        console.log('detectBootstrapBreakpoints - window.resize.');
        bootstrapBreakpointSize = $( "#bootstrapBreakpointWrapper>span:visible" ).prop('class').split('-')[1];
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize: ' + bootstrapBreakpointSize + ', typeof(bootstrapBreakpointSize): ' + typeof(bootstrapBreakpointSize));
    });
}


$( document ).on('click', "#download", function(event){

	saveJsonData();

	if (!warnStudent()){

		var HTML = wordTemplate();

		var converted = htmlDocx.asBlob(HTML);
	    console.log("download - converted: " + JSON.stringify(converted));
		saveAs(converted, 'Min materialeanalyse.docx');
	}
});


// Forceing "utf-8" on the the new javascript window by window.open() command might not work in all browsers - therfore we
// replace all danish chars with the HTML-equivalent.
function replaceDanishChars(str) {
    return String(str).replace(/æ/g, '&oelig;').replace(/ø/g, '&oslash;').replace(/å/g, '&aring;').replace(/Æ/g, '&AElig;').replace(/Ø/g, '&Oslash;').replace(/Å/g, '&Aring;');
}

$( document ).on('click', "#copy", function(event){

	saveJsonData();

	if (!warnStudent()){

		var wordHTML = wordTemplate();

		var HTML = '<div id="wordOutput">';

		HTML += wordHTML.split('<body>')[1].split('</body>')[0];

		HTML += '<span id="BackToForm" class="btn btn-lg btn-primary">Tilbage til skabelonen</span>';

		HTML += '</div>';

		console.log('copy - HTML: ' + HTML);

		// HTML = HTML.replace('</body>', '<div><span class="btn btn-lg btn-primary">Tilbage til skabelonen</span></div></body>');

		$('body').append(HTML);
		$('#wordOutput').hide();
		$('.container-fluid').hide();
		// $('#wordOutput').show();
		$( '#wordOutput' ).fadeIn( "slow");
		
		

		// HTML = replaceDanishChars(HTML);

		// // Inspiration for the following solution: http://stackoverflow.com/questions/11965087/open-a-new-tab-window-and-write-something-to-it
		// // http://stackoverflow.com/questions/3030859/detecting-the-onload-event-of-a-window-opened-with-window-open
		// var newTab = window.open("data:text/html," + encodeURIComponent(HTML), "_blank");
		// newTab.focus();
	}

});



$( document ).on('click', "#BackToForm", function(event){
	$('#wordOutput').remove();
	$( '.container-fluid' ).fadeIn( "slow");
	// window.scrollTo(0, 0);
});


// This function replaces all "???" wildcards in strToReplace with the corrosponding "num" value translated into a string-word (between zero and twenty)
function replaceWildcard(strToReplace, num){
	// var numArray = ['nul','en','to','tre','fire','fem','seks','syv','otte','ni','ti','elleve','tolv','tretten','fjorten','femten','seksten','sytten','atten','nitten','tyve'];
	var numArray = ['nul','første','andet','tredje','fjerde','femte','sjette','syvende','ottende','niende','tiende', 'ellevte', 'tolvte', 'trettende', 'fjortende', 'femtende', 'sekstende', 'syttende', 'attende', 'nittende', 'tyvende'];
	var strArray = strToReplace.split(" ??? ");
	if (num > numArray.length-1) {
		return strArray.join(' '+String(num)+' ');
	} else {
		return strArray.join(' '+numArray[num]+' ');
	}
	return strToReplace;
}
console.log('replaceWildcard: ' + replaceWildcard('Du har ??? gode cykler tilrådighed, eller ??? dårlige?', 5)); 
console.log('replaceWildcard: ' + replaceWildcard('Du har ??? gode cykler tilrådighed, eller ??? dårlige?', 9)); 
console.log('replaceWildcard: ' + replaceWildcard('Du har ??? gode cykler tilrådighed, eller ??? dårlige?', 10));
console.log('replaceWildcard: ' + replaceWildcard('Du har ??? gode cykler tilrådighed, eller ??? dårlige?', 11)); 
console.log('replaceWildcard: ' + replaceWildcard('Du har ??? gode cykler tilrådighed, eller ??? dårlige?', 20)); 


function wordTemplate() {
	var obj = jsonData.templateData;
	var HTML = '';
	HTML += '<!DOCTYPE html>';
	HTML += '<html>';
	HTML += 	'<head>';
	HTML += 	'<meta http-equiv="Content-Type" content="text/html; charset="utf-8" />';  // Fixes issue with danish characters on Internet Explore 
	HTML += 		'<style type="text/css">';
	HTML += 			'body {font-family: arial; padding: 50px;}';
	HTML += 			'h1 {}';
	HTML += 			'h2 {}';
	HTML += 			'h3 {color: #333}';
	HTML += 			'h4 {color: #56bfc5}';
	HTML += 			'h5 {}';
	HTML += 			'h6 {}';
	HTML += 			'.selected {color: #56bfc5; width: 25%}';
	HTML += 			'p {font-size: 1.2em; margin-bottom: 5px}';
	HTML += 			'table {width:95%; margin-left:12px; border-collapse: collapse;}';
	HTML += 			'td {padding:10px 10px 10px 10px; border: 1px solid #000;}';
	HTML += 			'ol {color: #000}';
	HTML += 			'.checkQuestion{background-color: #acefed; padding: 10px 10px 10px 10px; margin-bottom: 25px}';  // g2
	HTML += 			'.useMaterial{background-color: #d2d4ec; padding: 10px 10px 10px 10px; margin-bottom: 25px}';  // e2
	HTML += 			'.innerSpacer{margin: 10px}';
	HTML +=				'.spacer{}';
	HTML += 		'</style>';
	HTML += 	'</head>';
	HTML += 	'<body>'; 
	HTML += 		'<h1>'+jsonData.mainHeader+'</h1>';

	HTML += 		'<h3>Beskrivelse</h3>';
	HTML += 		'<p>'+jsonData.instruction+'</p>';

	HTML += 		'<table>';
						for (var n in obj){
	HTML += 				'<tr><td><h3>'+obj[n].heading+'</h3><div class="description">'+obj[n].description+'</div></td><td>'+obj[n].value+'</td></tr>';
						}
	HTML += 		'</table>';

	// HTML += 		'<h3>Tjekspørgsmål til problemformuleringen:</h3> '; 
	// HTML += 		'<table class="checkQuestion">';
	// HTML += 			'<tr><td><p><b>Rød tråd:</b> Hænger hoved- og underspørgsmål sammen? Dvs. besvares hovedspørgsmålet med underspørgsmålene? Og er der en sammenhæng mellem underspørgsmålene?</p>';
	// HTML += 			'<p><b>Taksonomi:</b> Lægger hovedspørgsmålet op til undersøgelse, diskussion og vurdering (ikke kun redegørelse)?</p>';
	// HTML += 			'<p><b>Tværfaglighed:</b> Kan viden fra alle tre fag inddrages i besvarelsen af problemformuleringen?</p>';
	// HTML += 			'<p><b>Anvendelse af materiale:</b> Lægger spørgsmålene op til at inddrage bilagene i besvarelsen?</p></td></tr>';
	// HTML += 		'</table>';

	HTML += 	'</body>';
	HTML += '</html>';
	// document.write(HTML);
	return HTML;
}



$( document ).on('focusout', "textarea", function(event){ 
	saveJsonData();
	if (dataHasBeenEntered()) {
		osc.save('jsonData', jsonData);  // hasDataBeenEntered
	}
	console.log('focusout - textarea - jsonData: ' + JSON.stringify(jsonData));
});


// $( window ).unload(function() {   // <---------------  This saves data if the page is closed or reloaded. Removed from JQuery 3.0...
window.addEventListener("beforeunload", function (event) {  // <-----  This saves data if the page is closed or reloaded.
	saveJsonData();
	if (dataHasBeenEntered()) {
		osc.save('jsonData', jsonData);
	}
	console.log('unload - jsonData: ' + JSON.stringify(jsonData));
	// confirm('unload - jsonData: ' + JSON.stringify(jsonData));
});


detectBootstrapBreakpoints();  // This function call has to be here, due to the use of $(document).ready() and $(window).resize() inside the function.


// $(window).resize(function() {
//     if (bootstrapcolObj[bootstrapBreakpointSize] < bootstrapcolObj['md']) {
//     	console.log('resize - OK: ' + bootstrapBreakpointSize);
//     	$('.leftCol').addClass('freeHeight');
//     	$('.rightCol').addClass('freeHeight');
//     	$('.studentInput').addClass('freeHeight');
//     	// $('.row .leftCol').last().removeClass('borderBottom');
//     	// $('.row .rightCol').last().removeClass('borderBottom');
//     } else {
//     	$('.leftCol').removeClass('freeHeight');
//     	$('.rightCol').removeClass('freeHeight');
//     	$('.studentInput').removeClass('freeHeight');
//     	// $('.row .leftCol').last().addClass('QborderBottom');
//     	// $('.row .rightCol').last().addClass('borderBottom');
//     }
// });


$(document).ready(function() {

	returnLastStudentSession();

	template();
	
});