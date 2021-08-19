const makeRequest = (reqType, reqPath) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open(reqType, reqPath)
    request.responseType = 'json'
    request.onload = () => {
        if (request.status == 200) {
            resolve(request.response)
        } else {
            reject(request.status)
        }
    } 
    request.send()
})

const loadUser = async () => {
    user = await makeRequest('GET', '/get_user')
}

const loadTeam = async () => {
    members = await makeRequest('GET', '/get_team')
}

const getDates = (date) => {
    let day = date.getDate()
    if (day < 10)
    day = '0' + day
    let month = date.getMonth() + 1
    if (month < 10)
    month = '0' + month
    const year = date.getFullYear()
    const daysInMonth = new Date(year, month, 0).getDate()

    return {
        day,month,year,daysInMonth
    }
}

const monthEl = document.querySelector('#month_year')

let user = {}
let members = []

let joined
let left

loadUser().then(() => {
    loadTeam()
    document.getElementById('uname').value = user.name
    document.getElementById('uid').value = user.emp_id

    joined = getDates(new Date(user.join_date))
    monthEl.setAttribute('min', `${joined.year}-${joined.month}`)

    if (user.left_date)
    left = getDates(new Date(user.left_date))

    if (left) 
    monthEl.setAttribute('max', `${left.year}-${left.month}`)
    else {
    const current = getDates(new Date())
    current.month = current.month-1
    if (current.month < 10)
    current.month = '0' + current.month
    monthEl.setAttribute('max', `${current.year}-${current.month}`)
}
})

const retroForm = document.getElementById('regForm')

retroForm.addEventListener('submit', (e) => {
    e.preventDefault()
    retroForm.submit()
    retroForm.reset()
})

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").style.display = "none";
  } else {
    document.getElementById("nextBtn").style.display = "inline";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].querySelectorAll('[required]');
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].className == 'selected-input')
    continue
    if (y[i].value == "" || (y[i].type == 'number' && y[i].value <= 0) || y[i].value == 'Select Self Rating...' || y[i].value == 'Select Overall Performance...' || y[i].value == 'Select Colleague...' || y[i].value == 'Dependable...' || y[i].value == 'Collaborative...' || y[i].value == 'Trustworthy...' || y[i].value == 'Punctual...' || y[i].value == 'Pragmatic...' || y[i].value == 'Courteous...') {
      // add an "invalid" class to the field:
      if (y[i].hasAttribute('data-multi-select-plugin'))
      y[i].parentNode.parentNode.classList.add('invalid')
      else
      y[i].classList.add('invalid');
      // and set the current valid status to false
      valid = false;
    } else {
        if (y[i].hasAttribute('data-multi-select-plugin'))
        y[i].parentNode.parentNode.classList.remove('invalid')
        else
        y[i].classList.remove('invalid');
    }

  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].classList.add('finish');
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].classList.remove("active");
  }
  //... and adds the "active" class on the current step:
  x[n].classList.add('active');
}

let completedTasksCount = 0
let defaultedTasksCount = 0

const completedTasks = document.querySelector('.completed-tasks')

const addTaskButton = document.querySelector('#addtask')

const fiveRating = [1, 2, 3, 4, 5]
const tenRating = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const createTextInputEl = (eName, phText) => {
    const textInputEl = document.createElement('input')
    textInputEl.setAttribute('name', eName)
    textInputEl.setAttribute('required', true)
    textInputEl.setAttribute('placeholder', phText)

    return textInputEl
}

