var cnstCNT_CELL = 4;
var MAX_INT_32 =  2147483647;
var MAX_CNT_INT =  10;

function readXML()
{
	var a = document.getElementById("download_link");
	a.style.display = "none";
	var add_button = document.getElementById("add_button");
	add_button.style.display = "inline";
	var xml = new XMLHttpRequest();
	xml.open( 'GET', 'Input.xml' , false );
	xml.send();
	var xmlData = xml.responseXML;
	if( xmlData )
	{
		xmlData = ( new DOMParser() ).parseFromString( xml.responseText, 'text/xml' );
		var params = xmlData.getElementsByTagName( "Parameter" );
		console.log(params);
		var output = '<tr><td>Ид</td><td>Name</td><td>Description</td><td>Type</td></tr>';
		for( var i = 0; i < params.length; i++ )
		{
			var type = identifyType( params[i].getElementsByTagName( "Type" )[0].textContent );
			var value = params[i].getElementsByTagName( "Value" )[0].textContent;
			var typeField = getFieldByType( type, value );
			var idField = params[i].getElementsByTagName( "Id" )[0].textContent;
			var nameField = params[i].getElementsByTagName( "Name" )[0].textContent;
			var descriptionField = params[i].getElementsByTagName( "Description" )[0].textContent;
			output += '<tr>';
			output += '<td>' + "<input type=\"text\" value=\"" + idField + "\" />" + '</td>';
			output += '<td>' + "<input type=\"text\" value=\"" + nameField + "\" />" + '</td>';
			output += '<td>' + "<input type=\"text\" value=\"" + descriptionField + "\" />" + '</td>';
			output += '<td>' + typeField + '</td>';
			output += "<td><input type=\"button\" value=\"Delete\" onclick=\"deleteRow(this)\"></td>";
			output += '</tr>';
		}
		document.getElementById( 'table_id' ).innerHTML = output;
	}
}

function identifyType( str )
{
	if( str.indexOf('String') > -1 )
	{
		return 'String';
	}
	else if( str.indexOf('Int') > -1 )
	{
		return 'Int';
	}
	else if( str.indexOf('Boolean') > -1 )
		return 'Boolean';
	return '';
}

function checkNumber( input ) 
{	
	var value = input.value;
	var Reg = new RegExp("(^([+-]?)([1-9]+?)[0-9]*)|^0$");
    if (Reg.test(value) && value <= MAX_INT_32) 
	{
		input.style.backgroundColor = '';
		return true;
	}
	input.style.backgroundColor = 'red';
	return false;
}

function onPaste(event, input)
{	
	var val = event.clipboardData.getData('Text');
	if( input.value >= MAX_INT_32 )
	{
		return false;
	}
	return  (/^-?\d*$/.test(val));
}


function onKeyUpEvent(event, input)
{
	if( event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 8 )
		return;
	if (input.getAttribute('value').length < 2) { 
		input.setAttribute("value", input.value); 
		return; 
	} 
	var regular = new RegExp("(^([+-]?)([1-9]+?)[0-9]*$)|^0$"); 
	if (!regular.test(input.value)) { 
		input.value = input.getAttribute('value'); 
		return; 
	} 
	input.setAttribute("value", input.value);
}
function onKeyDownEvent(event, input)
{
	if( input.selectionStart == 0 && event.keyCode == 96 && input.value.length >= 1 )
		return false;
	if( input.selectionStart == 1 && event.keyCode == 96 && input.value.length >= 1 && ( input.value[0] == "-" || input.value[0] == "+") )
		return false;
}

function onKeyPressEvent( event, input )
{
	var res = true;
	if(event.keyCode<48 || event.keyCode>57) 
		res= false;
	if(event.keyCode==45)
	{
		if( input.value.indexOf('-') == -1  && event.currentTarget.selectionEnd == 0 )
			res = true;
	}	
	else if(event.keyCode==43)
	{
		if( input.value.indexOf('+') == -1  && event.currentTarget.selectionEnd == 0 )
			res = true;
	}	
	if( res )
	{
		if( input.value.length+1 > MAX_CNT_INT )
			res = false;
	}
	if( input.value.indexOf('0') == 0 )
		input.value = "";
	return res;
}

function getFieldByType( type, value )
{
	switch ( type ) 
	{
		case 'String':
		if( value === "" )
			return "<input type=\"text\" />";
			return "<input type=\"text\" value=" + value + " />";
		case 'Int':
			return "<input type=\"text\" onpaste=\"return onPaste(event, this)\" digit=\"true\" onkeydown=\" return onKeyDownEvent(event, this)\" onkeyup=\" return onKeyUpEvent(event, this)\" onkeypress=\" return onKeyPressEvent(event, this)\" value=" + value + " />";
		case 'Boolean':
			var val_checkbox = "";
			if( value === "True" )
				val_checkbox = "checked";
			return "<input type=\"checkbox\"" + val_checkbox + "/>";
	}
}

