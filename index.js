const express = require('express')
const mysql = require('mysql')
const session = require('express-session')
const path = require('path')

const connection = mysql.createPool({
	host     : 'localhost',
	user     : 'padfoot',
	password : '03051998@Sanu',
	database : 'ewx_retrospective'
});

const app = express();

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
})

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}))

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/views'));

app.get("/", function (req, res) {
    const user = req.session.user

    if (user)
    res.redirect('/user_home')
    else
    res.render('login', {result: '', message: ''})
})

app.post('/retro_submit', function (req, res) {
    const empID = req.body.emp_id
    const monthYear = req.body.month_year

    connection.query('SELECT * from retrospectives WHERE emp_id = ? AND month_year = ?', [empID, monthYear], function (err, result) {
        if (err) 
        console.log(err)

        else if (result.length > 0)
        res.render('result', {result: 'Failure', message: `You have already filled the retrospective for the selected month(${monthYear}).`})

        else {
            connection.query('INSERT INTO retrospectives(emp_id, month_year) VALUES (?, ?)', [empID, monthYear], function (err, result) {
                if (err) 
                console.log(err)

                else {
                    const retroID = result.insertId
                    if (req.body.taskname) {
                        const taskName = req.body.taskname
                        const rating = req.body.rating
                        const members = req.body.members
                        const completionDate  = req.body.completiondate
                        const hours = req.body.hours
                        const feedback = req.body.feedback

                        const tasks = []
                        for (let i=0;i<taskName.length;i++) {
                            tasks.push([retroID, taskName[i], rating[i], members[i].toString(), hours[i], completionDate[i], feedback[i]])
                        }

                        connection.query('INSERT INTO accomplished_tasks VALUES ?', [tasks], function (err, result) {
                            if (err)
                            console.log(err)
                        })
                    }

                    if (req.body.dtaskname) {
                        const taskName = req.body.dtaskname
                        const rating = req.body.drating
                        const members = req.body.dmembers
                        const hours = req.body.dhours
                        const reason = req.body.reason   

                        const dTasks = []
                        for (let i=0;i<taskName.length;i++) {
                            dTasks.push([retroID, taskName[i], rating[i], members[i].toString(), hours[i], reason[i]])
                        }

                        connection.query('INSERT INTO defaulted_tasks VALUES ?', [dTasks], function (err, result) {
                            if (err)
                            console.log(err)
                        })
                    }

                    const myPerformance = [retroID, req.body.myperformance, req.body.improvedskills, req.body.hindrances, req.body.opportunities, req.body.uncertainties]
                    connection.query('INSERT INTO my_overall_performance VALUES (?)', [myPerformance], function (err, result) {
                        if (err)
                        console.log(err)
                    })

                    if (req.body.colleaguename) {
                        const colleagueName = req.body.colleaguename
                        const dependable = req.body.dependable
                        const collaborative = req.body.collaborative
                        const trustworthy = req.body.trustworthy
                        const punctual = req.body.punctual
                        const pragmatic = req.body.pragmatic
                        const courteous = req.body.courteous
                        const suggestions = req.body.csuggestion

                        const colleagues = []
                        for (let i=0;i<colleagueName.length;i++) {
                            colleagues.push([retroID, colleagueName[i], dependable[i], collaborative[i], trustworthy[i], punctual[i], pragmatic[i], courteous[i], suggestions[i]])
                        }
                        const query = 'INSERT INTO colleagues_feedback(retro_id, colleague_name, dependable, collaborative, trustworthy, punctual, pragmatic, courteous, suggestions) VALUES ?'

                        connection.query(query, [colleagues], function (err, result) {
                            if (err)
                            console.log(err)
                        })
                    }

                    if (req.body.issuename) {
                        const issueName = req.body.issuename
                        const suggestions = req.body.isuggestion

                        const issues = []
                        for (let i=0;i<issueName.length;i++) {
                            issues.push([retroID, issueName[i], suggestions[i]])
                        }

                        connection.query('INSERT INTO workplace_feedback VALUES ?', [issues], function (err, result) {
                            if (err)
                            console.log(err)
                        })
                    }

                    res.render('result', {result: 'Success', message: `You have successfully filled the retrospective for the month(${monthYear}).`})
                }
            })
        }
    })
})

