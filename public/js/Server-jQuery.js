
function Server()
{
    // class Server handles communication with the server 
    // no data member needed 

    var self = this;
	$.ajaxSetup({
	    headers: {
	        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	    }
	});
}

Server.prototype.getResource = function(resource_id, callback1, callback2)
{
	var self = this;
	var url = "/data/resource";

	$.ajax({
		url: url,
		type: 'GET',
		data: {id: resource_id},
		dataType: 'json',
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{			
			if(typeof callback1 === 'function')
			{
				return callback1(XMLHttpRequest);
			}
			else
			{
				console.log("error: "+textStatus+"\n"+errorThrown);
				console.log(XMLHttpRequest);
			}
		},
		success: function(response)
		{
			if(typeof callback2 === 'function')
			{
				return callback2(response);
			}
			else
			{
				return response;
			}
		}
	});
}

Server.prototype.addResource = function(content, callback1, callback2)
{
	var self = this;
	var url = "/resources";

	$.ajax({
		url: url,
		type: 'POST',
		data: content,
		dataType: 'json',
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{			
			if(typeof callback1 === 'function')
			{
				return callback1(XMLHttpRequest);
			}
			else
			{
				console.log("error: "+textStatus+"\n"+errorThrown);
				console.log(XMLHttpRequest);
			}
		},
		success: function(response)
		{
			if(typeof callback2 === 'function')
			{
				return callback2(response);
			}
			else
			{
				return response;
			}
		}
	});
}

Server.prototype.editResource = function(resource_id, content, callback1, callback2)
{
	var self = this;
	var url = "/resources/" + resource_id;
	content['_method'] = "PATCH";

	$.ajax({
		url: url,
		type: 'POST',
		data: content,
		dataType: 'json',
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{			
			if(typeof callback1 === 'function')
			{
				return callback1(XMLHttpRequest);
			}
			else
			{
				console.log("error: "+textStatus+"\n"+errorThrown);
				console.log(XMLHttpRequest);
			}
		},
		success: function(response)
		{
			if(typeof callback2 === 'function')
			{
				return callback2(response);
			}
			else
			{
				return response;
			}
		}
	});
}

Server.prototype.deleteResource = function(resource_id, callback1, callback2)
{
	var self = this;
	var url = "/resources/" + resource_id;

	$.ajax({
		url: url,
		type: 'POST',
		data: {'_method': "DELETE"},
		dataType: 'json',
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{			
			if(typeof callback1 === 'function')
			{
				return callback1(XMLHttpRequest);
			}
			else
			{
				console.log("error: "+textStatus+"\n"+errorThrown);
				console.log(XMLHttpRequest);
			}
		},
		success: function(response)
		{
			if(typeof callback2 === 'function')
			{
				return callback2(response);
			}
			else
			{
				return response;
			}
		}
	});
}

Server.prototype.getData = function(node, levels_up, levels_down, handleError, handleSuccess)
{
    var self = this;    
	// if any of node, levels_up, or levels_down is undefined/null, use an empty string instead
	// but allow levels to be 0
	node = node ? node : ""
	levels_up = levels_up || levels_up === 0 ? levels_up : ""
	levels_down = levels_down || levels_down === 0 ? levels_down : ""
	// what is the url for this request?
	url = "/data/topic_tree/?topic="+node+"&levels_up="+levels_up+"&levels_down="+levels_down;
    return d3.json(url, {method: 'get'}).then(function(data, error){
    	if (error){			
    		return self.handleError(url, error, handleError);
    	}
    	else {			
    		return self.handleSuccess(data, handleSuccess);
		}	
    });
};

Server.prototype.handleError = function(url, error, treeHandleError)
{
	var self = this;
	if(!(typeof treeHandleError === 'function')){

		return(error);
	}
	if (error == "Error: Internal Server Error")
		return d3.json(url, {method: 'get'}).then(function(data, error){
			if (error){
				if(error != "Error: Internal Server Error")
				{					
					throw(error);
				}
				else
				{					
					return treeHandleError(error);
					
				}
			}
			else {				
				return self.handleSuccess(data);
			}
		});
	else{		
		return treeHandleError(error);
	}
    
};

