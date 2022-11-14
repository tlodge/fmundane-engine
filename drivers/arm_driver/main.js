const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const { setTimeout } = require('timers');
const request = require('superagent');
const PORT = '9107';
const {arm:ARMIP} = require('../../server/src/actions/IPs.json');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Arm connected to mac: dev/tty.usbserial-A10KME4J
// Arm connected to lenovo: '/dev/ttyUSB0'
// Pseudo test port: /dev/ptyp3
//on mac -  /dev/cu.SOC

const devices ={
    LENOVO : '/dev/ttyUSB0',
    MAC: '/dev/tty.usbserial-A10KME4J',
    DRAWER: `/dev/tty.usbserial-11130`
}

const port = new SerialPort(devices.LENOVO, {
    baudRate: 115200
},  (err)=>{
    if (err) {
        return console.log('Error: ', err.message)
    }
})

let HANDLING = false;

const waitFor = (duration)=>{
  
    return new Promise((resolve)=>{
        setTimeout(()=>{
            
            resolve();
        }, duration);
    })
}

const actuate = (servoId, amount, duration)=>{
    const command = `#${servoId} D${amount}T${duration}\r`;

    return new Promise((resolve, reject)=>{
        port.write(command, function(err, result) {
           
            if (err) {
                console.log(err);
              reject(err);
              return;
            }
           else{
            setTimeout(resolve,duration);
           }
        });
    })
}

const rawcommand = (command, duration=1000)=>{

    return new Promise((resolve, reject)=>{
        port.write(`${command}\r`, function(err, result) {
            
            if (err) {
                console.log(err);
              reject(err);
              return;
            }
           else{
            if (duration <= 0){
                resolve();
            }else{
                setTimeout(resolve,duration);
            }
           }
        });
    })

}

const beforeMiddleware = (req, res, next)=>{
    if (!HANDLING){
        HANDLING = true;
        next();
    }else{
        console.log("would ignore as handling");
        next();
    }
}

const afterMiddleware = (req, res, next)=>{
    HANDLING = false;
}


app.get('/api/arm/collapse', beforeMiddleware, async function (req, res, next) {
    
    try{
       await collapse();
    }catch(err){
       //TODO get error in response JSON - check arduino code
    }
    res.status(200).send("OK");
    next();
},afterMiddleware);

app.get('/api/arm/scan', beforeMiddleware, async function (req, res, next) {
    console.log("scan");
    await scan();
    res.status(200).send("OK");
    next();
},afterMiddleware);

app.get('/api/arm/lights', async function (req, res, next) {
    const {colour} = req.query;
    console.log("lights", colour);
    await lights(colour);
    res.status(200).send("OK");
});

app.get('/api/arm/flash',  async function (req, res, next) {
    console.log(req.query);
    const {colours=[0,1], speed=1000, repetitions=2} = req.query;
    console.log("flashlights", colours, speed, repetitions);
    res.status(200).send("OK");
    await flashlights(colours, Number(speed), Number(repetitions));
   
});

app.get('/api/arm/yes', beforeMiddleware,  async function (req, res, next) {
    console.log("yes");
    await yes();
    res.status(200).send("OK");
    next();
},afterMiddleware);

app.get('/api/arm/no', beforeMiddleware,  async function (req, res, next) {
    console.log("no");
    await no();
    res.status(200).send("OK");
    next();
},afterMiddleware);


app.get('/api/arm/expand', beforeMiddleware, async function (req, res, next) {
    console.log("seen arm expand")
    try{
       await expand();
    }catch(err){
     //TODO get error in response JSON - check arduino code
    }
    res.status(200).send("OK");
    next();
},afterMiddleware);


app.get('/api/arm/home', beforeMiddleware, async function (req, res, next) {
    console.log("seen arm home")
    try{
       await home();
    }catch(err){
     //TODO get error in response JSON - check arduino code
    }
    res.status(200).send("OK");
    next();
},afterMiddleware);


app.get('/api/arm/point', beforeMiddleware, async function (req, res, next) {
    
    const {subject} = req.query;
    console.log("seen arm point ", subject);

    try{
        switch (subject){
            case "dyson":
                await dyson();
                break;
            case "windows":
                await windows();
                break;
            case "door":
                await door();
                break;
            case "screen":
                await screen();
                break;
            case "down":
                await lookdown();
                break;
            case "forward":
                await forward();
                break;
            case "mad":
                await mad();
                break;

            default:
                await home();
                break;
        }
    }catch(err){
     //TODO get error in response JSON - check arduino code
    }
    System.out.println("sending an ok!");
    res.status(200).send("OK");
    next();
},afterMiddleware);


app.get('/api/arm/status', async function (req, res, next) {
    const _status = await status();
    res.status(200).send(_status);
});