function getDefaultValueByType( type )
{
	switch ( type ) 
	{
		case 'String':
			return "";
		case 'Int':
			return 0;
		case 'Boolean':
			return "False";
	}
}

function addRow()
{
	var a = document.getElementById("download_link");
	a.style.display = "none";
  
	var	table =	document.getElementById( 'table_id' );
	var newRow=table.insertRow(1);
	for( var i = 0; i < cnstCNT_CELL; i++ )
	{
		var newCell = newRow.insertCell(i);
		newCell.innerHTML="<input type=\"text\" value=\"\" />";
	}
	var newCell = newRow.insertCell( cnstCNT_CELL );
	newCell.innerHTML= " <select id=\"SelType\" onchange=\"onChangeSelect( this )\" ><option>String</option><option>Int</option><option>Boolean</option></select>"
	newCell = newRow.insertCell( cnstCNT_CELL+1 );
	newCell.innerHTML= " <input type=\"button\" value=\"Delete\" onclick=\"deleteRow(this)\">"
}

function deleteRow(r)
{
	var i=r.parentNode.parentNode.rowIndex;
	document.getElementById('table_id').deleteRow(i);
}

function onChangeSelect( select )
{
	var	table =	document.getElementById( 'table_id' );
    var allRows = table.getElementsByTagName("tr");
	var i=select.parentNode.parentNode.rowIndex;
	var cell = allRows[i].getElementsByTagName("td")[cnstCNT_CELL-1];
	cell.innerHTML = getFieldByType( select.value, getDefaultValueByType( select.value ) );
}

function getXMLType( child )
{
	switch ( child.getAttribute('type') ) 
	{
		case 'text':
		{
		    if( child.getAttribute('digit') == "true") 
				return "System.Int32";
			else
				return "System.String";
		}
		case 'checkbox':
			return "System.Boolean";
	}
}

function getXMLValueType( child )
{
	if( child.type == "checkbox" && child.checked == true )
		return "True";
	if( child.type == "checkbox" && child.checked == false )
		return "False";
	
	return child.value;
}

function getTableInXML()
{
	var	table =	document.getElementById( 'table_id' );
    var allRows = table.getElementsByTagName("tr");
	var outStr = "<?xml version=\"1.0\"?>\n";
	outStr += "<Parameters>\n";
	for( var i = 1; i < allRows.length; i++ )
	{
		outStr += "<Parameter>\n";
		var allCell = allRows[i].getElementsByTagName("td");
		outStr += "<Id>" + allCell[0].childNodes[0].value + "</Id>\n";
		outStr += "<Name>" + allCell[1].childNodes[0].value + "</Name>\n";
		outStr += "<Description>" + allCell[2].childNodes[0].value + "</Description>\n";

		console.log( allCell[3].childNodes[0].getAttribute('type') );
		var xmlType = getXMLType( allCell[3].childNodes[0] );
		outStr += "<Type>" + xmlType + "</Type>\n";
		if( xmlType == "System.Int32" && !checkNumber( allCell[3].childNodes[0] ) )
			return "";
		var xmlValue = getXMLValueType( allCell[3].childNodes[0] );
		outStr += "<Value>" + xmlValue + "</Value>\n";
		console.log( allCell[3].childNodes[0] );
		outStr += "</Parameter>";
	}
	outStr += "</Parameters>";
	return outStr;
}

function checkTable()
{
	var	table =	document.getElementById( 'table_id' );
    var allRows = table.getElementsByTagName("tr");
	var boolExist = false;
	for( var i = 1; i < allRows.length; i++ )
	{
		var allCell = allRows[i].getElementsByTagName("td");
		var xmlType = getXMLType( allCell[3].childNodes[0] );
		if( xmlType == "System.Boolean" )
		{
			boolExist = true;
			var xmlValue = getXMLValueType( allCell[3].childNodes[0] );
			if( xmlValue == "True" )
				return true;
		}
	}
	return boolExist ? false : true;
}

function download( name, type) {
  if( !checkTable() )
  {
	alert( "Fix error in table" );
		return;
  }
  var text = getTableInXML();
  if( text == "" )
  {
	alert( "Fix error in table" );
	return;
  }
  var a = document.getElementById("download_link");
  var file = new Blob([text], {type: type});
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.style.display = "inline";
}

function onChangeTable()
{
  var a = document.getElementById("download_link");
  a.style.display = "none";
}
