// MB5370 - Module 05: Global Scale Analysis
// Workshop 1 - Introduction to Google Earth Engine
// Practising JavaScript basics

print('Hello, World!');
// Practising variables
var population = 1000;
print(population);
var city = 'San Francisco';
print(city);
var population = 873965;
print(population);
// Practising arrays
var cities = ['Sydney', 'Melbourne', 'Brisbane'];
print(cities);
// Practising JavaScript objects
var cityData = {
  name: 'Sydney',
  population: 5300000,
  country: 'Australia'
};

print(cityData);
// Practising JavaScript functions
function greet(name) {
  return 'Hello, ' + name + '!';
}

print(greet('World'));
// Completed JavaScript basics - Section 2.6
// Exploring Earth Engine image functions
var pixelArea = ee.Image.pixelArea();
print(pixelArea);
// Practising Earth Engine computations
var a = ee.Number(5);
var b = ee.Number(10);
var result = a.add(b);

print('Result:', result);
// Exploring Earth Engine server-side objects
var number = ee.Number(25);

print('Earth Engine number:', number);
print('JavaScript number:', 25);
// JavaScript arithmetic example
var a = 1;
var b = 2;
print(a);
var result = a + b;
print(result, 'javascript way');
// Earth Engine server-side arithmetic
var eeResult = ee.Number(a).add(b);
print(eeResult, 'Earth Engine way');
// Creating a sequence of years
var yearList = ee.List.sequence(1980, 2020, 5);
print(yearList);