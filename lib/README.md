# Put JavaScript libraries you use in this folder

Our project uses the following libraries:

1. Plotly (not yet implemented):
Plotly is a front-end library for data science models. This free library provides online graphing, statistical analysis tools, and supports a variety of languages, including Python and R. 
We chose to use Plotly instead of more popular visualizations such as Matplotlib because Plotly has an easier map to use. 


We already include D3 for you. For each library create a folder including a `LICENSE` text file with the software license for the library.

Our project uses the following sources:
1. Line Chart Guide for D3: https://d3-graph-gallery.com/graph/line_basic.html 
We used this line chart guide as a stepping stone for our own line chart. The website gives a very basic understanding of how to create line charts in d3, which we used to set up our line chart. Set up includes the helper function d3.line(), interactivity (not yet implemented), and how to switch between data sources. This website will be useful in the upcoming weeks as well, when we implement switching data (from COVID Cases to Deaths) and interactivity (time-toggling).
2. How to do a d3.rollup: https://observablehq.com/@d3/d3-group 
This website allowed us to implement a roll-up; a simplification of a group through a summary statistic, such as sum or count. Using a rollup reduces the values in the key-value map. We used this source to reduce the number of values in our dataset, since our data set is very large. 
3. Time Formatting: https://d3-wiki.readthedocs.io/zh_CN/master/Time-Formatting/
We used this website as a clarification and a summary on the different ways of formatting a date/time in d3. This reference sheet was comprehensive in the different ways of formatting a date/time, how to parse it from a String, and how to convert the date/time back into a String. 
4. How to solve TypeError (d3.time is undefined): https://stackoverflow.com/questions/39369789/how-to-solve-typeerror-d3-time-is-undefined
During our data importing process, we ran into issues where the data being read in was not recognied as a data type. We attempted to debug this by printing to the console using typeof, which came back as "undefined". Since the data type was undefined, we were unable to parse the information and build it so that it was dynamic, which would cuase problems with the brushing. We used this source as a reference for how to fix the undefined data type error and modified the provided code to fit our data needs. 
5. Line-graph drop-down menu: https://d3-graph-gallery.com/graph/line_filter.html 
This website contained an example of a drop-down menu that was implemented with a line graph that changed depending on which option was selected. Since this feature is something that we hoped to implement, we looked through the code and familiarized ourselves with creating a drop-down menu. The website gives both the HTML portion of adding the drop-dpwn selection button as well as the JavaScript code to add the menu options and transition the data so that changing the options also changes the data being displayed. 
