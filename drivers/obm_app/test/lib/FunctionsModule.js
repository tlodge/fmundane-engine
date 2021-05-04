var functionTree = {
	 "Output Selection": {
		"Default": (wc, no, defaultOutputID, outputIDs) => { 
	return defaultOutputID; 
},
		"ID-024": (wc, no, defaultOutputID, outputIDs) => { 
	console.log("ID086 - was drink picked up")
	return wc.drink86;
},
		"ID-055": (wc, no, defaultOutputID, outputIDs) => { 
	console.log("ID056 - was drink picked up")
	return wc.drink56; 
},
		"ID-060": (wc, no, defaultOutputID, outputIDs) => { 
	console.log("ID063 - first time reached")
    console.log("checking if first time")
    if(wc.first == 0) {
        console.log("hit first time");
        wc.first = 1;
        return "no:46"
    }
    else {
        console.log("hit second time");
        wc.first=0
        return "no:29";
    }
},
		"ID-003": (wc, no, defaultOutputID, outputIDs) => { 
	console.log("ID084 - has someone sat down")
	return wc.sofanode; 
},
		"ID-032": (wc, no, defaultOutputID, outputIDs) => { 
	console.log("ID032 - has someone used book")
	return wc.immersive32;  
},
		"ID-043": (wc, no, defaultOutputID, outputIDs) => { 
	console.log("ID032 - has someone used oyster")
	return wc.immersive43;  
},
},
	 "Group Selection": {
		"Default": (groupNOs, wc) => { 
	return groupNOs[0] 
},
},
	 "Layer Selection": {
		"Default": (master, others, wc) => { 
	return [master, ...others];
},
},
	 "Interaction": {
		"Default": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-012": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-013");
		    $.get( "./api/ID-013", function( data ) {console.log("call made")});
		    console.log("ID-011");
		    $.get( "./api/ID-011", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-015": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-016");
		    $.get( "./api/ID-016", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-017": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-018");
		    $.get( "./api/ID-018", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID--019": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-022");
		    $.get( "./api/ID-022", function( data ) {console.log("call made")});
			console.log("ID-100");
		    $.get( "./api/ID-100", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID--020": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-021");
		    $.get( "./api/ID-021", function( data ) {console.log("call made")});
		    console.log("ID-088");
		    $.get( "./api/ID-088", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-024": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    
		    console.log("ID-106");
		    $.get( "./api/ID-106", function( data ) {console.log("call made")});
		    console.log("making decision for ID086")
		    $.getJSON("./api/ID-086").done( function(data){
			    if(data.state == 1){
			        console.log("drink was picked up playing extra clip")
			        processData("no:12")
			    }else{
			        console.log("drink not picked up, no extra clip")
			        processData("no:8")
			    }
			})
			function processData(result) {
			    wc.drink86 = result;
			}
            
            
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-027": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-028");
		    $.get( "./api/ID-028", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-029": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-031");
		    $.get( "./api/ID-031", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-038": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-041");
		    $.get( "./api/ID-041", function( data ) {console.log("call made")});
			console.log("ID-093");
		    $.get( "./api/ID-093", function( data ) {console.log("call made")});
		    
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-039": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-040");
		    $.get( "./api/ID-040", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-043": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-042");
		    $.get( "./api/ID-042", function( data ) {console.log("call made")});
		    if(wc.first==1) {
    		    $.getJSON("./api/get_oyster_used").done( function(data){
    			 if(data.state == 1)
    			    processData("no:39")
    			else
    			    processData("no:20")
    			})
    			function processData(result) {
    			    wc.immersive43 = result;
    			}
			}
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-045": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-046");
		    $.get( "./api/ID-046", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-048": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-047");
		    $.get( "./api/ID-047", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-049": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-050");
		    $.get( "./api/ID-050", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-057": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-052");
		    $.get( "./api/ID-052", function( data ) {console.log("call made")});
		    console.log("ID-089");
		    $.get( "./api/ID-089", function( data ) {console.log("call made")});
		    console.log("ID-099");
		    $.get( "./api/ID-099", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-058": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-059");
		    $.get( "./api/ID-059", function( data ) {console.log("call made")});
			console.log("ID-098");
		    $.get( "./api/ID-098", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-062": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-074");
		    $.get( "./api/ID-074", function( data ) {console.log("call made")});
		    console.log("ID-061");
		    $.get( "./api/ID-061", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-071": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-072");
		    $.get( "./api/ID-072", function( data ) {console.log("call made")});
		    console.log("ID-073");
		    $.get( "./api/ID-073", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-075": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-076");
		    $.get( "./api/ID-076", function( data ) {console.log("call made")});
		    console.log("ID-077");
		    $.get( "./api/ID-077", function( data ) {console.log("call made")});
		    console.log("ID-078");
		    $.get( "./api/ID-078", function( data ) {console.log("call made")});
			break;
		case 'end':
		   
			wc.setInteractionComplete(interact.id);
			
			break;
	}
},
		"ID-064": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-065");
		    $.get( "./api/ID-065", function( data ) {console.log("call made")});
		    console.log("ID-066");
		    $.get( "./api/ID-066", function( data ) {console.log("call made")});
		    console.log("ID-067");
		    $.get( "./api/ID-067", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-070": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-068");
		    $.get( "./api/ID-068", function( data ) {console.log("call made")});
		    console.log("ID-069");
		    $.get( "./api/ID-069", function( data ) {console.log("call made")});
		    break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-032": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-033");
		    $.get( "./api/ID-033", function( data ) {console.log("call made")});
		    console.log("ID-090");
		    $.get( "./api/ID-090", function( data ) {console.log("call made")});
		    console.log("wc.first is ")
		    console.log(wc.first)
			if(wc.first == 1) {
    			$.getJSON("./api/get_textbook_used").done( function(data){
    			 console.log(data);
    			 if(data.state == 1){
    			 console.log("textbook was used playing extra clip")
    			    processData("no:38")
    			}else {
    			 console.log("textbook not used, no extra clip")
    			    processData("no:15")
    			}
    			})
    			function processData(result) {
    			    wc.immersive32 = result;
    			}
			}
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-035": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-034");
		    $.get( "./api/ID-034", function( data ) {console.log("call made")});
			console.log("ID-091");
		    $.get( "./api/ID-091", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-055": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-053");
		    $.get( "./api/ID-053", function( data ) {console.log("call made")});
		   
		    console.log("making decision for 056");
		    $.getJSON("./api/ID-056").done( function(data){
			    if(data.state == 1 && wc.first == 1){
			        console.log("drink was picked up playing extra clip")
			        processData("no:27")
			    }else{
			        console.log("drink not picked up, no extra clip")
			        processData("no:26")
			    }
			})
			function processData(result) {
			    wc.drink56 = result;
			}
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-001": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    wc.first = 0;
		    wc.sofanode = "no:34";
		    wc.drink86 = "no:8";
		    wc.drink56 = "no:26";
		    console.log("ID-002");
		    $.get( "./api/ID-002", function( data ) {console.log("call made")});
			console.log("ID-000");
		    $.get( "./api/ID-000", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-003": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-004");
		    $.get( "./api/ID-004", function( data ) {console.log("call made")});
			$.getJSON("./api/ID-084").done( function(data){
			 if(data.state == 1)
			    processData("no:34")
			else
			    processData("no:35")
			})
			function processData(result) {
			    wc.sofanode = result;
			}
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-005": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    wc.first = 0;
		    wc.drink86 = "no:8";
		    wc.drink56 = "no:26";
		    wc.immersive32 = "15";
		    wc.immersive43 = "38";
		    console.log("ID-007");
		     $.get( "./api/ID-007", function( data ) {console.log("call made")});
		    console.log("ID-006");
		    $.get( "./api/ID-006", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-009": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-008");
		    $.get( "./api/ID-008", function( data ) {console.log("call made")});
		    console.log("ID-010");
		    $.get( "./api/ID-010", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-025": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
			console.log("ID-095");
		    $.get( "./api/ID-095", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-037": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-092");
		    $.get( "./api/ID-092", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-087": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
			console.log("ID-096");
		    $.get( "./api/ID-096", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-101": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-101");
		    $.get( "./api/ID-101", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-102": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-102");
		    $.get( "./api/ID-102", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-103": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-103");
		    $.get( "./api/ID-103", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-104": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-104");
		    $.get( "./api/ID-104", function( data ) {console.log("call made")});
		    if(wc.first == 1){
		        console.log("ID-054");
		    $.get( "./api/ID-054", function( data ) {console.log("call made")});
		    }
		    
			break;
		case 'end':
		    console.log("ID-113");
		    $.get( "./api/ID-113", function( data ) {console.log("call made")});
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-105": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
		    console.log("ID-105");
		    $.get( "./api/ID-105", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-107": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
	         $.get( "./api/ID-109", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-108": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
			$.get( "./api/ID-110", function( data ) {console.log("call made")});
			break;
		case 'end':
			wc.setInteractionComplete(interact.id);
			break;
	}
},
		"ID-111": (wc, interact, data) => {
	switch (interact.type)
	{
		case 'start':
			break;
		case 'end':
		    location.reload(true)
			wc.setInteractionComplete(interact.id);
			break;
	}
},
},
};