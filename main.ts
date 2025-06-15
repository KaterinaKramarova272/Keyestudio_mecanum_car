
//Výběr módu
mecanumRobot.setServo(90)
basic.showString("mode?")

input.onButtonPressed(Button.A, function () {
    independent_driving()
})
input.onButtonPressed(Button.B, function () {
    follow()
})
input.onButtonPressed(Button.AB, function () {
    line()
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    controller ()
})
//Funkce směru jízdy
let speed = 65
let speed_df = 20
let k = 1.27
function fwd() {
    mecanumRobot.Motor(LR.Upper_left, MD.Back, speed)
    mecanumRobot.Motor(LR.Upper_right, MD.Forward, speed * k)
    mecanumRobot.Motor(LR.Lower_left, MD.Forward, speed)
    mecanumRobot.Motor(LR.Lower_right, MD.Back, speed)
}
function lft() {
    mecanumRobot.Motor(LR.Upper_left, MD.Forward, speed)
    mecanumRobot.Motor(LR.Upper_right, MD.Forward, speed * k)
    mecanumRobot.Motor(LR.Lower_left, MD.Back, speed)
    mecanumRobot.Motor(LR.Lower_right, MD.Back, speed)
}
function rgt() {
    mecanumRobot.Motor(LR.Upper_left, MD.Back, speed)
    mecanumRobot.Motor(LR.Upper_right, MD.Back, speed * k)
    mecanumRobot.Motor(LR.Lower_left, MD.Forward, speed)
    mecanumRobot.Motor(LR.Lower_right, MD.Forward, speed)
}
function bck() {
    mecanumRobot.Motor(LR.Upper_left, MD.Forward, speed)
    mecanumRobot.Motor(LR.Upper_right, MD.Back, speed * k)
    mecanumRobot.Motor(LR.Lower_left, MD.Back, speed)
    mecanumRobot.Motor(LR.Lower_right, MD.Forward, speed)
}
function fwd_df() {
    mecanumRobot.Motor(LR.Upper_left, MD.Back, speed_df)
    mecanumRobot.Motor(LR.Upper_right, MD.Forward, speed_df * k)
    mecanumRobot.Motor(LR.Lower_left, MD.Forward, speed_df)
    mecanumRobot.Motor(LR.Lower_right, MD.Back, speed_df)
}
function lft_df() {
    mecanumRobot.Motor(LR.Upper_left, MD.Forward, speed_df)
    mecanumRobot.Motor(LR.Upper_right, MD.Forward, speed_df * k)
    mecanumRobot.Motor(LR.Lower_left, MD.Back, speed_df)
    mecanumRobot.Motor(LR.Lower_right, MD.Back, speed_df)
}
function rgt_df () {
    mecanumRobot.Motor(LR.Upper_left, MD.Back, speed_df)
    mecanumRobot.Motor(LR.Upper_right, MD.Back, speed_df)
    mecanumRobot.Motor(LR.Lower_left, MD.Forward, speed_df)
    mecanumRobot.Motor(LR.Lower_right, MD.Forward, speed_df)
}
function bck_df() {
    mecanumRobot.Motor(LR.Upper_left, MD.Forward, speed_df)
    mecanumRobot.Motor(LR.Upper_right, MD.Back, speed_df * k)
    mecanumRobot.Motor(LR.Lower_left, MD.Back, speed_df)
    mecanumRobot.Motor(LR.Lower_right, MD.Forward, speed_df)
}
//funkce samotného ježdění
function independent_driving () {
    let dst = 0
    let dst_lf = 0
    let dst_rt = 0

    basic.showString("m1")
    basic.pause(500)

    basic.forever(function () {
        dst = mecanumRobot.ultra()
        if (dst < 30) {
            mecanumRobot.state(MotorState.stop)
            basic.pause(1000)
            mecanumRobot.setServo(0)
            basic.pause(1000)
            dst_rt = mecanumRobot.ultra()
            mecanumRobot.setServo(180)
            basic.pause(1000)
            dst_rt = mecanumRobot.ultra()
            if (dst_lf < dst_rt) {
                rgt()
                mecanumRobot.setServo(90)
                basic.pause(500)
            }
            else {
                lft()
                mecanumRobot.setServo(90)
                basic.pause(500)
            }

        }
        else {
            fwd()
        }
    })

}
//funkce nasledování objektu
function follow() {
    basic.showString("m2")
    basic.pause(500)

    basic.forever(function () {
        let distance = 0

        distance = mecanumRobot.ultra()
        if (distance < 30) {
            mecanumRobot.state(MotorState.stop)
        }
        if (distance < 75) {
            fwd()
        }
        else {
            mecanumRobot.state(MotorState.stop)
        }

    })

}
//funkce ježdění podle čáry
function line() {
    basic.showString("m3")
    basic.pause(500)

    basic.forever(function () {
        if (mecanumRobot.LineTracking(LT.Left) == 0 && mecanumRobot.LineTracking(LT.Right) == 1) {
            rgt_df()
        }
        else if (mecanumRobot.LineTracking(LT.Left) == 1 && mecanumRobot.LineTracking(LT.Right) == 0) {
            lft_df()
        }
        else if (mecanumRobot.LineTracking(LT.Left) == 1 && mecanumRobot.LineTracking(LT.Right) == 1) {
            fwd_df()
        }
        else {
            mecanumRobot.state(MotorState.stop)
        }
    })
}
//funkce spojení vozidla s mobilovou aplikací a následné řízení 
function controller() {
    let connection: boolean = false
    basic.showString("m4")
    basic.pause(1000)
    bluetooth.startUartService()

    bluetooth.onBluetoothConnected(function () {
        basic.showString("c")
        connection = true
        let buttons = ""
        while (connection = true) {
            buttons = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
            serial.writeString(buttons)
            serial.writeLine("")
            if (buttons == "a") {
                fwd()
            } else if (buttons == "b") {
                lft()
            } else if (buttons == "c") {
                bck ()
            } else if (buttons == "d") {
                rgt()
            }else if (buttons == "s") {
                mecanumRobot.state(MotorState.stop)
                mecanumRobot.setServo(90)
            }
        }
    })
    
    bluetooth.onBluetoothDisconnected(function () {
        basic.showString("d")
        connection = false
    })

}