// Data format I get:
// {"resource": {"name": "Resource 1",
// 			"author_name": "Giselle Serate",
// 			"author_type": "student"},
//  "content": [ {"name": "Resource Content 1",
//  			 "type": "link",
//  			 "content": "<url>",
//  			 "created_at": "date",
//  			 "updated_at": "date"}
//  		  ]
// }


// From https://www.w3schools.com/js/js_json_parse.asp

// var xmlhttp = new XMLHttpRequest();
// xmlhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//         var myObj = JSON.parse(this.responseText);
//         document.getElementById("demo").innerHTML = myObj.name;
//     }
// };
// xmlhttp.open("GET", "json_demo.txt", true);
// xmlhttp.send();

// Dummy data which I would get from the server.
var received = '{"meta": {"name": "Resource 1", "author_name": "Giselle Serate", "author_type": "teacher"}, "contents": [ {"name": "Resource Content 1", "type": "link", "content": "google.com", "created": "date", "updated": "date"}]}';

$(document).ready(function(){ 
	callback(received);
});

// Callback function that server will give the data.
function callback(received)
{
	var resource = JSON.parse(received);
	document.getElementById('resource-name').innerHTML=resource.meta.name;
	set_author(resource.meta.author_name, resource.meta.author_type);
	for(var i=0;i<1;i++)
	{
		display_content(i, resource.contents[i]);
	}
}

// Set author and classes to format. 
function set_author(name, type) 
{
	// Clear all classes on the author-name field. 
	var cl=document.getElementById('author-name').classList;
	for(var i=cl.length; i>0; i--) {
	    cl.remove(cl[0]);
	}
	document.getElementById('author-name').classList.add(type);
	document.getElementById('author-name').innerHTML=name;
}

// Display one of the content elements in the array.
function display_content(num, element)
{
	if(element.type="link")
	{
		document.getElementById('content-'+num).innerHTML="<a href="+element.content+">"+element.name+"</a>";
	}
	// Add other types as you will. 
}