const createSelectInputEl = (eName, ph, optionsEl, tooltip) => {
    const selectInputEl = document.createElement('select')
    selectInputEl.setAttribute('name', eName)
    selectInputEl.setAttribute('required', true)
    if (tooltip)
    selectInputEl.setAttribute('title', tooltip)

    const placeholderEl = document.createElement('option')
    placeholderEl.setAttribute('disabled', true)
    placeholderEl.setAttribute('selected', true)

    const phText = document.createTextNode(ph)
    placeholderEl.appendChild(phText)
    selectInputEl.appendChild(placeholderEl)

    optionsEl.forEach(option => {
        if (option == user.name)
        return

        const optionEl = document.createElement('option')
        optionEl.setAttribute('value', option)

        const optionText = document.createTextNode(option)
        optionEl.appendChild(optionText)

        selectInputEl.appendChild(optionEl)
    })

    return selectInputEl
}

const createMultiSelectInputEl = (eName) => {
    const membersEl = document.createElement('div')
    membersEl.classList.add('container')

    const selectEl = document.createElement('select')
    selectEl.setAttribute('name', eName)
    selectEl.setAttribute('multiple', true)
    selectEl.setAttribute('data-multi-select-plugin', '')
    selectEl.setAttribute('required', true)

    members.forEach(member => {
        const optionEl = document.createElement('option')
        optionEl.setAttribute('value', member)

        const optionText = document.createTextNode(member)
        optionEl.appendChild(optionText)

        selectEl.appendChild(optionEl)
    })
    membersEl.appendChild(selectEl)
    init(selectEl)

    return membersEl
}

const createNumberInputEl = (eName, ph) => {
    const hoursEl = document.createElement('input')
    hoursEl.setAttribute('placeholder', ph)
    hoursEl.setAttribute('name', eName)
    hoursEl.setAttribute('required', true)
    hoursEl.setAttribute('type', 'number')
    hoursEl.setAttribute('min', '1')
    hoursEl.setAttribute('onkeypress', 'return event.charCode >= 48')
    
    return hoursEl
}

const createTextareaEl = (eName, ph) => {
    const feedbackEl = document.createElement('textarea')
    feedbackEl.setAttribute('placeholder', ph)
    feedbackEl.setAttribute('required', true)
    feedbackEl.setAttribute('name', eName)

    return feedbackEl
}

addTaskButton.addEventListener('click', () => {
    const taskEl = document.createElement('div')

    const p1 = document.createElement('p')
    const taskNameEl = createTextInputEl('taskname[]', 'Task Name...')
    p1.appendChild(taskNameEl)
    taskEl.appendChild(p1)

    const p2 = document.createElement('p')
    const ratingEl = createSelectInputEl('rating[]', 'Select Self Rating...', tenRating, null)
    p2.appendChild(ratingEl)
    taskEl.appendChild(p2)

    const p3 = document.createElement('p')
    const membersEl = createMultiSelectInputEl(`members[${completedTasksCount}][]`)
    p3.appendChild(membersEl)
    taskEl.appendChild(p3)
    completedTasksCount++

    const dateTag = document.createElement('p')
    dateTag.textContent = 'Completion Date :'
    taskEl.appendChild(dateTag)

    const p4 = document.createElement('p')
    const completionDateEl = document.createElement('input')
    completionDateEl.setAttribute('name', 'completiondate[]')
    completionDateEl.setAttribute('type', 'date')
    completionDateEl.setAttribute('required', true)
    completionDateEl.setAttribute('onkeypress', 'return false')

    const selected = getDates(new Date(monthEl.value))
    if (selected.month == joined.month && selected.year == joined.year) {
        completionDateEl.setAttribute('min', `${selected.year}-${selected.month}-${joined.day}`)
        if (left && selected.month == left.month && selected.year == left.year) 
        completionDateEl.setAttribute('max', `${selected.year}-${selected.month}-${left.day}`)
        else
        completionDateEl.setAttribute('max', `${selected.year}-${selected.month}-${selected.daysInMonth}`)
    }
    else if (left && selected.month == left.month && selected.year == left.year) {
        completionDateEl.setAttribute('min', `${selected.year}-${selected.month}-01`)
        completionDateEl.setAttribute('max', `${selected.year}-${selected.month}-${left.day}`)
    } else {
        completionDateEl.setAttribute('min', `${selected.year}-${selected.month}-01`)
        completionDateEl.setAttribute('max', `${selected.year}-${selected.month}-${selected.daysInMonth}`)
    }

    p4.appendChild(completionDateEl)
    taskEl.appendChild(p4)


    const p5 = document.createElement('p')
    const hoursEl = createNumberInputEl('hours[]', 'Hours Taken...')
    p5.appendChild(hoursEl)
    taskEl.appendChild(p5)

    const p6 = document.createElement('p')
    const feedbackEl = createTextareaEl('feedback[]', 'Feedback...')
    p6.appendChild(feedbackEl)
    taskEl.appendChild(p6)

    const separatorEl = document.createElement('hr')
    taskEl.appendChild(separatorEl)

    completedTasks.appendChild(taskEl)
})

