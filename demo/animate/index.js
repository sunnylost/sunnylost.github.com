const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const data = [4, 8, 2, 3, 10]
const colors = ['orange', 'green', 'blue', 'yellow', 'teal']
let total = 0
for (let i = 0; i < data.length; i++) {
    total += data[i]
}
let prevAngle = 0

for (let i = 0; i < data.length; i++) {
    //fraction that this pie slice represents
    const fraction = data[i] / total
    //calc starting angle
    const angle = prevAngle + fraction * Math.PI * 2

    //draw the pie slice
    ctx.fillStyle = colors[i]

    //create a path
    ctx.beginPath()
    ctx.moveTo(250, 250)
    ctx.arc(250, 250, 100, prevAngle, angle, false)
    ctx.lineTo(250, 250)

    //fill it
    ctx.fill()

    //stroke it
    ctx.strokeStyle = 'black'
    ctx.stroke()

    //update for next time through the loop
    prevAngle = angle
}