app.post('/login', function (req, res) {
    const empID = req.body.emp_id
    const password = req.body.password

    connection.query('SELECT * from employees WHERE emp_id = ?', empID, function (err, result) {
        if (err)
        console.log(err)

        else if (result.length == 0)
        res.render('login', {result: 'Failure!', message: 'No account exist with this Employee-ID.'})

        else {
            connection.query('SELECT name, emp_id, user_type, joining_date, end_date, DATE_FORMAT(joining_date, "%d-%m-%Y") AS join_date, DATE_FORMAT(end_date, "%d-%m-%Y") AS left_date from employees WHERE emp_id = ? AND password = ?', [empID, password], function (err, result) {
                if (err)
                console.log(err)

                else if (result.length > 0) {
                    req.session.user = result[0]
                    res.redirect('/user_home')
                }

                else
                res.render('login', {result: 'Wrong!', message: 'Incorrect password.'})
            })
        }
    })
})

app.get('/user_home', function (req, res) {
    const user = req.session.user
    if (user) {
        res.render('userHome', {employee: user})
    }
    else
    res.status(403).send('You are not loggen in')
})

app.get('/retro_form', function (req, res) {
    const user = req.session.user 

    if (user) {
        res.sendFile(path.join(__dirname, '/form.html'))
    }
    else
    res.status(403).send('You are not loggen in')
})

app.get('/get_user', function (req, res) {
    const user = req.session.user 

    if (user) {
        res.json({
            emp_id: user.emp_id,
            name: user.name,
            join_date: user.joining_date,
            left_date: user.end_date
        })
    }
    else
    res.status(403).send('You are not allowed to access this')
})

app.get('/get_team', function (req, res) {
    const user = req.session.user 

    if (user) {
        connection.query('SELECT name from employees', function (err, result) {
            if (err)
            console.log(err)
            else {
                const team = []
                result.forEach(member => team.push(member.name));
                res.json(team)
            }
        })
    }
    else
    res.status(403).send('You are not allowed to access this')
})

app.get('/get_retros', function (req, res) {
    const user = req.session.user 

    if (user) {
        connection.query('SELECT retro_id, month_year FROM retrospectives WHERE emp_id = ?', [user.emp_id], function(err, result) {
            if (err)
            console.log(err)
            
            else {
                res.json(result)
            }
        })
    }
    else
    res.status(403).send('You are not allowed to access this')
})

app.get('/get_retro_props/:retroID', function (req, res) {
    const user = req.session.user
    const retroID = req.params.retroID
    if (user) {
        const retroProps = {}

        connection.query('SELECT * FROM my_overall_performance WHERE retro_id = ?', [retroID], function (err, result) {
            if (err)
            console.log(err)
            else
            retroProps.myPerformance = JSON.parse(JSON.stringify(result))
            
            connection.query('SELECT retro_id, task_name, self_rating, team, hours_taken, DATE_FORMAT(completion_date, "%d-%m-%Y") AS cmplt_date, feedback FROM accomplished_tasks WHERE retro_id = ?', [retroID], function (err, result) {
                if (err)
                console.log(err)
                else
                retroProps.tasks = JSON.parse(JSON.stringify(result))

                connection.query('SELECT * FROM defaulted_tasks WHERE retro_id = ?', [retroID], function (err, result) {
                    if (err)
                    console.log(err)
                    else
                    retroProps.dTasks = JSON.parse(JSON.stringify(result))

                    connection.query('SELECT * FROM colleagues_feedback WHERE retro_id = ?', [retroID], function (err, result) {
                        if (err)
                        console.log(err)
                        else
                        retroProps.colleaguesFeedback = JSON.parse(JSON.stringify(result))

                        connection.query('SELECT * FROM workplace_feedback WHERE retro_id = ?', [retroID], function (err, result) {
                            if (err)
                            console.log(err)
                            else
                            retroProps.workplaceFeedback = JSON.parse(JSON.stringify(result))

                            res.send(retroProps)
                        })
                    })
                })
            })
        })
    }
    else
    res.status(403).send('You are not allowed to access this')
})

app.get('/logout', function (req, res) {
    if (req.session.user) {
        req.session.destroy(function () {
            res.redirect('/')
        })
    }
    else
    res.status(403).send('Login first to logout')
})
const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log(`Server is running on port ${port}...`)
})