const removeTaskButton = document.querySelector('#removetask')

removeTaskButton.addEventListener('click', () => {
    if (completedTasks.hasChildNodes()) {
        completedTasks.removeChild(completedTasks.lastChild)
        completedTasksCount--
    }
})

monthEl.addEventListener('change', () => {
    const selected = getDates(new Date(monthEl.value))

    const dateElements = document.getElementsByName('completiondate[]')
    dateElements.forEach(element => {
        element.value = ""

        if (selected.month == joined.month && selected.year == joined.year) {
            element.setAttribute('min', `${selected.year}-${selected.month}-${joined.day}`)
            if (left && selected.month == left.month && selected.year == left.year) 
            element.setAttribute('max', `${selected.year}-${selected.month}-${left.day}`)
            else
            element.setAttribute('max', `${selected.year}-${selected.month}-${selected.daysInMonth}`)
        }
        else if (left && selected.month == left.month && selected.year == left.year) {
            element.setAttribute('min', `${selected.year}-${selected.month}-01`)
            element.setAttribute('max', `${selected.year}-${selected.month}-${left.day}`)
        } else {
            element.setAttribute('min', `${selected.year}-${selected.month}-01`)
            element.setAttribute('max', `${selected.year}-${selected.month}-${selected.daysInMonth}`)
        }
    })
})

const defaultedTasks = document.querySelector('.defaulted-tasks')

const addDTaskButton = document.querySelector('#addDtask')

addDTaskButton.addEventListener('click', () => {
    const taskEl = document.createElement('div')

    const p1 = document.createElement('p')
    const taskNameEl = createTextInputEl('dtaskname[]', 'Task Name...')
    p1.appendChild(taskNameEl)
    taskEl.appendChild(p1)

    const p2 = document.createElement('p')
    const ratingEl = createSelectInputEl('drating[]', 'Select Self Rating...', tenRating, null)
    p2.appendChild(ratingEl)
    taskEl.appendChild(p2)

    const p3 = document.createElement('p')
    const membersEl = createMultiSelectInputEl(`dmembers[${defaultedTasksCount}][]`)
    p3.appendChild(membersEl)
    taskEl.appendChild(p3)
    defaultedTasksCount++

    const p4 = document.createElement('p')
    const hoursEl = createNumberInputEl('dhours[]', 'Hours Given...')
    p4.appendChild(hoursEl)
    taskEl.appendChild(p4)

    const p5 = document.createElement('p')
    const reasonEl = createTextareaEl('reason[]', 'Reason...')
    p5.appendChild(reasonEl)
    taskEl.appendChild(p5)

    const separatorEl = document.createElement('hr')
    taskEl.appendChild(separatorEl)

    defaultedTasks.appendChild(taskEl)
})

const removeDTaskButton = document.querySelector('#removeDtask')

removeDTaskButton.addEventListener('click', () => {
    if (defaultedTasks.hasChildNodes()) {
        defaultedTasks.removeChild(defaultedTasks.lastChild)
        defaultedTasksCount--
    }
})

const colleagues = document.querySelector('.colleagues')

