const togglePassword = () => {
    const pass = document.getElementById("show")
  
    if (pass.type === "password") {
        pass.type = "text"
    } else {
        pass.type = "password"
    }
}

const result = '<%-result%>'
const message = '<%-message%>'
if (result && message) {
    setTimeout(function(){
        document.getElementById('waa').className = 'dis'
    }, 3000)
}