Server.prototype.handleSuccess = function(data, treeHandleSuccess)
{
	var self = this;
	if(!(typeof treeHandleSuccess === 'function'))
	{
		return data;
	}
    return treeHandleSuccess(data);
};




Server.prototype.getTopic = function(id, callback1, callback2)
{
	var self = this;
	var url = "/data/topic";

	$.ajax({
		url: url,
		type: 'GET',
		data: {id: id},
		dataType: 'json',
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{			
			if(typeof callback1 === 'function')
			{
				return callback1(XMLHttpRequest);
			}
			else
			{
				console.log("error: "+textStatus+"\n"+errorThrown);
				console.log(XMLHttpRequest);
			}
		},
		success: function(response)
		{
			if(typeof callback2 === 'function')
			{
				return callback2(response);
			}
			else
			{
				return response;
			}
		}
	});	
}

Server.prototype.addTopic = function(content, callback1, callback2)
{
	var self = this;
	var url = "/topics";

	$.ajax({
		url: url,
		type: 'POST',
		data: content,
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{			
			if(typeof callback1 === 'function')
			{
				return callback1(XMLHttpRequest);
			}
			else
			{
				console.log("error: "+textStatus+"\n"+errorThrown);
				console.log(XMLHttpRequest);
			}
		},
		success: function(response)
		{
			if(typeof callback2 === 'function')
			{
				return callback2(response);
			}
			else
			{
				return response;
			}
		}
	});
}

Server.prototype.updateTopic = function(id, content, callback1, callBack2)
{
	var self = this;
	var url = "/topics/" + id;
	content['_method'] = 'PATCH';

	$.ajax({
		url: url,
		type: 'POST',
		data: content,
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{			
			if(typeof callback1 === 'function')
			{
				return callback1(XMLHttpRequest);
			}
			else
			{
				console.log("error: "+textStatus+"\n"+errorThrown);
				console.log(XMLHttpRequest);
			}
		},
		success: function(response)
		{
			if(typeof callback2 === 'function')
			{
				return callback2(response);
			}
			else
			{
				return response;
			}
		}
	});
}

Server.prototype.deleteTopic = function(id, callback1, callback2)
{
	var self = this;
	var url = "/topics/" + id;

	$.ajax({
		url: url,
		type: 'POST',
		data: {'_method': "DELETE"},
		error: function(XMLHttpRequest, textStatus, errorThrown)
		{			
			if(typeof callback1 === 'function')
			{
				return callback1(XMLHttpRequest);
			}
			else
			{
				console.log("error: "+textStatus+"\n"+errorThrown);
				console.log(XMLHttpRequest);
			}
		},
		success: function(response)
		{
			if(typeof callback2 === 'function')
			{
				return callback2(response);
			}
			else
			{
				return response;
			}
		}
	});
}

