const header = document.querySelector('.header')
const footer = document.querySelector('.footer')
const filledRetros = document.querySelector('.filled-retros')

filledRetros.style.marginTop = header.offsetHeight + 10 + 'px'
filledRetros.style.marginBottom = footer.offsetHeight + 10 + 'px'

window.addEventListener('resize', () => {
    filledRetros.style.marginTop = header.offsetHeight + 10 + 'px'
    filledRetros.style.marginBottom = footer.offsetHeight + 10 + 'px'
})

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

const loadRetros = async () => {
    retros = await makeRequest('GET', '/get_retros')
}

const loadRetroProps = async (retroID) => {
    return await makeRequest('GET', `/get_retro_props/${retroID}`)
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const completedTasks = ['Task Name', 'Self Rating', 'Team Members', 'Hours Taken', 'Completion Date', 'Feedback']
const defaultedTasks = ['Task Name', 'Self Rating', 'Team Members', 'Hours Given', 'Reason']
const myOverallPerformance = ['Overall Performance', 'Improved Skills', 'Hindrances', 'Opportunities', 'Uncertainties']
const colleagues = ['Colleague Name', 'Dependable', 'Collaborative', 'Trustworthy', 'Punctual', 'Pragmatic', 'Courteous', 'Overall Rating', 'Suggestions']
const workplace = ['Area/Issues', 'Suggestions']
let retros = []

loadRetros().then(() => {
    filledRetros.innerHTML = ''
    const retrosHeaderEl = document.createElement('h1')
    retrosHeaderEl.textContent = `Filled Retrospectives (${retros.length})`
    filledRetros.appendChild(retrosHeaderEl)
    if (retros.length == 0) {
        const retroSummaryEl = document.createElement('p')
        retroSummaryEl.textContent = 'You have not filled any retrospectives yet.'
        filledRetros.appendChild(retroSummaryEl)
    }
    else {
        retros.forEach((retro) => {
            loadRetroProps(retro.retro_id).then((retroProps) => {
                const monthYear = new Date(retro.month_year)

                const accordionEl = document.createElement('button')
                accordionEl.classList.add('accordion')
                accordionEl.textContent = `${months[monthYear.getMonth()]}, ${monthYear.getFullYear()}`
                filledRetros.appendChild(accordionEl)
                
                const panel = document.createElement('div')
                panel.classList.add('panel')
                
                const p1 = document.createElement('p')
                p1.textContent = 'My Overall Performance'
                p1.setAttribute('class', 'tableTitle')
                panel.appendChild(p1)
                panel.appendChild(createTableDOM(myOverallPerformance, retroProps.myPerformance))

                const p2 = document.createElement('p')
                p2.textContent = (retroProps.tasks.length === 0) ? 'No completed tasks this month' : `Tasks i have completed (${retroProps.tasks.length})`
                p2.setAttribute('class', 'tableTitle')
                panel.appendChild(p2)
                if (retroProps.tasks.length > 0)
                panel.appendChild(createTableDOM(completedTasks, retroProps.tasks))

                const p3 = document.createElement('p')
                p3.textContent = (retroProps.dTasks.length === 0) ? 'No defaulted tasks this month' : `Tasks i have defaulted (${retroProps.dTasks.length})`
                p3.setAttribute('class', 'tableTitle')
                panel.appendChild(p3)
                if (retroProps.dTasks.length > 0)
                panel.appendChild(createTableDOM(defaultedTasks, retroProps.dTasks))

                const p4 = document.createElement('p')
                p4.textContent = (retroProps.colleaguesFeedback.length === 0) ? 'No colleagues feedback this month' : `Colleagues Feedback (${retroProps.colleaguesFeedback.length})`
                p4.setAttribute('class', 'tableTitle')
                panel.appendChild(p4)
                if (retroProps.colleaguesFeedback.length > 0)
                panel.appendChild(createTableDOM(colleagues, retroProps.colleaguesFeedback))

                const p5 = document.createElement('p')
                p5.textContent = (retroProps.workplaceFeedback.length === 0) ? 'No workplace feedback this month' : `Workplace Feedback (${retroProps.workplaceFeedback.length})`
                p5.setAttribute('class', 'tableTitle')
                panel.appendChild(p5)
                if (retroProps.workplaceFeedback.length > 0)
                panel.appendChild(createTableDOM(workplace, retroProps.workplaceFeedback))

                filledRetros.appendChild(panel)
                accordionEl.addEventListener('click', function () {
                    this.classList.toggle("active");
                    const panel = this.nextElementSibling
                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px"
                    } 
                })
            })
        })
    }
})

const createTableDOM = (tableHeader, tableData) => {
    const tableEl = document.createElement('table')
    tableEl.setAttribute('id', 'table')

    const rowHeaderEl = document.createElement('tr')
    tableHeader.forEach(colHeader => {
        const colHeaderEl = document.createElement('th')
        colHeaderEl.textContent = colHeader
        rowHeaderEl.appendChild(colHeaderEl)
    })
    tableEl.appendChild(rowHeaderEl)

    tableData.forEach((dataRow) => {
        const rowDataEl = document.createElement('tr')
        for (const dataItem in dataRow) {
            if (dataItem === 'retro_id')
            continue

            const colDataEl = document.createElement('td')
            colDataEl.textContent = dataRow[dataItem]
            rowDataEl.appendChild(colDataEl) 
        }
        tableEl.appendChild(rowDataEl)
    })

    return tableEl
}