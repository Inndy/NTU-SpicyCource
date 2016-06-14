"use strict"

/* PART ONE: INPUT REFs & COURSEs */
var courses = document.getElementById("courses");
var refs = document.getElementById("refs");
var add_ref_button = document.getElementById("add-ref");
var add_course_button = document.getElementById("add-course");
var form = document.getElementsByTagName("form")[0];

var add_input = function(type_name) {
  var type_first = type_name.split('')[0];
  var num = document.getElementsByClassName(type_name).length;
  
  var div = document.createElement("div");
  div.setAttribute("class",type_name + " pure-g");
  div.setAttribute("data-valid",0);
  
  var label_id = document.createElement("label");
  label_id.setAttribute("for",type_first + "id_" + num)
  label_id.setAttribute("class","pure-u-1-6");
  label_id.innerHTML = '課號：';
  
  var input_id = document.createElement("input");
  input_id.setAttribute("name",type_first + "id_" + num)
  input_id.setAttribute("class","pure-u-1-3");
  
  var label_class = document.createElement("label");
  label_class.setAttribute("for",type_first + "class_" + num);
  label_class.setAttribute("class","pure-u-1-6");
  label_class.innerHTML = "班次：";

  var input_class = document.createElement("input");
  input_class.setAttribute("name",type_first + "class_" + num);
  input_class.setAttribute("class","pure-u-1-3");
  
  var label_check = document.createElement("label");
  label_check.setAttribute("class","pure-u-1-6");
  label_check.innerHTML = "課名：";
  
  var text_check = document.createElement("div");
  if (type_first == "r")
    text_check.setAttribute("class","pure-u-1-3 check");
  else
    text_check.setAttribute("class","pure-u-5-6 check");
  
  div.appendChild(label_id);
  div.appendChild(input_id);
  div.appendChild(label_class);
  div.appendChild(input_class);
  div.appendChild(label_check);
  div.appendChild(text_check);
  
  input_id.addEventListener("input",function(e){ add_input_others(div,text_check,type_first,num); });
  input_class.addEventListener("input",function(e){ add_input_others(div,text_check,type_first,num); });
  eval(type_name + "s.appendChild(div)");
}

var add_input_others = function(div,text_check,type_first,num) {
  /* CHECK IF INVALID: True for valid, false for invalid */
  var input_id = form.elements[type_first + 'id_' + num].value.trim();
  var input_class = form.elements[type_first + 'rclass_' + num].value.trim();
  var response = search(input_id, input_class);

  if (!response.isValid) { // if search fail
    while (div.getElementsByTagName("select").length > 0) {
      var end = div.getElementsByTagName("label").length - 1;
      div.removeChild(div.getElementsByTagName("select")[0]);
      div.removeChild(div.getElementsByTagName("label")[end]);
    }
    
    div.setAttribute("data-valid",0);
    text_check.innerHTML = "課號或班次錯誤！";
    text_check.setAttribute("style","color: Red;");
    
    return;
  }
  else { // if search succeed
    var name = response.name;
    var class_str = response.class;
    if (class_str.length > 0)
      class_str = "(" + class_str + "班)";
    
    div.setAttribute("data-valid",1);
    text_check.innerHTML = name + class_str;
    text_check.setAttribute("style","color: Green");
      
    if (type_first == "r") {  // for refs
      var label_grade = document.createElement("label");
      label_grade.setAttribute("for",type_first + "grade_" + num);
      label_grade.setAttribute("class","pure-u-1-6");
      label_grade.innerHTML = "成績：";
      
      var grades = ["A+","A","A-","B+","B","B-","C+","C","C-","F or X"];
      var select_grade = document.createElement("select");
      select_grade.setAttribute("name",type_first + "grade_" + num);
      select_grade.setAttribute("class","pure-u-1-3");
      for (var i = 0; i < grades.length; ++i) {
        var option = document.createElement("option");
        if (grades[i].length > 3)
          option.setAttribute("value",grades[i].split('')[0]);
        else
          option.setAttribute("value",grades[i]);
        
        option.innerHTML = grades[i];
        select_grade.appendChild(option);
      }
      
      div.appendChild(label_grade);
      div.appendChild(select_grade);
    }
    
    return;
  }
}

var search = function(input_id, input_class) {
  // Pass "input_id" and "input_class" to back-end
  
  // fake response
  var response = {
    "isValid" : true,
    "name"    : "開源作業系統",       // can be neglected if isValid = false
    "class"   : "01",                 // can be neglected if isValid = false
  }
  
  return response;
}

var process = function(input_data) {
  /* Change view */
  document.getElementById("input").style.display = 'none';
  document.getElementById("process").style.display = 'block';
  var interval = setInterval(function(){
    document.getElementById("process").innerHTML += ".";
  }, 1000);
  
  // Pass "input_data" to back-end
  
  // Call "display" and clear "interval" when response is received
  clearInterval(interval);
  // fake data
  var data = [{
    "name"   : "演算法",
    "grade"  : "B+",
    "credit" : 3,
  }, {
    "name"  : "量子演算法",
    "grade" : "A-",
    "credit" : 3,
  }, {
    "name": "開源系統軟體",
    "grade" : "A+",
    "credit" : 3,
  }, {
    "name": "作業研究",
    "grade" : "F",
    "credit" : 3,
  }, {
    "name": "資訊管理導論",
    "grade" : "C+",
    "credit" : 3,
   }];
   
  display(data);
}

