var express = require("express")
var app = express()
var cors = require("cors")
const MongoClient = require('mongodb').MongoClient;
let projectCollection;
let http = require('http').createServer(app);

let io = require('socket.io')(http);

// Database Connection
const uri = "mongodb+srv://muqeet:muqeet123@cluster1.3ic2y.mongodb.net/sit725_2022_t1?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true })


app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

const createColllection = (collectionName) => {
    client.connect((err, db) => {
        projectCollection = client.db().collection(collectionName);
        if (!err) {
            console.log('MongoDB Connected')
        }
        else {
            console.log("DB Error: ", err);
            process.exit(1);
        }
    })
}

const insertProjects = (project, callback) => {
    projectCollection.insert(project, callback);
}

const getProjects = (callback) => {
    projectCollection.find({}).toArray(callback);
}

const cardList = [
    {
        title: "Kitten 2",
        image: "images/kitten-2.jpg",
        link: "About Kitten 2",
        description: "Demo desciption about kitten 2"
    },
    {
        title: "Kitten 3",
        image: "images/kitten-3.jpg",
        link: "About Kitten 3",
        description: "Demo desciption about kitten 3"
    }
]
app.get('/api/projects', (req, res) => {
    getProjects((err, result) => {
        if (err) {
            res.json({ statusCode: 400, message: err })
        }
        else {
            res.json({ statusCode: 200, message: "Success", data: result })
        }
    })
})

app.post('/api/projects', (req, res) => {
    console.log("New Project added", req.body)
    var newProject = req.body;
    insertProjects(newProject, (err, result) => {
        if (err) {
            res.json({ statusCode: 400, message: err })
        }
        else {
            res.json({ statusCode: 200, message: "Project Successfully added", data: result })
        }
    })
})
const addNumbers = (number1, number2) => {
    var num1 = parseInt(number1)
    var num2 = parseInt(number2)
    var result = (num1 + num2) || null;
    return result;
}

app.get("/addTwoNumbers/:firstNumber/:secondNumber",(req,res) => {
    var n1 = req.params.firstNumber;
    var n2 = req.params.secondNumber;
    var result = addNumbers(n1,n2)
    if(result == null) {
        res.json({result: result, statusCode: 400}).status(400)
      }
      else { res.json({result: result, statusCode: 200}).status(200) } 
})

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    setInterval(()=>{
      socket.emit('number', new Date().toISOString());
    }, 1000);
  
  });

var port = process.env.port || 3000;

http.listen(port,()=>{
    console.log("App running at http://localhost:"+port)
  });
