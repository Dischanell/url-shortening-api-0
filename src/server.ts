import express from 'express'

const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Test</h1>')
})

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`)
})