const addColleagueButton = document.querySelector('#addcolleague')

addColleagueButton.addEventListener('click', () => {
    const colleagueEl = document.createElement('div')

    const p1 = document.createElement('p')
    const colleagueNameEl = createSelectInputEl('colleaguename[]', 'Select Colleague...', members, null)
    p1.appendChild(colleagueNameEl)
    colleagueEl.appendChild(p1)

    const traitsTag1 = document.createElement('p')
    traitsTag1.textContent = 'Professional Traits'
    colleagueEl.appendChild(traitsTag1)

    const p2 = document.createElement('p')
    const dependableEl = createSelectInputEl('dependable[]', 'Dependable...', fiveRating, 'Can be depended on for a critical project & deadline')
    p2.appendChild(dependableEl)
    colleagueEl.appendChild(p2)

    const p3 = document.createElement('p')
    const collaborativeEl = createSelectInputEl('collaborative[]', 'Collaborative...', fiveRating, 'Works well within a team and assists colleagues')
    p3.appendChild(collaborativeEl)
    colleagueEl.appendChild(p3)

    const p4 = document.createElement('p')
    const trustworthyEl = createSelectInputEl('trustworthy[]', 'Trustworthy...', fiveRating, 'Can be privy to a closed discussion and/or a decision')
    p4.appendChild(trustworthyEl)
    colleagueEl.appendChild(p4)

    const traitsTag2 = document.createElement('p')
    traitsTag2.textContent = 'Behavioral Traits'
    colleagueEl.appendChild(traitsTag2)

    const p5 = document.createElement('p')
    const punctualEl = createSelectInputEl('punctual[]', 'Punctual...', fiveRating, 'Exercises timeliness and well disciplined')
    p5.appendChild(punctualEl)
    colleagueEl.appendChild(p5)

    const p6 = document.createElement('p')
    const pragmaticEl = createSelectInputEl('pragmatic[]', 'Pragmatic...', fiveRating, 'Deals with things sensibly and realistically, especially in a practical way')
    p6.appendChild(pragmaticEl)
    colleagueEl.appendChild(p6)

    const p7 = document.createElement('p')
    const courteousEl = createSelectInputEl('courteous[]', 'Courteous...', fiveRating, 'Respectful to others irrespective of social or professional stature')
    p7.appendChild(courteousEl)
    colleagueEl.appendChild(p7)

    const p8 = document.createElement('p')
    const suggestionsEl = createTextareaEl('csuggestion[]', 'Suggestions for Colleague...')
    p8.appendChild(suggestionsEl)
    colleagueEl.appendChild(p8)

    const separatorEl = document.createElement('hr')
    colleagueEl.appendChild(separatorEl)

    colleagues.appendChild(colleagueEl)
})

const removeColleagueButton = document.querySelector('#removecolleague')

removeColleagueButton.addEventListener('click', () => {
    if (colleagues.hasChildNodes())
    colleagues.removeChild(colleagues.lastChild)
})

const issues = document.querySelector('.issues')

const addIssueButton = document.querySelector('#addissue')

addIssueButton.addEventListener('click', () => {
    const issueEl = document.createElement('div')

    const p1 = document.createElement('p')
    const issueNameEl = createTextInputEl('issuename[]', 'Area/Issue...')
    p1.appendChild(issueNameEl)
    issueEl.appendChild(p1)

    const p2 = document.createElement('p')
    const suggestionsEl = createTextareaEl('isuggestion[]', 'Suggestions...')
    p2.appendChild(suggestionsEl)
    issueEl.appendChild(p2)

    const separatorEl = document.createElement('hr')
    issueEl.appendChild(separatorEl)

    issues.appendChild(issueEl)
})

const removeIssueButton = document.querySelector('#removeissue')

removeIssueButton.addEventListener('click', () => {
    if (issues.hasChildNodes())
    issues.removeChild(issues.lastChild)
})