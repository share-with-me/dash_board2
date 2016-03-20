This example makes use of node.js server with the use of npm to run the application.<br/>
Dashboard built using:<br/>
D3.js<br/>
Dc.js<br/>
Node.js<br/>
Crossfilter.js<br/>
Jquery<br/>
MongoDB<br/>

To run the application:<br/>
1. Download MongoDB. The link is <a href = "https://www.mongodb.org/downloads#production">this</a>.<br/>
2. Install MongoDB. The link for installation procedure is <a href = "https://docs.mongodb.org/manual/installation/">this</a>.  <br/>
3. Now navigate to the folder where you installed MongoDB and locate the bin folder. Start the mongoDB server by typing in ./mongo <br>
4. Keep the terminal running as is and open up a new terminal. Navigate again to the same directory (bin) and import the dataset in this directory by typing in <br>
   ./mongoimport -d donorschoose -c projects --type csv --headerline --file sampledata.csv <br>
5. Install Nodejs and NPM<br/>
6. Navigate to the dash_board2 directory using command prompt and run npm install, this will install the dependencies<br/>
7. Navigate to the dash_board2 directory using command prompt and run npm start<br/>
8. In your browser go to localhost:8080/index.html<br/>
