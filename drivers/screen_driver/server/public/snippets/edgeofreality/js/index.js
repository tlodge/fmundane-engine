setInterval(()=>{
    var el = document.querySelector(".carbon");
    el.innerHTML = Math.round(Math.random() * 500) + "g produced through recent activity";
},5000)

setInterval(()=>{
    var e1 = document.querySelector(".upload");
    e1.innerHTML = Math.round(Math.random() * 500) + " Mbits/second";

    var e2 = document.querySelector(".download");
    e2.innerHTML = Math.round(Math.random() * 1000) + " Mbits/second";
},1000)