app.get('/api/arm/test', beforeMiddleware, async function (req, res, next) {
    await openandclose();
    res.status(200).send("OK");
    next();
}, afterMiddleware);

app.get('/api/arm/toggledoor', beforeMiddleware, async function (req, res, next) {
   await toggleDoor();
    res.status(200).send("OK");
    next();
}, afterMiddleware);

const yes = async ()=>{
    let {draweropen} = await status();
    if (draweropen){
        await actuate(4, 900,300);
        await actuate(4, 100,500);
        await actuate(4, 900,500); 
        await actuate(4, 350,300);
    }
}

const no = async ()=>{
    let {draweropen} = await status();
    if (draweropen){
        await actuate(5, -900,1000);
        await actuate(5, 600, 1000);
        await actuate(5, -900,1000);
        await actuate(5, -100, 1000);
    }
}

const scan = async ()=>{
    let {draweropen} = await status();
    if (draweropen){
        await actuate(5, -900,4000);
        await actuate(5, 600, 4000);
        await actuate(5, -100, 4000);
    }
}

const toggleDoor = async()=>{
    const {dooropen, drawershut} = await status();
    if (drawershut){
        if (dooropen){
            await closeDoor();
        }else{
            await openDoor();
        }
    }
}

const dyson = async ()=>{
    let {draweropen} = await status();
    
    if (draweropen){

        let parallel = [
            {servo:1, degrees:-600, duration:800},
            {servo:2, degrees:450, duration:800},
            {servo:4, degrees:-100, duration:500}
        ]

        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));

        /*await waitFor(2000);

        parallel = [
            {servo:4, degrees:550, duration:500},
            {servo:2, degrees:0, duration:800},
            {servo:1, degrees:0, duration:800}
        ]

        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));*/
    }
}

const expandarm = async()=>{
    let {draweropen} = await status();

    if (draweropen){
        /*
        * perform following once drawer is opened!
        */

        let parallel = [
            {servo:2, degrees:-450, duration:600},
            {servo:3, degrees:450, duration:600},
        ]

        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));

        await actuate (2, 0, 600);

        parallel = [
            {servo:4, degrees:350, duration:600},
            {servo:5, degrees:-100, duration:600},
            {servo:3, degrees:-450, duration:600}
        ]

        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));
    }

}

const collapsearm  = async()=>{
    let {draweropen} = await status();
    if (draweropen){

        let parallel = [
            {servo:5, degrees:600, duration:1000},
            {servo:4, degrees:0, duration:1000},
            {servo:3, degrees:450, duration:1000},
            {servo:2, degrees:-400, duration:1000}
        ]

        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));
    
        parallel = [
            {servo:3, degrees:1100, duration:1000},
            {servo:2, degrees:-940, duration:1000},
        ]

        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        })); 
        
        parallel = [
            {servo:3, degrees:1300, duration:1000},
            {servo:5, degrees:800, duration:1000},
        ]
        
        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));
    }
    /*
    * Once drawer has closed, do the final camera move
    */ 
}

const drawerabouttoopen = async()=>{
    let {draweropen} = await status();
    if (!draweropen){
        await actuate(4, -100, 1000);
    }
}

const drawerClosed = async()=>{
    let {draweropen} = await status();
    //flip camera backwards
    if (!draweropen){
        await actuate (4, -1000, 1000);
    }
}

const openDrawer = ()=>{
    return new Promise(async (resolve, reject)=>{
        request.get(`${ARMIP}/drawer/open`).then((res,err)=>{
            console.log(res.body);
            resolve(res.body);
        });
    });
}

const closeDrawer = ()=>{
    return new Promise(async (resolve, reject)=>{
        request.get(`${ARMIP}/drawer/close`).then((res,err)=>{
            console.log(res.body);
            resolve(res.body);
        });
    });
}

const openDoor = (attempts = 0)=>{
  console.log("calling open door!");
    return new Promise(async (resolve, reject)=>{
        if (attempts >= 3){
            resolve();
        }
        else{
            request.get(`${ARMIP}/door/open`).then(async (res,err)=>{
                console.log(res.body);
                let {dooropen} = await status();
                
                if (dooropen){
                    resolve(res.body);
                    return;
                }else{
                    openDoor(++attempts);
                }
            });
        }
    });
}

const closeDoor = (attempts=0)=>{
    return new Promise(async (resolve, reject)=>{
        if (attempts >= 3){
            resolve();
        }
        else{
            request.get(`${ARMIP}/door/close`).then(async (res,err)=>{
                console.log(res.body);
                setTimeout(async ()=>{
                    let {dooropen} = await status();
                
                    if (!dooropen){
                        resolve(res.body);
                        return;
                    }else{
                        closeDoor(++attempts);
                    }
                },8000);
            });
        }
    });
}

