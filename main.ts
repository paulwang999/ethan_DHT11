//% color=#0fbc11 icon="" block="DHT11 Sensor"
namespace ethan_dht11 {

    let lastTemp = 0
    let lastHum = 0

    // 内部函数：执行一次 DHT11 读取
    function readDHT11(pin: DigitalPin): boolean {
        let data: number[] = []
        let i = 0

        pins.digitalWritePin(pin, 0)
        basic.pause(18)
        pins.setPull(pin, PinPullMode.PullUp)
        pins.digitalReadPin(pin)
        control.waitMicros(40)

        if (pins.digitalReadPin(pin) == 0) {
            while (pins.digitalReadPin(pin) == 0);
            while (pins.digitalReadPin(pin) == 1);

            for (i = 0; i < 40; i++) {
                while (pins.digitalReadPin(pin) == 0);
                let t = control.micros()
                while (pins.digitalReadPin(pin) == 1);
                if (control.micros() - t > 40) data.push(1)
                else data.push(0)
            }

            let hum = 0
            let temp = 0

            for (i = 0; i < 8; i++) hum = (hum << 1) + data[i]
            for (i = 16; i < 24; i++) temp = (temp << 1) + data[i]

            lastHum = hum
            lastTemp = temp
            return true
        } else {
            return false
        }
    }

    //% block="read DHT11 temperature at pin %pin"
    //% pin.defl=DigitalPin.P0
    export function readTemperature(pin: DigitalPin): number {
        if (readDHT11(pin)) return lastTemp
        else return lastTemp
    }

    //% block="read DHT11 humidity at pin %pin"
    //% pin.defl=DigitalPin.P0
    export function readHumidity(pin: DigitalPin): number {
        if (readDHT11(pin)) return lastHum
        else return lastHum
    }
}
