
//Výběr módu
mecanumRobot.setServo(90)
basic.showString("mode?")

input.onButtonPressed(Button.A, function () {
    samojezditko()
})
input.onButtonPressed(Button.B, function () {
    nasledovani()
})
input.onButtonPressed(Button.AB, function () {
    linka()
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    ovladac()
})
//Funkce směru jízdy
function dopredu() {
    mecanumRobot.Motor(LR.Upper_left, MD.Back, 45)
    mecanumRobot.Motor(LR.Upper_right, MD.Forward, 55)
    mecanumRobot.Motor(LR.Lower_left, MD.Forward, 45)
    mecanumRobot.Motor(LR.Lower_right, MD.Back, 55)
}
function doleva() {
    mecanumRobot.Motor(LR.Upper_left, MD.Forward, 45)
    mecanumRobot.Motor(LR.Upper_right, MD.Forward, 55)
    mecanumRobot.Motor(LR.Lower_left, MD.Back, 45)
    mecanumRobot.Motor(LR.Lower_right, MD.Back, 55)
}
function doprava() {
    mecanumRobot.Motor(LR.Upper_left, MD.Back, 45)
    mecanumRobot.Motor(LR.Upper_right, MD.Back, 55)
    mecanumRobot.Motor(LR.Lower_left, MD.Forward, 45)
    mecanumRobot.Motor(LR.Lower_right, MD.Forward, 55)
}
function dozadu() {
    mecanumRobot.Motor(LR.Upper_left, MD.Forward, 45)
    mecanumRobot.Motor(LR.Upper_right, MD.Back, 55)
    mecanumRobot.Motor(LR.Lower_left, MD.Back, 45)
    mecanumRobot.Motor(LR.Lower_right, MD.Forward, 55)
}
//funkce samotného ježdění
function samojezditko() {
    let vzdalenost = 0
    let vzdalenostl = 0
    let vzdalenostp = 0

    basic.showString("mode1")
    basic.pause(1000)

    basic.forever(function () {
        vzdalenost = mecanumRobot.ultra()
        if (vzdalenost < 30) {
            mecanumRobot.state(MotorState.stop)
            basic.pause(1000)
            mecanumRobot.setServo(0)
            basic.pause(1000)
            vzdalenostp = mecanumRobot.ultra()
            mecanumRobot.setServo(180)
            basic.pause(1000)
            vzdalenostl = mecanumRobot.ultra()
            if (vzdalenostl < vzdalenostp) {
                doprava()
                mecanumRobot.setServo(90)
                basic.pause(400)
            }
            else {
                doleva()
                mecanumRobot.setServo(90)
                basic.pause(400)
            }

        }
        else {
            dopredu()
        }
    })

}
//funkce nasledování objektu
function nasledovani() {
    basic.showString("mode2")
    basic.pause(1000)

    basic.forever(function () {
        let vzdalenost = 0

        vzdalenost = mecanumRobot.ultra()
        if (vzdalenost < 20) {
            dozadu()
        }
        if (vzdalenost < 30) {
            mecanumRobot.state(MotorState.stop)
        }
        if (vzdalenost < 50) {
            dopredu()
        }
        else {
            mecanumRobot.state(MotorState.stop)
        }

    })

}
//funkce ježdění podle čáry
function linka() {
    basic.showString("mode3")
    basic.pause(1000)

    basic.forever(function () {
        let linetrack = 0
        if (mecanumRobot.LineTracking(LT.Left) == 0 && mecanumRobot.LineTracking(LT.Right) == 1) {
            doprava()
        }
        else if (mecanumRobot.LineTracking(LT.Left) == 1 && mecanumRobot.LineTracking(LT.Right) == 0) {
            doleva()
        }
        else if (mecanumRobot.LineTracking(LT.Left) == 1 && mecanumRobot.LineTracking(LT.Right) == 1) {
            dopredu()
        }
        else {
            mecanumRobot.state(MotorState.stop)
        }
    })
}
//funkce spojení vozidla s mobilovou aplikací a následné řízení 
function ovladac() {
    let buttons = ""
    let pripojeni: boolean = false

    basic.showString("mode4")
    basic.pause(1000)
    bluetooth.startUartService()

    bluetooth.onBluetoothConnected(function () {
        basic.showString("c")
        pripojeni = true
        while (pripojeni = true) {
            bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
            serial.writeString(buttons)
            serial.writeLine("")
            if (buttons == "a") {
                dopredu ()
            }
            if (buttons == "b") {
                doleva ()
            }
            if (buttons == "c") {
                dozadu()
            }
            if (buttons == "d") {
                doprava()
            }
        }
    })

    bluetooth.onBluetoothDisconnected(function () {
        basic.showString("d")
        pripojeni = false
    })

}