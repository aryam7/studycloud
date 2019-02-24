$(document).ready(function()
{ 

	// When the user clicks on the register button, open the modal but with the register content
	$("#register-btn").click(function(event) 
	{
	    document.getElementById('my-modal').style.display = "block";
		displayContainer("register");   
	});

	// When the user clicks on the forget button, also open the modal but with the forget content
	$("#forget-btn").click(function(event)
	{
	    document.getElementById('my-modal').style.display = "block";
		displayContainer("forget");
	});

	// When the user clicks on the create button, also open the modal but with the resource viewer
	$("#creator-btn").click(function(event)
	{
		document.getElementById('my-modal').style.display = "block";
		displayContainer("resource");
		createNewResource();
		$('select[name="classAttach').selectstyle({
			width  : 400,
			height : 300,
			theme  : 'light',
			onchange : function(val){}
		});
		
	});

	// When the user clicks on the create button, also open the modal but with the resource viewer
	$("#editor-btn").click(function(event)
	{
		document.getElementById('my-modal').style.display = "block";
		displayContainer("resource");
		createResource();
		editResource();
		$('select[name="classAttach').selectstyle({
			width  : 400,
			height : 300,
			theme  : 'light',
			onchange : function(val){}
		});
	});

	$("#resource-meta-btn").click(function(event)
	{
		document.getElementById('my-modal').style.display = "block";
		displayContainer("resource");
		requestResource();
	});

	// When the user clicks on <span> (x), close the modal
	$("#close-modal").click(function(event) 
	{
		document.getElementById('my-modal').style.display = "none";
		document.getElementById('resource-head').innerHTML = " ";
		document.getElementById('modules').innerHTML = " "; //clean the display box up
		resetContentNum();
		//location.reload();
	});

});


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) 
{
    if (event.target == document.getElementById('my-modal')) 
    {
		document.getElementById('my-modal').style.display = "none";
		document.getElementById('resource-head').innerHTML = " ";
		document.getElementById('modules').innerHTML = " "; //clean the display box up
		resetContentNum();
		/*
		var x = document.getElementsByClassName("module");
		for (var i; i<x.length; i++){
			x[i].innerHTML=" ";
		}*/
		
		//location.reload();
    }
}

// Display only the container specified.
function displayContainer(container) 
{
	// Display this container, undisplay all other containers. 
	var containers = ["forget", "register", "resource"];
	for(var i = 0; i < 3; i++) 
	{
		if (containers[i] == container)
		{
			document.getElementById(containers[i]+'-container').style.display = "block";
		}
		else
		{
			document.getElementById(containers[i]+'-container').style.display = "none";
		}
	}

}

/*
function callback(received)
{
	var resource = JSON.parse(received);
	// add id = 'resource-name so we can edit the style of resource name in scss
	document.getElementById('resource-head').innerHTML="<div><h1 id = 'resource-name'>"+resource.meta.name+"</h1><div>contributed by <div id='author-name'></div></div>";
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
	// Create a new module.
	document.getElementById('modules').innerHTML+="<div class=module id='module-"+num+"'></div>";
	if(element.type=="link")
	{
		document.getElementById('module-'+num).innerHTML+="<div><a href="+element.content+">"+element.name+"</a></div>";
	}
	else // Apparently by MVP things are HTML text. Check this. 
	{
		document.getElementById('module-'+num).innerHTML+="<div class=resource-divider></div><h2>"+element.name+"</h2><div>"+element.content+"</div>";
	}
	// Add other types as you will. 

	// Display dates. 
	document.getElementById('module-'+num).innerHTML+="<div class='date'>Created: "+element.created+"</div>";
	document.getElementById('module-'+num).innerHTML+="<div class='date'>Modified: "+element.modified+"</div>";
}

// We can't find the resource requested. 
function error()
{
	document.getElementById('resource-head').innerHTML="<h1>Sorry! We don't have that resource. Would you like to write it?</h1>";
	document.getElementById('modules').innerHTML=""; // Clear modules if anything exists within it. 
}

function createResource()
{
	//create all the input to create resources
	document.getElementById('resource-head').innerHTML="<h1>Resource Creator</h1>"
	document.getElementById('modules').innerHTML = "<div class=resource-divider></div> <form> <div class 'resource-creator> Resource Name: <br> <input type = 'text' id = 'meta-name'> <br> Resource Use:  <select id = 'resource-use'> <option value = '1'> Note </option> <option value = '2'> Quiz </option> </select> <br> </div> <div class = 'content-creator'> Resource Content Name: <br> <input type = 'text' id = 'content-name'> <br> Content Type:  <select id = 'content-type'> <option value = 'text'> Text </option> <option value = 'link'> Link </option> </select> <br> Content: <br> <textarea rows = '5' id = 'content'> </textarea> </div> </form> <div> <button type = 'button' id = 'submit-button' onclick = 'submitContent()'> Submit </button> <p id = 'demo'> </p></div> ";

}

function submitContent() 
{
	//this function gets triggered with the submit function is clicked
	//all the userinput are stored in these variables
	var resourceName = document.getElementById("meta-name").value;
	var resourceUse = document.getElementById("resource-use").value;
	var contentName = document.getElementById("content-name").value;
	var contentType = document.getElementById("content-type").value;
	var content = document.getElementById("content").value;

	if (document.getElementById('resource-container').className == "view"){
		resourceCreator = false;
	}
	else{
		resourceCreator = true;
	}
	
	document.getElementById("demo").innerHTML = resourceName + resourceUse + contentName + contentType + content;
	//document.getElementById("demo").innerHTML = resourceCreator + document.getElementById('resource-container').className;
}

*/