/* Create first input */
add_input("ref");
add_input("course");

/* Bind Events to Buttons */
add_ref_button.addEventListener("click",function(e){ add_input ("ref"); });
add_course_button.addEventListener("click",function(e){ add_input ("course"); });

/* Bind Event to Submit */
var input = {};
form.addEventListener("submit", function(e) {
  e.preventDefault();
  var ref = [];
  var course = [];
  
  /* Get refs */
  for (var i = 0; i < document.getElementsByClassName("ref").length; ++i)
    if (document.getElementsByClassName("ref")[i].getAttribute("data-valid") == 1)
      ref.push({
        "id"    : form.elements['rid_' + i].value.trim(),
        "class" : form.elements['rclass_' + i].value.trim(),
        "grade" : form.elements['rgrade_' + i].value.trim(),
      });
  
  /* Get courses */
  for (var i = 0; i < document.getElementsByClassName("course").length; ++i)
    if (document.getElementsByClassName("course")[i].getAttribute("data-valid") == 1)
      course.push({
        "id"    : form.elements['cid_' + i].value.trim(),
        "class" : form.elements['cclass_' + i].value.trim(),
      });

  /* Check if valid  */
  input["referrence"] = ref;
  input["course"] = course;
  if (ref.length == 0) {
    alert("未輸入上學期成績");
    return;
  }
  if (course.length == 0) {
    alert("未輸入欲預測之課程");
    return;
  }
  
  /* Processing in back-end */
  process(input);
});

/* PART TWO: DISPLAY */
var grade2point = {
  "A+" : 4.3,
  "A"  : 4.0,
  "A-" : 3.7,
  "B+" : 3.3,
  "B"  : 3.0,
  "B-" : 2.7,
  "C+" : 2.3,
  "C"  : 2.0,
  "C-" : 1.7,
  "F"  : 0,
};

var point2grade = {
  4.3 : "A+",
  4   : "A",
  3.7 : "A-",
  3.3 : "B+",
  3   : "B",
  2.7 : "B-",
  2.3 : "C+",
  2   : "C",
  1.7 : "C-",
  0   : "F",
};

var display = function(input_data) {
  /* Change view */
  document.getElementById("process").style.display = 'none';
  document.getElementById("output").style.display = 'block';

  /* Parameters */
  var width = document.getElementById("canvas").offsetWidth;
  var height = document.getElementById("canvas").offsetHeight;
  var margin = {
    "top": 20,
    "right": 10,
    "bottom": 40,
    "left": 40,
  };
  var bar_width = (width - margin.left - margin.right) / (input_data.length + 1) - 20 * 2;
  var canvas = d3.select("#canvas");
  var upper = 4.8;
  var lower = -0.5;

  /* Fucntions */
  var xScale = d3.scale.linear()
                   .domain([0.5, input_data.length + 0.5])
                   .range([0, width - margin.left - margin.right]);

  var yScale = d3.scale.linear()
                   .domain([upper, lower])
                   .range([0, height - margin.top - margin.bottom]);

  var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .tickPadding(5)
                  .ticks(input_data.length + 2)
                  .tickFormat(function(d){ return ((d > 0) && (d < input_data.length + 1)) ? input_data[d-1].name : " "; });

  var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .tickSize(- width + margin.left + margin.right, 0)
                  .tickPadding(20)
                  .tickValues([0,1.7,2.0,2.3,2.7,3.0,3.3,3.7,4.0,4.3])
                  .tickFormat(function(d){ return point2grade[d]; });
  
  /* Groups */
  var names = canvas.append("g")
                      .attr("id", "name")
                      .attr("transform", "translate(" + margin.left + ", " + (height - margin.bottom) + ")");
  
  var grades = canvas.append("g")
                       .attr("id", "grade")
                       .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
  
  var plots = canvas.append("g")
                      .attr("id", "plot")
                      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                      .selectAll("void").data(input_data).enter();

  /* Grades */
  grades.attr("class","axis").call(yAxis)
          .selectAll("text").attr("style","text-anchor: middle");
  
  /* Course names */
  names.attr("class","axis").call(xAxis);

  /* Bars */
  plots.append("rect")
         .attr({
           "class"  : function(d) {
             if (grade2point[d.grade] > 3.5) return "pass-a";
             else if (grade2point[d.grade] > 2.5) return "pass-b";
             else if (grade2point[d.grade] > 1.5) return "pass-c";
             else return "fail";
           },
           "width"  : bar_width,
           "height" : function(d) { return yScale(upper + lower - grade2point[d.grade]); },
           "x"      : function(d, i) { return xScale(i + 1) - bar_width / 2; },
           "y"      : function(d) { return yScale(grade2point[d.grade]); },     
         });
  
  plots.append("text").text(function(d){ return d.grade; })
         .attr({
           "class" : "grade",
           "x"     : function(d,i) { return xScale(i + 1)},
           "y"     : function(d) { return yScale(grade2point[d.grade]) + 25; },
         });
  
  /* Calculate GPA */
  var result = document.getElementById("result");
  var points = 0;
  var credits = 0;
  
  for (var i = 0; i < input_data.length; ++i) {
    points += grade2point[input_data[i].grade] * input_data[i].credit;
    credits += input_data[i].credit;
  }
  
  var gpa = Math.round(points / credits * 100) / 100;
  result.innerHTML = "預測學期GPA = " + gpa;
  
  return;
}