const status = ()=>{
    return new Promise(async (resolve, reject)=>{
        request.get(`${ARMIP}/status`).then((res,err)=>{
            console.log(res.body);
            resolve(res.body);
        });
    });
}

const collapse = async ()=>{
    let {draweropen, dooropen} = await status();
    if (draweropen && dooropen){
        await collapsearm();
        await closeDrawer();
        await drawerClosed();
        await closeDoor();
    }
}

const expand = async ()=>{
    await openDoor();
    await drawerabouttoopen();
    await openDrawer();
    await expandarm();
    
}

const openandclose = async ()=>{
    await expand();
    await no();
    await yes();
    await collapse();
}

const forward = async()=>{
    let {draweropen} = await status();
    
    if (draweropen){

        const parallel = [
            {servo:2, degrees:600, duration:1000},
            {servo:4, degrees:-450, duration:1000},
        ]

        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));
    }
}

const home = async ()=>{
    let {draweropen} = await status();
    if (draweropen){ 

        const parallel = [
            {servo:4, degrees:350, duration:1000},
            {servo:2, degrees:0, duration:1000},
            {servo:5, degrees:-100, duration:1000},
            {servo:3, degrees:-450, duration:1000},
            {servo:1, degrees:0, duration:1000},
        ]
        
        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));
    }

}

const lookdown = async()=>{
    let {draweropen} = await status();
    if (draweropen){ 
        await actuate(4, 900,300); 
    }
}

const screen = async()=>{
    let {draweropen} = await status();
    if (draweropen){ 

        const parallel = [
            
            {servo:4, degrees:-600, duration:1000},
            {servo:2, degrees:200, duration:1000},
            {servo:5, degrees:-200, duration:1000},
            {servo:3, degrees:-650, duration:1000},
        ]
        
        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));
    }
}

const door = async()=>{
    let {draweropen} = await status();
    if (draweropen){ 

        const parallel = [
            {servo:1, degrees:-300, duration: 500},
            {servo:5, degrees:500, duration: 500}
        ]
        
        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));
    }
}

const windows = async()=>{
    let {draweropen} = await status();
    if (draweropen){ 

        const parallel = [
            {servo:4, degrees:100, duration:600},
            {servo:2, degrees:200, duration:600},
            {servo:5, degrees:-1200, duration:600},
            {servo:3, degrees:-650, duration:600},
        ]
        
        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));

        await actuate(5, 500, 500);
        //await actuate(5, -200, 1000);

    }
}

const mad = async()=>{
    let {draweropen} = await status();
    if (draweropen){ 

        let parallel = [
            {servo:3, degrees:500, duration:3000},
        ]
        
        await Promise.all(parallel.map(async(command)=>{
            await actuate(command.servo, command.degrees, command.duration);
        }));
        await no()

        await actuate(4, -450, 500)

        await actuate(1, -900, 1000)
        await actuate(1, 900, 2000)
        await actuate(1, -900, 2000)
        await actuate(1, 900, 2000)
        await actuate(1, 0, 1000)

        await actuate(4, 550, 500)

        await actuate(5, -900,3500);
        await actuate(5, 600, 3500);
        await actuate(5, -900,3500);
        await actuate(5, -100, 2500);
    }
}

const flashlights = async(colours=[1,2], speed, repetitions)=>{
       

        const arr = new Array(repetitions).map((v,i)=>i);
        

        const flashit = async (colours)=>{
            for (const colour of colours){
                await lights(colour);
                await waitFor(speed);
            }   
        }

        for (const index of arr){    
            await flashit(colours);
        }
}

const lights = async(colour)=>{
    const arr = new Array(5).fill(0);
    const parallel = arr.map((v,i)=>`#${i+1} LED${colour}`);
    await Promise.all(parallel.map(async(command)=>{
        await rawcommand(command,0);
    }));
}

if (process.argv.length >= 3){
   
   const [_,__,command] = process.argv;
   
   if (command == "lights"){
        console.log("seen command lights!");
        flashlights([0,1], 50, 50);
   }
   if (command == "status"){
        status();
   }
   if (command == "expand"){
        expand();
   }
   if (command == "collapse"){
        collapse();
   }
   if (command == "forward"){
        forward();
   }
   if (command == "expandarm"){
        expandarm();
   }
   if (command == "collapsearm"){
        collapsearm();
   }
   if (command == "toggle"){
        toggleDoor();
   }
   if (command == "opendrawer"){
        openDrawer();
   }
   if (command == "closedrawer"){
        closeDrawer();
    }
   if (command == "test"){
        openandclose();
   }
   if (command == "dyson"){
        dyson();
   }
   if (command == "screen"){
        screen();
   }
   if (command == "windows"){
        windows();
   }

   if (command == "door"){
         door();
    }
   if (command == "lookdown"){
        lookdown();
   }
   if (command == "home"){
        home();
   }
   if (command == "mad"){
        mad();
   }
}

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);