/*
Server.prototype.storeClass = function(class_JSON, callback1, callback2)
{
	var self = this;
	var url = "/classes";
	var goodCookie = self.getCookie("XSRF-TOKEN");

	if (goodCookie == ""){
		return callback1();
	}

	const csrftoken = goodCookie;
	const headers = new Headers({
        'X-XSRF-TOKEN': csrfToken
    });
	return d3.json(url, {method: 'post', headers, body: content}).then(function(data, error){
		if(error)
		{
			if(typeof callback1 === 'function')
			{
				return callback1(error);
			}
			else
			{
				throw error;
			}
		}
		else
		{
			if(typeof callback2 === 'function')
			{
				return callback2(data);
			}
			else
			{
				return data;
			}
		}
	});
}

Server.prototype.getClassesJSON = function(id, handleError, handleSuccess)
{
	
	var self = this;
		
	url = "/data/class?id="+id;
	return d3.json(url)
		.then(function(data){			
				return handleSuccess(id, data);
			})
		
		.catch(function(error){
			return handleError(error);			
		});		
}

Server.prototype.updateClass = function(class_id, content, callBack1, callBack2)
{
	
	var self = this;
	var url = "/classes/" + class_id;
	var goodCookie = self.getCookie("XSRF-TOKEN");

	if (goodCookie == ""){
		return callBack1()
	}

	const csrftoken = goodCookie;
	const headers = new Headers({
        'X-XSRF-TOKEN': csrfToken
    });
	return d3.json(url, {method:'patch', headers, body: content}).then(function(data, error){
		if(error)
		{
			if(typeof callback1 === 'function')
			{
				return callback1(error);
			}
			else
			{
				throw error;
			}
		}
		else
		{
			if(typeof callback2 === 'function')
			{
				return callback2(data);
			}
			else
			{
				return data;
			}
		}
	});
}

Server.prototype.deleteClass = function(class_id, callback1, callback2)
{
	callback1
	var self = this;
	var url = "/classes/" + class_id;
	var goodCookie = self.getCookie("XSRF-TOKEN");

	if (goodCookie == ""){
		return callback1();
	}

	const csrftoken = goodCookie;
	const headers = new Headers({
        'X-XSRF-TOKEN': csrfToken
    });

	return d3.json(url, {method: 'delete', headers}).then(function(data, error){
		if(error)
		{
			if(typeof callback1 === 'function')
			{
				return callback1(error);
			}
			else
			{
				throw error;
			}
		}
		else
		{
			if(typeof callback2 === 'function') 			
			{ 
				return callback2(data);
			}
			else
			{
				return data;
			}
		}
	});
}

Server.prototype.attachClass = function(class_id, content, callBack1, callBack2)
{
	
	var self = this;
	var url = "/classes/attach/" + class_id;
	var goodCookie = self.getCookie("XSRF-TOKEN");

	if (goodCookie == ""){
		return callBack1()
	}

	const csrftoken = goodCookie;
	const headers = new Headers({
        'X-XSRF-TOKEN': csrfToken
    });
	return d3.json(url, {method:'patch', headers, body: content}).then(function(data, error){
		if(error)
		{
			if(typeof callback1 === 'function')
			{
				return callback1(error);
			}
			else
			{
				throw error;
			}
		}
		else
		{
			if(typeof callback2 === 'function')
			{
				return callback2(data);
			}
			else
			{
				return data;
			}
		}
	});
}

Server.prototype.attachResource = function(resource_id, content, callBack1, callBack2)
{
	
	var self = this;
	var url = "/resources/attach/" + resource_id;
	var goodCookie = self.getCookie("XSRF-TOKEN");

	if (goodCookie == ""){
		return callBack1()
	}

	const csrftoken = goodCookie;
	const headers = new Headers({
        'X-XSRF-TOKEN': csrfToken
    });
	return d3.json(url, {method:'patch', headers, body: content}).then(function(data, error){
		if(error)
		{
			if(typeof callback1 === 'function')
			{
				return callback1(error);
			}
			else
			{
				throw error;
			}
		}
		else
		{
			if(typeof callback2 === 'function')
			{
				return callback2(data);
			}
			else
			{
				return data;
			}
		}
	});
}

Server.prototype.detachResource = function(resource_id, content, callBack1, callBack2)
{
	
	var self = this;
	var url = "/resources/detach/" + resource_id;
	var goodCookie = self.getCookie("XSRF-TOKEN");

	if (goodCookie == ""){
		return callBack1()
	}

	const csrftoken = goodCookie;
	const headers = new Headers({
        'X-XSRF-TOKEN': csrfToken
    });
	return d3.json(url, {method:'patch', headers, body: content}).then(function(data, error){
		if(error)
		{
			if(typeof callback1 === 'function')
			{
				return callback1(error);
			}
			else
			{
				throw error;
			}
		}
		else
		{
			if(typeof callback2 === 'function')
			{
				return callback2(data);
			}
			else
			{
				return data;
			}
		}
	});
}

Server.prototype.getTree = function(id, levels_up, levels_down, handleError, handleSuccess)
{
	
	var self = this;
		
	url = "/data/class_tree?id=" + id + "&levels_up=" + levels_up + "&levels_down=" + levels_down +id;
	return d3.json(url)
		.then(function(data){			
				return handleSuccess(id, data);
			})
		
		.catch(function(error){
			return handleError(error);			
		});		
}
*/