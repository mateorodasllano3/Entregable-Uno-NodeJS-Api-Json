const express = require('express')
const path = require('path')
const fs = require('fs/promises')

const app = express()

app.use(express.json())

const jsonPath = path.resolve('./Files/ToDoList.json')

app.get('/tasks', async(req,res) =>{
    const jsonFile = await fs.readFile(jsonPath, 'utf-8')
    res.send(jsonFile)
})

app.post('/tasks', async(req, res) => {
    const task = req.body
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'))
    const lastIndex = tasksArray.length -1
    const newIndex = tasksArray[lastIndex].id + 1
    tasksArray.push({...task, id: newIndex})
    await fs.writeFile(jsonPath,JSON.stringify(tasksArray))
    console.log(tasksArray)
    res.end()
})


app.put('/tasks', async(req, res) => {
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'))
    const {id, status} = req.body
    const taskIndex = tasksArray.findIndex(task => task.id === id)
    if(taskIndex >= 0){
        tasksArray[taskIndex].status = status
    }
    await fs.writeFile(jsonPath,JSON.stringify(tasksArray))
    res.end()
})

app.delete('/tasks' , async(req, res)=>{
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'))
    const { id } = req.body
    const taskIndex = tasksArray.findIndex(task => task.id === id)
    tasksArray.splice( taskIndex, 1)
    await fs.writeFile(jsonPath,JSON.stringify(tasksArray))
    res.end()
})






const PORT = 8000;

app.listen( PORT, () =>{
    console.log('Servidor Escuchando en el puerto ')
})