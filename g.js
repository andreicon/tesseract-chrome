$('img').each(function(i,e){
	Tesseract.recognize($(e).attr('src')).then(function(result){
		if (result.text!= "") {
			stringed = JSON.stringify(JSON.decycle(result));
			chrome.runtime.sendMessage(stringed);
		} 
	});
})

